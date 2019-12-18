import {i18n} from '@/i18n/i18n'
import router from '@/router'
import Vue from 'vue'
const vm = new Vue()

export default {
  logout({commit, state}) {
    // If user is already logged in notify and exit
    if (!state.isUserLoggedIn()) {
      // Close animation if passed as payload
      return
    }

    auth.logOff().then(() => {
      commit('UPDATE_AUTHENTICATED_USER', undefined)
      router.push('/login')
    })
  },

  async login({ commit, state }, {login, password, rememberMe, notify, closeAnimation}) {
    // If user is already logged in notify and exit
    if (state.isUserLoggedIn()) {
      // Close animation if passed as payload
      if (closeAnimation) {
        Vue.nextTick().then(() => closeAnimation())
      }
      notify({
        title: i18n.t('login.subTitle'),
        text: i18n.t('login.loggedIn'),
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      router.push('/')
      return false
    }

    // Try to sign In
    try {
      await vm.$auth.logIn(login, password, rememberMe)
      // Close animation if passed as payload
      !closeAnimation || closeAnimation()
      const user = vm.$auth.getUserData()
      commit('UPDATE_AUTHENTICATED_USER', user)
    } catch (e) {

    }
    vm.$auth.logIn(login, password, rememberMe)
      .then(result => {



        router.push(router.currentRoute.query.to || '/')

      }, (err) => {

        // Close animation if passed as payload
        if (payload.closeAnimation) { payload.closeAnimation() }

        payload.notify({
          time: 2500,
          title: 'Error',
          text: err.message,
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'danger'
        })
      })
  }
}
