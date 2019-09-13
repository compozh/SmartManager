/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

//import auth from '@/api/auth/auth'
//import router from '@/router'
import Vue from 'vue'
export default {


  logout({commit, state}) {
    // If user is already logged in notify and exit
    if (!state.isUserLoggedIn()) {
      // Close animation if passed as payload
      return
    }
    return Vue.prototype.$authentication.logOff().then(() => {
      commit('UPDATE_AUTHENTICATED_USER', undefined)
    })

  },

  login(context, payload) {

    // If user is already logged in notify and exit
    if (context.state.isUserLoggedIn()) {
      // Close animation if passed as payload

      if (payload.closeAnimation) {
        Vue.nextTick().then(() => {
          payload.closeAnimation()
        })
      }

      payload.notify({
        title: this.$t('Login.EnterToSystem'),
        text: this.$t('Login.YouAlreadyEntered'),
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })

      return false
    }

    // Try to sigin
    return Vue.prototype.$authentication.logIn(payload.userDetails.email, payload.userDetails.password, payload.checkbox_remember_me)
      .then(() => {

        var user = context.rootState.authentication.currentUser
        // Close animation if passed as payload
        if (payload.closeAnimation) { payload.closeAnimation() }
        context.commit('UPDATE_AUTHENTICATED_USER', user)

        return true

      }, (err) => {

        if (err.code == 401) {
          return false

        }
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
