import {MesApi} from '../api/mesApi'

const api = new MesApi()

export default {
  async initializeProperties({commit}) {
    commit('closeSnackbar');

    try {
      const result = await api.getPropertiesFromGql();
      commit('setProperties', result.data.mes.properties)
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeTicket({commit}) {
    try {
      const result = await api.getTicketFromGql();
      commit('setTicket', result.data.mes.tiket)
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeWorkCenter({ commit }, fetchPolicy) {
    commit('closeSnackbar');
    try {
      let uuid = "d520c7a8-421b-4563-b955-f5abc56b97ec",
        workCenters = await api.getWorkCentersFromGql(uuid, undefined, fetchPolicy);

      if(workCenters.length == 1) {
        commit('setWorkCenter', workCenters[0]);
      }
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeTasks({ commit }, { workCenterCode, fetchPolicy }) {
    commit('closeSnackbar');
    try {
        let tasks = await api.getTasksFromGql(workCenterCode, fetchPolicy);
        commit('setTasks', tasks);

      if(fetchPolicy == 'network-only') {
        this.dispatch('mes/selectTaskAfterRefresh');
      }
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeInstallations({ commit }, { workCenterCode, fetchPolicy }) {
    commit('closeSnackbar');

    try {
      let installations = await api.getInstallationsFromGql(workCenterCode, fetchPolicy);
      commit('setInstallations', installations);
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async removeInstallation({ commit }, installation) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.removeInstallationGql(installation.id), 
      successAction: async result => { commit('removeInstallation', installation) },
      linearLoader: true
    });
  },
  async registerMaterialInstallation({ commit }, { workCenterCode, batchBarcode, factId }) {
    var me = this;
    await me.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId), 
      successAction: async result => { await me.dispatch('mes/initializeInstallations', { workCenterCode, fetchPolicy: "network-only" }) },
      linearLoader: true
    });
  },
  async registerProduction({ commit }, { workCenter, task }) {
    var me = this,
      productionRegistrationParam = {
        workCenterCode: workCenter.code,
        workBarcode: task.barcode,
        mode: 'Start',
        success: true
      };
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.registerProductionGql(productionRegistrationParam), 
      successAction: async result => {
        //todo
        commit('resetProductionFormio');
        task.inProgress = true;
        let properties = {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode
        };
        me.dispatch('mes/createProductionFormio', { formCode: workCenter.productionRegistrationFormCode, properties }); },
      linearLoader: true
    });
  },
  async cancelBeginRegistration({ commit }, task) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.cancelBeginRegistrationGql(task.shiftTaskId), 
      successAction: async result => { task.inProgress = false; },
      linearLoader: true
    });
  },
  async initializeProductions({ commit }, { workerCode, fetchPolicy }) {
    commit('closeSnackbar');

    try {
      let productions = await api.getProductionsFromGql(workerCode, fetchPolicy);
      commit('setProductions', productions || []);
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async deleteProduction({ commit }, production) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.deleteProductionGql(production.factId), 
      successAction: async result => { commit('removeProduction', production); },
      linearLoader: true
    });
  },
  async createProductionFormio({ commit }, { formCode, properties }) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.getProductionFormioFromGql(formCode, properties), 
      successAction: async result => { commit('setProductionFormio', result) },
      linearLoader: true
    });
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode);
  },
  async productionFormIoSubmit({ commit }, { workCenter, data, task }) {
    var me = this,
      params = {
        formCode: workCenter.productionRegistrationFormCode,
        data: data,
        productionRegistrationParam : {
          workCenterCode: workCenter.code,
          workBarcode: task.barcode,
          mode: "FINISH"
        }
      };
    commit('setDialogLinearLoaderMessage', 'Регистрация выработки');
    await me.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.productionFormIoSubmitGql(params), 
      successAction: async result => { me.dispatch('mes/initializeTasks', { workCenter, fetchPolicy: 'network-only' }); },
      linearLoader: false
    });
    commit('closeDialogLinearLoader');
  },
  changeDragResizeMode({commit}) {
    commit('changeDragResizeMode');
  },
  async graphqlQueryWraper({ commit }, { queryAction, successAction, linearLoader }) {
    commit('closeSnackbar');

    if(linearLoader) {
      commit('setLinearLoader', true);
    }
    
    try {
      let result = await queryAction();
      if(result.success == true) {
        if(successAction) {
          await successAction(result);
        }
        if(result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage);
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage);
      }
    } catch(e) {
      commit('setSnackbarErrorMessage', e.message);
    }
    if(linearLoader) {
      commit('setLinearLoader', false);
    }
  },
  setObsoluteDataTask({ commit }, obsoluteData) {
    commit('setObsoluteDataTask', obsoluteData);
  },
  selectTaskAfterRefresh({ getters, commit }) {
    let selectedTask = getters.selectedTask,
      tasks = getters.tasks;

    for(let task of tasks) {
      if(selectedTask.shiftTaskId == task.shiftTaskId) {
        commit('setSelectedTask', task);
      }
    }
  }
}