import { SmartManagerApi as api } from '@/api/smartManagerApi'

export default {
  async getApplicationParams ({ commit }) {
    commit('START_PRELOADER', 'appParams')
    try {
      const response = await api.getApplicationParamsFromGql()
      const result = response.data.smtasks.applicationParams
      commit('SET_APPLICATIONS_PARAMS', result)
    } catch (e) {
      console.error(e.message)
    } finally {
      commit('STOP_PRELOADER', 'appParams')
    }
  }
}
