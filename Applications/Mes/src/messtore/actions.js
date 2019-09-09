import {MesApi} from '../api/mesApi'
import Vue from 'vue'
import  { routerDependencies } from '../router'

const api = new MesApi()
/* eslint-disable */
export default {
  async initializeProperties({commit}) {
    commit('closeSnackbar')
    try {
      const result = await api.getPropertiesFromGql()
      commit('setProperties', result.data.mes.properties)
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      } else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async initializeUserName({commit}) {
    commit('closeSnackbar')
    try {
    Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
      const UserName = currentUSer.CurrentUserData.UserName
        return commit('setUserName', UserName)
      })
    }
    catch (e) {
      console.log(e)
    }

  },
  async initializeTicket({commit}) {
    try {
      const result = await api.getTicketFromGql()
      commit('setTicket', result.data.mes.ticket)
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      } else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async initializeWorkCenter({ commit }, fetchPolicy) {
    commit('closeSnackbar')
    var uuid = $cookies.get('mesUuid')
    var sessionStorageUuid = window.sessionStorage.getItem('mesUuid')
    if (!uuid && sessionStorageUuid) {
      uuid = sessionStorageUuid
    } else if (!uuid && !sessionStorageUuid) {
      uuid = api.generateUUID()
      // Кеширование до 3х лет
      $cookies.set('mesUuid', uuid, '3y')
    }
    window.sessionStorage.setItem('mesUuid', uuid)
    console.log(uuid)
    try {
      const workCenters = await api.getWorkCentersFromGql(uuid, undefined, fetchPolicy)
      commit('setInitialWorkCenter', true)
      if (workCenters.length == 1) {
        commit('setWorkCenter', workCenters[0])
      } else {
        await this.dispatch('mes/initializeProperties')
        var props = this.getters['mes/properties']
        var workerCode = props.workerCode
        var fixations = await api.getWorkCentersFixedFromGql(workerCode, 'network-only')
        var firstWorkCenter = fixations.length ? fixations[0] : ''
        commit('setWorkCentersForWorker', { workCenters, firstWorkCenter })
      }
    }
    catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async initializeTasks({ commit }, { workCenterCode, fetchPolicy }) {
    commit('closeSnackbar')
    try {
      let tasks = await api.getTasksFromGql(workCenterCode, fetchPolicy)
      .catch( e => {
        if (e.networkError && e.networkError && e.networkError.statusCode == 401) {
          Vue.prototype.$authentication.resetCurentUser()
          routerDependencies.router.push({name: 'LOGIN'})
        }
      })
      var sortedTasks = await this.dispatch('mes/sortingTaskFn', { tasks: tasks })
      commit('setTasks', sortedTasks)

      if (fetchPolicy == 'network-only') {
        this.dispatch('mes/selectTaskAfterRefresh')
      }
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message)
    }
  },
  async downloadDowntimes({ commit }, { workCenterCode, dateTime }) {
    commit('closeSnackbar')
    try {
      let downtimes = await api.getDowntimesPreviousFromGql(workCenterCode, dateTime)
      .catch( e => {
        if (e.networkError && e.networkError && e.networkError.statusCode == 401) {
          Vue.prototype.$authentication.resetCurentUser()
          routerDependencies.router.push({name: 'LOGIN'})
        }
      })
      commit('setDowntimes', downtimes)
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message)
    }
  },
  async initializeInstallations({ commit }, { workCenterCode, fetchPolicy }) {
    commit('closeSnackbar')

    try {
      let installations = await api.getInstallationsFromGql(workCenterCode, fetchPolicy)
      commit('setInstallations', installations)
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      } else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async removeInstallation({ commit }, installation) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () =>  {
        try {
          const res = await api.removeInstallationGql(installation.id)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async () => { commit('removeInstallation', installation) }
    })
  },
  async registerMaterialInstallation({ commit }, { workCenterCode, batchBarcode, factId }) {
    var me = this
    await me.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () =>  {
        try {
          const res = await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
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
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () =>  {
        try {
          const res = await api.registerProductionGql(productionRegistrationParam)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
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
  async fixWorkCenterForWorker({ commit }, { workCenterCode, workerCode }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () =>  {
        try {
          const res = await api.fixWorkCenterForWorkerGql(workCenterCode, workerCode)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async () => { this.dispatch('mes/initializeWorkCenter', 'network-only') },
      linearLoader: true
    })
  },
  async cancelBeginRegistration({ commit }, task) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () =>  {
        try {
          const res = await api.cancelBeginRegistrationGql(task.shiftTaskId)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
        }
      },
      successAction: async () => { task.inProgress = false },
      linearLoader: true
    })
  },
  async initializeProductions({ commit }, { workerCode, fetchPolicy }) {
    commit('closeSnackbar')

    try {
      let productions = await api.getProductionsFromGql(workerCode, fetchPolicy)
      commit('setProductions', productions || [])
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      } else {
      commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async deleteProduction({ commit }, production) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () => {
        try {
          const res = await api.deleteProductionGql(production.factId)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async () => { commit('removeProduction', production) },
    })
  },
  async createProductionFormio({ commit }, { formCode, properties }) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () => {
        try {
          const res = await api.getProductionFormioFromGql(formCode, properties)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async result => { commit('setProductionFormio', result) },
      linearLoader: true
    })
  },
  async initializeCreateDowntimeFormio({ commit }, workCenter) {
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () => {
        try {
          return await api.getDowntimeFormioFromGql(workCenter.downtimeRegistrationFormCode, { workCenterCode: workCenter.code })
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async result => { commit('setCreateDowntimeFormio', result) },
    })
  },
  async initializeDowntimeFormio({ commit }, workCenter) {
    commit('resetDowntimeFormio')
    await this.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () => {
        try {
          return await api.getDowntimeFormioFromGql(workCenter.downtimeRegistrationFormCode, { workCenterCode: workCenter.code }, 'network-only')
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
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
    await me.dispatch('mes/graphqlQueryWraper', {
      queryAction: async () => {
        try {
          const res = await api.productionFormIoSubmitGql(params)
          return res
        }
        catch (e) {
          if (e.networkError && e.networkError.statusCode == 401) {
            Vue.prototype.$authentication.resetCurentUser()
            routerDependencies.router.push({name: 'LOGIN'})
          }
          else {
            commit('setSnackbarErrorMessage', e.message)
          }
        }
      },
      successAction: async () => { me.dispatch('mes/initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' }) },
      linearLoader: false
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
     await me.dispatch('mes/graphqlQueryWraper', {
       queryAction: async () => {
         try {
           const res = await api.downtimeFormIoSubmitGql(params)
           return res
         }
         catch (e) {
           debugger;
           if (e.networkError && e.networkError.statusCode == 401) {
             Vue.prototype.$authentication.resetCurentUser()
             routerDependencies.router.push({name: 'LOGIN'})
           }
           else {
             commit('setSnackbarErrorMessage', e.message)
           }
         }
       },
       successAction: async () => { console.log('success') },
     })
     commit('closeDialogLinearLoader')
  },
  changeDragResizeMode({commit}) {
    commit('changeDragResizeMode')
  },
  async graphqlQueryWraper({ commit }, { queryAction, successAction, linearLoader }) {
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
      commit('setSnackbarErrorMessage', e.message)
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
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
    try {
      let unfixation = await api.unfixWorkCenterForWorkerGql(fixationId)
    }
    catch (e){
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async getFixationWorkCenterForWorker ({ commit }, { workerCode, fetchPolicy } ) {
    try {
      const res = await api.getWorkCentersFixedFromGql(workerCode, fetchPolicy)
      return res
    }
    catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
  },
  async initializeWorkCenterBySelection({ commit }, workCenter){
    commit('setDialogLinearLoaderMessage', 'Смена рабочего центра')
    var props = this.getters['mes/properties']
    var workerCode = props.workerCode
    var dateTime = new Date().toJSON()
    const workCentersFixed =  await this.dispatch('mes/getFixationWorkCenterForWorker', { workerCode: workerCode, fetchPolicy: 'network-only' })
    if (!workCentersFixed) {
      commit('closeDialogLinearLoader')
      return
    }
    workCentersFixed.forEach(fixation => {
      if (fixation.code == workCenter.code) {
        var fixationId = fixation.fixationId
        this.dispatch('mes/unfixWorkCenterForWorker', { fixationId: fixationId })
      }
    });
    await commit('resetState')
    await commit('setWorkCenter', workCenter)
    await this.dispatch('mes/initializeTasks', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' })
    await this.dispatch('mes/downloadDowntimes', { workCenterCode: workCenter.code, dateTime: dateTime })
    await this.dispatch('mes/initializeInstallations', { workCenterCode: workCenter.code, fetchPolicy: 'network-only' })
    await this.dispatch('mes/fixWorkCenterForWorker', { workCenterCode: workCenter.code, workerCode: props.workerCode })
    commit('closeDialogLinearLoader')
  },
  async sortingTaskFn({ commit }, {tasks}) {
    var tasksInProgress = []
    var tasksIsNotInProgress = []
    var completeSortedTasks = []
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
