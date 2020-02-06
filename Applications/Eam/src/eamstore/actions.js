import { unregisterDevice, registerDevice } from '@/push-notification'

export default {
  setLoading({ commit }, payload) {
    commit('setLoading', payload)
  },
  setError({ commit }, payload) {
    commit('setError', payload)
  },
  clearError({ commit }) {
    commit('clearError')
  },
  toggleMenuMiniMode({ getters, commit }) {
    commit('setMenuMiniMode', !getters.menuMiniMode)
  },
  async toggleNotifications({ getters, commit }) {
    if (getters.notifications) {
      await unregisterDevice()
    }
    else {
      await registerDevice()
    }
    commit('setNotifications', !getters.notifications)
  },
}