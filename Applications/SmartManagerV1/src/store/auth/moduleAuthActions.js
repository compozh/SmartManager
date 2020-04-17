import Vue from 'vue'
import {i18n} from '@/i18n/i18n'
import router from '@/router'
import auth from '@/utils/auth'
const vm = new Vue()

export default {
  logout({commit}) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'login') {
      router.push({path: '/login'})
    }
  },
  async login({dispatch}, {login, password, rememberMe}) {
    vm.$vs.loading()
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    try {
      const result = await auth.login(login, password, rememberMe)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      vm.$vs.loading.close()
      console.warn('', e.message)
      vm.$vs.notify({
        title: i18n.t('login.subTitle'),
        text: i18n.t('login.loginError'),
        color: 'danger'
      })
    }
  },
  async loginByCode({dispatch}, code) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    try {
      const result = await auth.loginByCode(code)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      vm.$vs.loading.close()
      console.warn('', e.message)
      vm.$vs.notify({
        title: i18n.t('login.subTitle'),
        text: i18n.t('login.loginError'),
        color: 'danger'
      })
    }
  },
  async applyDelegatedRights(context, userId) {
    try {
      vm.$vs.loading()
      const result = await auth.applyDelegatedRights(userId)
      if (result.success) {
        if (router.currentRoute.name !== 'task-list') {
          await router.push('/')
        }
        window.location.reload()
      } else {
        vm.$vs.loading.close()
        vm.$vs.notify({
          title: i18n.t('notify.applyRightsTittle'),
          text: result.errorMessage,
          color: 'warning'
        })
      }
    } catch (e) {
      vm.$vs.loading.close()
      vm.$vs.notify({
        title: i18n.t('notify.applyRightsTittle'),
        text: i18n.t('notify.applyRightsError'),
        color: 'danger'
      })
    }
  },
  userIsLoggedIn({state}) {
    // If user is already logged in notify and exit
    if (state.user) {
      vm.$vs.notify({
        title: i18n.t('login.subTitle'),
        text: i18n.t('login.loggedIn'),
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      })
      router.push('/')
      return true
    }
    return false
  },
  async updateAuthenticatedUser({dispatch}, result) {
    if (result.success) {
      await dispatch('setUserData')
      await router.push(router.currentRoute.query.to || '/')
      !vm.$vs.loading || vm.$vs.loading.close()
    } else {
      vm.$vs.loading.close()
      vm.$vs.notify({
        title: i18n.t('login.subTitle'),
        text: result.errorMessage,
        color: 'warning'
      })
      if (router.currentRoute.name !== 'login') {
        await router.push({path: '/login'})
      }
    }
  },
  async setUserData({commit}) {
    const user = auth.getUserData()
    user.delegatedRights = await auth.getDelegatedRights(user.id) || []
    commit('UPDATE_AUTHENTICATED_USER', user)
  }
}
