import { MesApi } from '../api/mesApi'
import Vue from 'vue'
import  { routerDependencies } from '../router'

const api = new MesApi()
/* eslint-disable */
export default {
  async initializeProperties({commit}) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const result = await api.getPropertiesFromGql()
        commit('setProperties', result.data.mes.properties)
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
  async initializeWorkCenter({ commit }, fetchPolicy) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let uuid = $cookies.get('mesUuid'),
        sessionStorageUuid = window.sessionStorage.getItem('mesUuid')

        if (!uuid && sessionStorageUuid) {
          uuid = sessionStorageUuid
        } else if (!uuid && !sessionStorageUuid) {
          uuid = api.generateUUID()
          // Caching for 3 year
          $cookies.set('mesUuid', uuid, '3y')
        }

        window.sessionStorage.setItem('mesUuid', uuid)
        console.log('Current UUID - ' + uuid)

        const workCenters = await api.getWorkCentersFromGql(uuid, undefined, fetchPolicy)
        if (workCenters.length == 1) {
          commit('setWorkCenter', workCenters[0])
        } else {
          commit('setWorkCentersForWorker', workCenters)
        }
        commit('setInitialWorkCenter', true)
      }
    })
  },
  async initializeTasks({ commit }, { workCenterCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let tasks = await api.getTasksFromGql(workCenterCode, fetchPolicy)
        var sortedTasks = await this.dispatch('mes/sortingTaskFn', { tasks: tasks })
        commit('setTasks', sortedTasks)

        if (fetchPolicy == 'network-only') {
          this.dispatch('mes/selectTaskAfterRefresh')
        }
      }
    })
  },
  async downloadDowntimes({ commit }, { workCenterCode, dateTime }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let downtimes = await api.getDowntimesPreviousFromGql(workCenterCode, dateTime)
        commit('setDowntimes', downtimes)
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
      }
    })
  },
  async initializeUsersProductionEvents({ commit }, { workerCode, fetchPolicy }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        let usersProductionEvents = await api.getUsersProductionEventsFromGql(workerCode, fetchPolicy)
        commit('setUsersProductionEvents', usersProductionEvents || [])
      }
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
  async initializeDowntimeFormio({ commit }, workCenter) {
    commit('resetDowntimeFormio')
    await this.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getDowntimeFormioFromGql(workCenter.downtimeRegistrationFormCode, { workCenterCode: workCenter.code }, 'network-only')
      },
      successAction: async result => { commit('setDowntimeFormio', result) },
      linearLoader: true
    })
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },
  async productionFormIoSubmit({ commit }, { workCenter, data, task }) {
    var me = this,
      params = {
        formCode: workCenter.productionRegistrationFormCode,
        data: data,
        productionRegistrationParam: {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode,
          mode: 'FINISH'
        }
      }
    commit('setDialogLinearLoaderMessage', 'Регистрация выработки')
    await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        const res = await api.productionFormIoSubmitGql(params)
        return res
      },
      successAction: async () => { me.dispatch('mes/initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' }) }
    })
    commit('closeDialogLinearLoader')
  },
  async downtimeFormIoSubmit({ commit }, { workCenter, data }) {
     var me = this,
        params = {
         formCode: workCenter.downtimeRegistrationFormCode,
         data: data,
         downtimeParams: {
           workCenterCode: workCenter.code,
         }
       }
     commit('setDialogLinearLoaderMessage', 'Регистрация простоя')
     await me.dispatch('mes/graphqlQueryWithRequestResultWraper', {
        queryAction: async () => {
          const res = await api.downtimeFormIoSubmitGql(params)
          return res
       },
       successAction: async () => { me.dispatch('mes/downloadDowntimes', { workCenterCode: workCenter.code, dateTime: new Date().toJSON(), fetchPolicy: 'network-only' }) }
     })
     commit('closeDialogLinearLoader')
  },
  changeDragResizeMode({commit}) {
    commit('changeDragResizeMode')
  },
  async graphqlQueryWithRequestResultWraper({ commit }, { queryAction, successAction, linearLoader }) {
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
  setObsoluteDataTask({ commit }, obsoluteData) {
    commit('setObsoluteDataTask', obsoluteData)
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
  async getFixationWorkCenterForWorker ({ commit }, { workerCode, fetchPolicy } ) {
    return await this.dispatch('mes/graphqlQueryWraper', {
      action: async () => {
        const res = await api.getWorkCentersFixedFromGql(workerCode, fetchPolicy)
        return res
      }
    })
  },
  async sortingTaskFn({ commit }, { tasks }) {
    var tasksInProgress = [],
      tasksIsNotInProgress = [],
      completeSortedTasks = []
    tasks.sort((a,b) => {
      return new Date(a.startDateTime).getTime() > new Date(b.startDateTime).getTime() ?
        1 : (new Date(a.startDateTime).getTime() == new Date(b.startDateTime).getTime() ? 0 : -1)
    })
    if (tasks.length) {
      for (var i = tasks.length - 1; i >= 0; i--) {
        var task = tasks[i]
        if (task.inProgress) {
          tasksInProgress.push(task)
        } else {
          tasksIsNotInProgress.push(task)
        }
      }
      completeSortedTasks = tasksInProgress.concat(tasksIsNotInProgress)
    }
    return completeSortedTasks
  }
}