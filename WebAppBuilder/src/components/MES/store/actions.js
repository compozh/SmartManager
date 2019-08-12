import {MesApi} from '../api/mesApi'
import {DeviceUUID} from '../../../../node_modules/device-uuid'

const api = new MesApi()
const deviceUUID = new DeviceUUID()

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
  async initializeWorkCenters({ commit }) {
    commit('closeSnackbar');
    try {
      let uuid = deviceUUID.get(),
        result = await api.getWorkCentersFromGql(uuid);
      var workCenters = {};
      result.data.mes.workCenters.forEach(workCenter => {
        workCenters[workCenter.code] = workCenter;
      });
      commit('setWorkCenters', workCenters)
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeTasks({ commit}, { workCenterCodes, fetchPolicy }) {
    commit('closeSnackbar');
    try {
      for(var i = 0; i < workCenterCodes.length; i++) {
        let workCenterCode = workCenterCodes[i],
          result = await api.getTasksFromGql(workCenterCode, fetchPolicy),
          tasks = result.data.mes.tasks;
        //todo
        tasks.forEach(task => {
          task.workCenterCode = workCenterCode;
        });
        commit('setTasksByWorkCentrer', { workCenterCode, tasks })
      }
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async initializeInstallations({ commit}, { workCenterCodes, fetchPolicy }) {
    commit('closeSnackbar');

    try {
      for(var i = 0; i < workCenterCodes.length; i++) {
        let workCenterCode = workCenterCodes[i],
          result = await api.getInstallationsFromGql(workCenterCode, fetchPolicy);
        commit('setInstallationsByWorkCenter', { workCenterCode, installations: result.data.mes.installations.installations });
      }
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async removeInstallation({commit}, { installation, workCenterCode }) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.removeInstallationGql(installation.id), 
      successAction: async result => { commit('removeInstallation', { installation, workCenterCode }) },
      linearLoader: true
    });
  },
  async registerMaterialInstallation({commit}, { workCenterCode, batchBarcode, factId }) {
    var me = this;
    await me.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId), 
      successAction: async result => { await me.dispatch('mes/initializeInstallations', { workCenterCodes: [workCenterCode], fetchPolicy: "network-only" }) },
      linearLoader: true
    });
  },
  async registerProduction({commit}, task) {
    var productionRegistrationParam = {
      workCenterCode: task.workCenterCode,
      workBarcode: task.barcode,
      mode: 'Start',
      success: true
    };
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.registerProductionGql(productionRegistrationParam), 
      successAction: async result => { task.inProgress = true; },
      linearLoader: true
    });
  },
  async cancelBeginRegistration({commit}, task) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.cancelBeginRegistrationGql(task.shiftTaskId), 
      successAction: async result => { task.inProgress = false; },
      linearLoader: true
    });
  },
  async updateInstallationsByWorkCenter({ commit }, workCenterCode) {
    commit('closeSnackbar');
    commit('setLinearLoader', true)

    try {
      let result = await api.getInstallationsFromGql(workCenterCode, "network-only");
      commit('setInstallationsByWorkCenter', { installations: result.data.mes.installations.installations, workCenterCode });
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
    commit('setLinearLoader', false)
  },
  async initializeProductions({ commit }, { workerCode, fetchPolicy }) {
    commit('closeSnackbar');

    try {
      let result = await api.getProductionsFromGql(workerCode, fetchPolicy);
      commit('setProductions', result.data.mes.usersProductionEvents);
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message);
    }
  },
  async deleteProduction({ commit }, production) {
    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.deleteProductionGql(production.factId), 
      successAction: async result => { commit('deleteProduction', production); },
      linearLoader: true
    });
  },
  async createProductionFormio({ getters, commit }, { formCode, properties }) {
    if(getters.productionFormio[formCode]) {
      return;
    }

    await this.dispatch('mes/graphqlQueryWraper', { 
      queryAction: async () =>  await api.getProductionFormioFromGql(formCode, properties), 
      successAction: async result => { commit('setProductionFormio', { formio: result, formCode }) },
      linearLoader: true
    });
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode);
  },
  closeSnackbar({commit}) {
    commit('closeSnackbar');
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
      successAction: async result => { me.dispatch('mes/initializeTasks', { workCenterCodes: [workCenter.code], fetchPolicy: 'network-only' }); },
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
  }
}