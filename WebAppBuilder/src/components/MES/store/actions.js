import {MesApi} from '../api/mesApi'
import {DeviceUUID} from '../../../../node_modules/device-uuid'

const api = new MesApi()
const deviceUUID = new DeviceUUID()

export default {
  async initializeProperties({commit}) {
    commit('setError', null)

    try {
      const result = await api.getPropertiesFromGql();
      commit('setProperties', result.data.mes.properties)
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async initializeWorkCenters({ commit }) {
    commit('setError', null)
    try {
      let uuid = "QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4=";//deviceUUID.get();
      let result = await api.getWorkCentersFromGql(uuid);
      commit('setWorkCenters', result.data.mes.workCenters)
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async initializeTasks({ commit}, workCenters) {
    commit('setError', null)
    try {
      var tasks = {};
      for(var i = 0; i < workCenters.length; i++) {
        let workCenter = workCenters[i];
        let result = await api.getTasksFromGql(workCenter.code);
        let tasksByWorkCenter = result.data.mes.tasks;
        //todo
        tasksByWorkCenter.forEach(task => {
          task.workCenterCode = workCenter.code;
        });
        tasks[workCenter.code] = tasksByWorkCenter;
      }
      commit('setTasks', tasks)
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async initializeInstallations({ commit}, workCenters) {
    commit('setError', null)

    try {
      var installations = {};
      for(var i = 0; i < workCenters.length; i++) {
        let workCenter = workCenters[i];
        let result = await api.getInstallationsFromGql(workCenter.code);
        installations[workCenter.code] = result.data.mes.installations.installations;
      }
      commit('setInstallations', installations)
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async removeInstallation({commit}, { installation, workCenterCode }) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.removeInstallationGql(installation.id);
      if(result.success == true) {
        commit('removeInstallation', { installation, workCenterCode });
      } else {
        commit('setError', result.errorMessage);
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async registerMaterialInstallation({commit}, { workCenterCode, batchBarcode, factId }) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId);
      if(result.success == true) {
        await this.dispatch('mes/updateInstallationsByWorkCenter', workCenterCode);
      } else {
        commit('setError', result.errorMessage);
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async registerProduction({commit}, task) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let productionRegistrationParam = {
        workCenterCode: task.workCenter,
        workBarcode: task.barcode,
        mode: 'Start',
        success: true
      };
      
      let result = await api.registerProductionGql(productionRegistrationParam);

      if(result.success == true) {
        task.state = 'IN_WORK';
      } else {
        commit('setError', result.errorMessage);
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async cancelBeginRegistration({commit}, task) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.cancelBeginRegistrationGql(task.shiftTaskId);

      if(result.success == true) {
        task.state = 'IN_PLAN';
      } else {
        commit('setError', result.errorMessage);
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async updateInstallationsByWorkCenter({ commit }, workCenterCode) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.updateInstallationsFromGql(workCenterCode);
      commit('setInstallationsByWorkCenter', { installations: result.data.mes.installations.installations, workCenterCode });
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async initializeProductions({ commit }, workerCode) {
    commit('setError', null)

    try {
      let result = await api.getProductionsFromGql(workerCode);
      commit('setProductions', result.data.mes.usersProductionEvents);
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async deleteProduction({ commit }, production) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.deleteProductionGql(production.factId);
      if(result.success) {
        commit('deleteProduction', production);
      } else {
        commit('setError', result.errorMessage)
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  async createProductionFormio({ getters, commit }, formCode) {
    if(getters.productionFormio[formCode]) {
      return;
    }
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.getProductionFormioFromGql(formCode);
      commit('setProductionFormio', { formio: result.data.mes.productionFormIo, formCode });
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode);
  },
  setError({commit}) {
    commit('setError');
  },
  async productionFormIoSubmit({ commit }, params) {
    commit('setError', null)
    commit('setLinearLoader', true)

    try {
      let result = await api.productionFormIoSubmitGql(params);
      if(result.success == true) {

      } else {
        commit('setError', result.errorMessage);
      }
    } catch (e) {
      commit('setError', e.message)
    }
    commit('setLinearLoader', false)
  }
}