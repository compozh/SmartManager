import { MesApi } from '../api/mesApi'

const api = new MesApi()

/* eslint-disable */
export default {
  async initializeUser({ commit, getters }) {
    await this.dispatch('mes/graphqlQueryWraper', {

      action: async () => {
        await api.getUser()
      }
    })
  },
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
  async uploadDowntimes({ commit, getters }, { workCenterCode, dateTime }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let downtimes = await api.getDowntimesPreviousFromGql(workCenterCode, dateTime)
        commit('setDowntimes', downtimes)
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
  async uploadQualities({ commit}, retrieveParams) {
    await this.dispatch('mes/graphqlQueryWraper', {
        action: async () => {
          let qualities = await api.getQualitiesFromGql(retrieveParams)
          commit('setQualities', qualities)
          commit('setInitializeQualities', true)
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
  async uploadDocuments({ commit, getters }, retrieveParams) {
    await this.dispatch('mes/graphqlQueryWraper', {
        action: async () => {
          let documents = await api.getDocumentsFromGql(retrieveParams)
          commit('setDocuments', documents)
          commit('setInitializeDocuments', true)
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

  async initializeInstallations({ dispatch }, { workCenterCode }) {
    var result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let installations = await api.getInstallationsFromGql(workCenterCode)
        return installations
      }
    })

    return result
  },

  async removeInstallation({ commit }, installation) {
    var result = await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.removeInstallationGql(installation.id)
        return res
      }
    })

    return result
  },

  async registerMaterialInstallation({ commit }, { workCenterCode, batchBarcode, factId }) {
    var me = this
    var result = await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId)
        return res
      }
    })

    return result
  },

  async registerProduction({ dispatch, getters }, { workCenter, task, deviceSizeType }) {
    var me = this,
      productionRegistrationParam = {
        workCenterCode: workCenter.code,
        workBarcode: task.barcode,
        mode: 'Start',
        success: true
      }
    await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.registerProductionGql(productionRegistrationParam)
        return res
      },
      successAction: async () => {
        task.inProgress = true
        dispatch('updateProductionFormio', { workCenter, deviceSizeType, task })
      },
    })
  },

  async updateProductionFormio ({ commit, dispatch, getters }, { workCenter, deviceSizeType, task }) {
    var currentTask = getters['selectedTask']
    if(!currentTask || currentTask.shiftTaskId !== task.shiftTaskId) {
      return
    }
    commit('resetProductionFormio')
    let properties = {
      WORKCENTERCODE: workCenter.code,
      WORKBARCODE: task.barcode,
      instance: task
    }
    dispatch('createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties, deviceSizeType })
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

  async cancelBeginRegistration({ commit, dispatch }, { task, deviceSizeType, workCenter }) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.cancelBeginRegistrationGql(task.shiftTaskId)
        return res
      },
      successAction: async () => {
        task.inProgress = false
        dispatch('updateProductionFormio', { workCenter, deviceSizeType, task })
      },
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

  async setMaterialProduction({ commit, getters, dispatch }, production) {
    await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.setMaterialProductionGql(production.factId, true, getters.workCenter.code)
        return res
      },
      successAction: async () => { commit('setMaterialProduction', production) },
    })
  },

  async createProductionFormio({ commit, dispatch, getters }, { formCode, properties, deviceSizeType }) {
    var params = {
      params: JSON.stringify(properties || '', null, 4),
      deviceSizeType: deviceSizeType || 'lg'
    }
    await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.getProductionFormioFromGql(formCode, params)
        return res
      },
      successAction: async result => {
        var currentTask = getters['selectedTask']
        var intance = properties.instance
        if(!currentTask || !intance || currentTask.shiftTaskId !== intance.shiftTaskId) {
          return
        }
        commit('setProductionFormio', result)
      },
      linearLoader: true
    })
  },

  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },

  toggleMenuDrawerMode({getters, commit}) {
    commit('setMenuDrawerMode', !getters.menuDrawerMode)
  },

  async productionFormIoSubmit({ commit, dispatch }, { workCenter, submission, task, message, deviceSizeType }) {
    commit('setDialogLinearLoaderMessage', message)
    var submitResult = await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        var params = {
            submission,
            params: JSON.stringify({
              WORKCENTERCODE: workCenter.code,
              WORKBARCODE: task.barcode,
              MODE: 2,
              instance: task
            }),
            deviceSizeType: deviceSizeType || 'lg'
        }
        const res = await api.productionFormioSubmitGql(workCenter.productionRegistrationFormCode, params)
        return res
      },
      successAction: async () => {
        dispatch('initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' })
        var properties = {
          WORKCENTERCODE: workCenter.code,
          WORKBARCODE: task.barcode,
          instance: task
        }
        dispatch('createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties, deviceSizeType})
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
    var result
    try {
      result = await queryAction()
      if (result.success) {
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

  async unfixWorkCenterForWorker({ dispatch }, fixationId) {
    await dispatch('graphqlQueryWraper', {
      action: async () => {
        await api.unfixWorkCenterForWorkerGql(fixationId)
      }
    })
  },

  async getFixationWorkCenterForWorker ({ dispatch }, { workerCode, fetchPolicy } ) {
    return await dispatch('graphqlQueryWraper', {
      action: async () => {
        return await api.getWorkCentersFixedFromGql(workerCode, fetchPolicy)
      }
    })
  },

  async verifyCamera({ commit }) {
      if(!navigator.mediaDevices) {
        commit('setCameraAvailability', false)
        return
      }
      await navigator.mediaDevices.getUserMedia({video: true}).then(() => {
        return commit('setCameraAvailability', true)
      }).catch(() => {
        return commit('setCameraAvailability', false)
      })
  },

  async initializeIotSignalRUrl ({ dispatch, commit, getters }, { thingId }) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getIotSignalRUrlFromGql(thingId)
      },
      successAction: result => {
        if (result.success) {
          getters['iotSettings'].iotSignalRUrl =  result.url
        }
      },
    })
  }
}
