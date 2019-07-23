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
  async getWorkCenters({commit}, payload) {
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
  async getShiftTasks({commit}, payload) {
    const workCenter = payload.workCenter

    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getTasksFromGql(workCenter)
      const shiftTasks = result.data.shiftTasks

      commit('setShiftTasks', shiftTasks)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  }
}
