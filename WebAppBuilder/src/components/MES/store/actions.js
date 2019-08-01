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
  async setupWorkCenters({commit}, payload) {
    const uuid = payload.uuid
    const login = payload.login

    commit('setError', null)
    commit('setCircularLoader', true)

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
  async setupTasks({commit}, payload) {
    const workCenters = payload.workCenters

    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      var tasks = [];
      for(var i = 0; i < workCenters.length; i++) {
        let workCenter = workCenters[i];
        let result = await api.getTasksFromGql(workCenter.code);
        let tasksByWorkCenter = result.data.mes.tasks;
        tasks = tasks.concat(tasksByWorkCenter);
      }
      commit('setTasks', tasks)
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async setupInstallationsByWorkCenter({commit}, workCenterCode) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.getInstallationsFromGql(workCenterCode);
      debugger;
      commit('setInstallations', result.data.mes.installations)
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async removeInstallation({commit}, installation) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      let result = await api.removeInstallation(installation.id);

      commit('setCircularLoader', false)

      return result.data.mes.result;
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
    return false;
  },
  toggleMenuMiniMode({getters, commit}) {
    commit('setMenuMiniMode', !getters.menuMiniMode);
  }
}
