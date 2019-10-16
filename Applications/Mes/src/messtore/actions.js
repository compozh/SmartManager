import { MesApi } from '../api/mesApi'
import Vue from 'vue'
import  { routerDependencies } from '../router'

const api = new MesApi()

/* eslint-disable */
export default {
  async initializeProperties({ commit, getters }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const result = await api.getPropertiesFromGql()
        let properties = result.data.mes.properties
        commit('setProperties', properties)

        for(var action of getters.actionsAfterInitializeProperties) {
          action(properties)
        }
        commit('setActionsAfterInitializeProperties', [])
      }
    })
  },
  async initializeTicket({commit}) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const result = await api.getTicketFromGql()
        commit('setTicket', result.data.mes.ticket)
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

        if (workCenters.length == 1) {
          commit('setWorkCenter', workCenters[0])
        } else {
          var setWorkCenterForWorker = async (properties) => {
            var workCenterForWorker = await dispatch('getFixationWorkCenterForWorker', { workerCode: properties.workerCode, fetchPolicy: 'network-only' })
            workCenterForWorker = workCenterForWorker.sort((a,b) => {
              return a.fixationId > b.fixationId ? -1 : a.fixationId == b.fixationId ? 0 : 1
            })

              for(var workCenter of workCenters) {
                for(var fixWorkCetner of workCenterForWorker) {
                  if(fixWorkCetner.code == workCenter.code) {
                    commit('setWorkCenter', workCenter)
                    commit('setWorkCenterState', fixWorkCetner.state)
                    commit('setWorkCenterDescription', fixWorkCetner.description)
                    return
                  }
                }
              }
          }

          if(!getters.properties) {
            commit('addActionAfterInitializeProperties', setWorkCenterForWorker)
          } else {
            await setWorkCenterForWorker(getters.properties)
          }
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
  async registerProduction({ commit }, { workCenter, task }) {
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
      successAction: async () => { commit('setWorkCenter', workCenter) },
      linearLoader: true
    })
  },
  async cancelBeginRegistration({ commit }, task) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () =>  {
        const res = await api.cancelBeginRegistrationGql(task.shiftTaskId)
        return res
      },
      successAction: async () => { task.inProgress = false },
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
  async createProductionFormio({ commit }, { formCode, properties }) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.getProductionFormioFromGql(formCode, properties)
        return res
      },
      successAction: async result => { commit('setProductionFormio', result) },
      linearLoader: true
    })
  },
  async initializeCreateDowntimeFormio({ commit }, workCenter) {
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getDowntimeFormioFromGql(workCenter.downtimeRegistrationFormCode, { workCenterCode: workCenter.code })
      },
      successAction: async result => { commit('setCreateDowntimeFormio', result) },
    })
  },
  async initializeDowntimeFormio({ commit }, { workCenter, downtimeId }) {
    commit('resetDowntimeFormio')
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getDowntimeFormioFromGql(workCenter.downtimeRegistrationFormCode, { workCenterCode: workCenter.code , id: downtimeId }, 'network-only')
      },
      successAction: async result => { commit('setDowntimeFormio', result) },
      linearLoader: true
    })
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },
  async productionFormIoSubmit({ commit }, { workCenter, submission, task }) {
    var me = this
    commit('setDialogLinearLoaderMessage', 'Регистрация выработки')
    await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {

        const res = await api.productionFormioSubmitGql(workCenter.productionRegistrationFormCode, submission, {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode,
          mode: 'FINISH'
        })
        return res
      },
      successAction: async () => { me.dispatch('mes/initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' }) }
    })
    commit('closeDialogLinearLoader')
  },
  async downtimeFormIoSubmit({ commit }, { workCenter, submission, successAction }) {
     var me = this,
        currentDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toJSON()
     commit('setDialogLinearLoaderMessage', 'Регистрация простоя')
     await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
        queryAction: async () => {
          const res = await api.downtimeFormioSubmitGql(workCenter.downtimeRegistrationFormCode, submission, {
            workCenterCode: workCenter.code,
          })
          return res
       },
       successAction: async () => {
         me.dispatch('mes/downloadDowntimes', { workCenterCode: workCenter.code, dateTime: currentDate, fetchPolicy: 'network-only' })
         if(successAction) {
          successAction();
         }
        }
     })
     commit('closeDialogLinearLoader')
  },
  changeDragResizeMode({commit}) {
    commit('changeDragResizeMode')
  },
  async graphqlQueryWithRequestResultWraper({ commit }, { queryAction, successAction, linearLoader, actionAfterQuery }) {
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
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
  },
  async graphqlQueryWraper({ commit }, { action, linearLoader }) {
    commit('closeSnackbar')

    if (linearLoader) {
      commit('setLinearLoader', true)
    }
    var result;
    try {
      result = await action()
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
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
  }
}
