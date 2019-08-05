import {MesApi} from '../api/mesApi'

const api = new MesApi()

export default {
  async getProperties({commit}) {

    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getPropertiesFromGql()
      const workCenters = result.data.mes.properties

      commit('setProperties', properties)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async initializeWorkCenters({ getters, commit }, payload) {
    if(getters.initializeWorkCenters) {
      return;
    }
    const uuid = payload.uuid
    const login = payload.login
    
    commit('setError', null)
    commit('setCircularLoader', true)
    commit('setInitializeWorkCenters', true)
    try {
      const result = await api.getWorkCentersFromGql(uuid, login)
      const workCenters = result.data.mes.workCenters

      commit('setWorkCenters', workCenters)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async initializeTasks({ getters, commit}, payload) {
    if(getters.initializeTasks) {
      return;
    }

    const workCenters = payload.workCenters

    commit('setError', null)
    commit('setCircularLoader', true)
    commit('setInitializeTasks', true);
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
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async initializeInstallations({ getters, commit}, workCenters) {
    if(getters.initializeInstallations) {
      return;
    }
    commit('setError', null)
    commit('setCircularLoader', true)
    commit('setInitializeInstallations', true)

    try {
      var installations = {};
      for(var i = 0; i < workCenters.length; i++) {
        let workCenter = workCenters[i];
        let result = await api.getInstallationsFromGql(workCenter.code);
        installations[workCenter.code] = result.data.mes.installations.installations;
      }
      commit('setInstallations', installations)
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async removeInstallation({commit}, { installation, workCenterCode }) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.removeInstallationGql(installation.id);
      if(result.success == true) {
        commit('removeInstallation', { installation, workCenterCode });
      } else {
        commit('setError', result.errorMessage);
      }
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async registerMaterialInstallation({commit}, { workCenterCode, batchBarcode, factId }) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.registerMaterialInstallationGql(workCenterCode, batchBarcode, factId);
      if(result.success == true) {
        this.dispatch('mes/updateInstallationsByWorkCenter', workCenterCode);
      } else {
        commit('setError', result.errorMessage);
      }
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async registerProduction({commit}, task) {
    commit('setError', null)
    commit('setCircularLoader', true)

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
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async cancelBeginRegistration({commit}, task) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.cancelBeginRegistrationGql(task.shiftTaskId);

      if(result.success == true) {
        task.state = 'IN_PLAN';
      } else {
        commit('setError', result.errorMessage);
      }
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async updateInstallationsByWorkCenter({ commit }, workCenterCode) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.getInstallationsFromGql(workCenterCode);
      commit('setInstallationsByWorkCenter', { installations: result.data.mes.installations.installations, workCenterCode });
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async initializeProductions({ getters, commit }, workerCode) {
    if(getters.initializeProductions) {
      return;
    }
    commit('setError', null)
    commit('setCircularLoader', true)
    commit('setInitializeProductions', true)

    try {
      let result = await api.productionsGql(workerCode);
      commit('setProductions', result.data.mes.usersProductionEvents);
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async deleteProduction({ commit }, production) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.deleteProductionGql(production.factId);
      debugger;
      if(true) {
        commit('deleteProduction', production);
      }
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode);
  }
}
