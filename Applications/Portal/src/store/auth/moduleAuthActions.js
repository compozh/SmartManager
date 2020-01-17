import Vue from 'vue'
import auth from '@it-enterprise/jwtauthentication'
const vm = new Vue()

export default {
  logout({commit}) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
  },
  async login({commit, state}, {login, password, rememberMe}) {
    // If user is already logged in notify and exit
    if (state.user) {
      // Close animation if passed as payload
      !vm.$vs.loading || vm.$vs.loading.close()
      return 'alreadyLoggedIn'
    }
    try {
      const result = await auth.login(login, password, rememberMe)
      if (result.success) {
        commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
        // Close animation if passed as payload
        !vm.$vs.loading || vm.$vs.loading.close()
        return 'success'
      }
    } catch (e) {
      console.warn('', e.message)
      vm.$vs.notify({
        time: 2500,
        title: 'Error',
        text: e.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      })
    }
  }
}
