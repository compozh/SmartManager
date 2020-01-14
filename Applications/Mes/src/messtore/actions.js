import { MesApi } from '../api/mesApi'

const api = new MesApi()

/* eslint-disable */
export default {
  async initializeProperties({ commit, getters }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const properties = await api.getPropertiesFromGql()
        commit('setProperties', properties)

        for(var action of getters.actionsAfterInitializeProperties) {
          action(properties)
        }
        commit('setActionsAfterInitializeProperties', [])
      }
    })
  },

  async initializeMobilityProperties({commit}) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const result = await api.getMobilityPropertiesFromGql("MOBILITYWEB")
        commit('setMobilityProperties', result)
      }
    })
  },

  async initializeTicket({commit}) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const ticket = await api.getTicketFromGql()
        commit('setTicket', ticket)
      }
    })
  },

  async initializeWorkCenter({ dispatch, commit, getters }, uuid, fetchPolicy) {
    var me = this
    await me.dispatch('mes/graphqlQueryWraper', {
      action: async ( ) => {
        console.log('Current UUID - ' + uuid)
        const workCenters = await api.getWorkCentersFromGql(uuid, undefined, fetchPolicy)
        commit('setWorkCentersForWorker', workCenters)
          var setWorkCenterForWorker = async (properties) => {
            var fixationForWorker = await dispatch('getFixationWorkCenterForWorker', { workerCode: properties.workerCode, fetchPolicy: 'network-only' })
            if (fixationForWorker && fixationForWorker.length != 1) {
              for(var fixWorkCetner of fixationForWorker){
                await dispatch('unfixWorkCenterForWorker', {fixationId: fixWorkCetner.fixationId})
              }
            } else {
              for(var workCenter of workCenters){
                if (workCenter.code == fixationForWorker[0].code) {
                  commit('setWorkCenter', workCenter)
                }
              }
              commit('setWorkCenterFixationData', fixationForWorker[0])
            }
          }
          if(!getters.properties) {
            commit('addActionAfterInitializeProperties', setWorkCenterForWorker)
          } else {
            await setWorkCenterForWorker(getters.properties)
          }
        commit('setInitialWorkCenter', true)
      },
      linearLoader: true
    })
  },

  async initializeTasks({ commit }, { workCenterCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let tasks = await api.getTasksFromGql(workCenterCode, fetchPolicy)
        commit('setTasks', tasks)

        if (fetchPolicy == 'network-only') {
          this.dispatch('mes/selectTaskAfterRefresh')
        }
      }
    })
  },

  async downloadDowntimes({ commit, getters }, { workCenterCode, dateTime }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let downtimes = await api.getDowntimesPreviousFromGql(workCenterCode, dateTime)
        if (getters.downtimes.length) {
          commit('setDowntimes', getters.downtimes.concat(downtimes))
        } else {
          commit('setDowntimes', downtimes)
        }
      }
    })
  },

  async downloadQualities({ commit, getters }, retrieveParams) {
    await this.dispatch('mes/graphqlQueryWraper', {
        action: async () => {
          let qualities = await api.getQualitiesFromGql(retrieveParams)
          if (getters.qualities.length) {
            commit('setQualities', getters.qualities.concat(qualities))
          } else {
            commit('setQualities', qualities)
            commit('setInitializeQualities', true)
          }
        }
      }
    )
  },

  async downloadDocuments({ commit, getters }, retrieveParams) {
    await this.dispatch('mes/graphqlQueryWraper', {
        action: async () => {
          let documents = await api.getDocumentsFromGql(retrieveParams)
          if (getters.documents.length) {
            commit('setDocuments', getters.documents.concat(documents))
          } else {
            commit('setDocuments', documents)
            commit('setInitializeDocuments', true)
          }
        }
      }
    )
  },

  async applyDocumentMethod ({ dispatch, commit }, processMethodParamsInput ) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.applyDocumentMethod(processMethodParamsInput)
      },
      successAction: (result) => {
        if (result.reRead){
          commit('updateDocument')
        }
      },
    })
  },

  async initializeInstallations({ commit }, { workCenterCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let installations = await api.getInstallationsFromGql(workCenterCode, fetchPolicy)
        commit('setInstallations', installations)
      }
    })
  },

  async removeInstallation({ commit }, installation) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.removeInstallationGql(installation.id)
        return res
      },
      successAction: async () => { commit('removeInstallation', installation) }
    })
  },

  async registerMaterialInstallation({ commit }, { workCenterCode, batchBarcode, factId }) {
    var me = this
    await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId)
        return res
      },
      successAction: async () => { await me.dispatch('mes/initializeInstallations', { workCenterCode, fetchPolicy: 'network-only' }) },
      linearLoader: true
    })
  },

  async registerProduction({ commit, getters }, { workCenter, task }) {
    var me = this,
      productionRegistrationParam = {
        workCenterCode: workCenter.code,
        workBarcode: task.barcode,
        mode: 'Start',
        success: true
      }
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.registerProductionGql(productionRegistrationParam)
        return res
      },
      successAction: async () => {
        //todo
        commit('resetProductionFormio')
        task.inProgress = true
        let properties = {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode
        }
        me.dispatch('mes/createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties })
      },
      linearLoader: true
    })
  },

  async fixWorkCenterForWorker({ commit }, { workCenter, workerCode }) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.fixWorkCenterForWorkerGql(workCenter.code, workerCode)
        return res
      },
      linearLoader: true
    })
  },

  async cancelBeginRegistration({ commit, getters }, task) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.cancelBeginRegistrationGql(task.shiftTaskId)
        return res
      },
      successAction: async () => {
        task.inProgress = false
      },
      linearLoader: true
    })
  },

  async initializeWorkCenterProductionEvents({ commit }, { workCenterCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let workCenterProductionEvents = await api.getWorkCenterProductionEventsFromGql(workCenterCode, fetchPolicy)
        commit('setWorkCenterProductionEvents', workCenterProductionEvents || [])
      },
      linearLoader: true
    })
  },

  async initializeUsersProductionEvents({ commit }, { workerCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let usersProductionEvents = await api.getUsersProductionEventsFromGql(workerCode, fetchPolicy)
        commit('setUsersProductionEvents', usersProductionEvents || [])
      },
      linearLoader: true
    })
  },

  async deleteProduction({ commit }, production) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.deleteProductionGql(production.factId)
        return res
      },
      successAction: async () => { commit('removeProduction', production) },
    })
  },

  async printProduction({ commit }, production) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        let checkWriteOffPercent = false
        const res = await api.printProductionGql(production.factId, checkWriteOffPercent)
        return res
      },
      successAction: async () => { commit('printProduction', production) },
    })
  },

  async setMaterialProduction({ commit, getters }, production) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.setMaterialProductionGql(production.factId, true, getters.workCenter.code)
        return res
      },
      successAction: async () => { commit('setMaterialProduction', production) },
    })
  },

  async createProductionFormio({ commit }, { formCode, properties, deviceSizeType }) {
    deviceSizeType = deviceSizeType || 'lg'
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.getProductionFormioFromGql(formCode, properties, deviceSizeType)
        return res
      },
      successAction: async result => { commit('setProductionFormio', result) },
      linearLoader: true
    })
  },

  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },

  async productionFormIoSubmit({ commit }, { workCenter, submission, task, message }) {
    var me = this
    commit('setDialogLinearLoaderMessage', message)
    var submitResult = await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {

        const res = await api.productionFormioSubmitGql(workCenter.productionRegistrationFormCode, submission, {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode,
          mode: 'FINISH'
        })
        return res
      },
      successAction: async () => {
        me.dispatch('mes/initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' })
        me.dispatch('mes/createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties: { workCenterCode: workCenter.code, workBarcode: task.barcode }})
      }
    })
    commit('closeDialogLinearLoader')

    return submitResult
  },

  changeDragResizeMode({commit}) {
    commit('changeDragResizeMode')
  },
  async graphqlQueryWithRequestResultWraper({ commit, dispatch}, { queryAction, successAction, linearLoader, actionAfterQuery }) {
    commit('closeSnackbar')

    if (linearLoader) {
      commit('setLinearLoader', true)
    }

    try {
      let result = await queryAction()
      if (result.success == true) {
        if (successAction) {
          await successAction(result)
        }
        if (result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage)
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage)
      }
      if(actionAfterQuery) {
        actionAfterQuery(result)
      }
    } catch (e) {
      if (e.networkError && e.networkError.statusCode === 401) {
        debugger
        await dispatch('auth/logout', null, { root: true })
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
  },
  async graphqlQueryWraper({ commit, dispatch }, { action, linearLoader }) {
    commit('closeSnackbar')

    if (linearLoader) {
      commit('setLinearLoader', true)
    }
    var result;
    try {
      result = await action()
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        await dispatch('auth/logout', null, { root: true })
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
    return result
  },

  selectTaskAfterRefresh({ getters, commit }) {
    let selectedTask = getters.selectedTask,
      tasks = getters.tasks
    if(!selectedTask)
    {
      return
    }
    for (let task of tasks) {
      if (selectedTask.shiftTaskId == task.shiftTaskId) {
        commit('setSelectedTask', task)
      }
    }
  },

  async unfixWorkCenterForWorker({ commit }, fixationId) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        await api.unfixWorkCenterForWorkerGql(fixationId)
      }
    })
  },

  async getFixationWorkCenterForWorker ({ dispatch, commit }, { workerCode, fetchPolicy } ) {
    return await dispatch('graphqlQueryWraper', {
      action: async () => {
        return await api.getWorkCentersFixedFromGql(workerCode, fetchPolicy)
      }
    })
  },

  async verifyCamera({ commit }) {
    await navigator.mediaDevices.getUserMedia({video: true}).then(function() {
      return commit('setCameraAvailability', true)
    }).catch(function() {
      return commit('setCameraAvailability', false)
    })
  }
}
