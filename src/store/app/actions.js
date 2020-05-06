import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getApplicationParams ({ commit }) {
    commit('START_PRELOADER', 'appParams')
    try {
      const response = await api.getApplicationParamsFromGql()
      const result = response.data.smtasks.applicationParams
      commit('SET_APPLICATIONS_PARAMS', result)
    } catch (error) {
      console.error(error.message)
    } finally {
      commit('STOP_PRELOADER', 'appParams')
    }
  },
  async getUsers ({ commit }) {
    try {
      const result = await api.getUsersFromGql()
      const users = result.data.smtasks.users
      commit('SET_USERS', users)
    } catch (error) {
      console.log(error.message)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.usersError'),
        color: 'error'
      })
    }
  }
}
