/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

//import auth from '@/api/auth/auth'
import router from '@/router'
import Vue from 'vue'
export default {


  logout({commit, state}) {
    // If user is already logged in notify and exit
    if (!state.isUserLoggedIn()) {
      // Close animation if passed as payload
      return
    }
    Vue.prototype.$authentication.logOff().then(() => {
      router.push('/login')
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
        title: 'Вход в систему',
        text: 'Вы уже вошли в систему!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })

      return false
    }

    // Try to sigin
    Vue.prototype.$authentication.logIn(payload.userDetails.email, payload.userDetails.password, payload.checkbox_remember_me)
      .then(() => {

        var user = context.rootState.authentication.currentUser
        // Close animation if passed as payload
        if (payload.closeAnimation) { payload.closeAnimation() }
        context.commit('UPDATE_AUTHENTICATED_USER', user)
        router.push(router.currentRoute.query.to || '/')



      }, (err) => {

        if (err.code == 401) {
          router.push({name: 'page-login'})
          return

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
