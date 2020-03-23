import i18n from '@/i18n'
import router from '@/router'
import auth from '@/utils/auth'

export default {
  logout ({ commit }) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'login') {
      router.push({ path: '/login' })
    }
  },
  async login ({ commit, dispatch }, { login, password, rememberMe }) {
    // loading...
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    try {
      const result = await auth.login(login, password, rememberMe)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      // stop loading
      console.warn('', e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('login.loginError'),
        color: 'error'
      })
    }
  },
  async applyDelegatedRights ({ commit }, userId) {
    try {
      // loading...
      const result = await auth.applyDelegatedRights(userId)
      if (result.success) {
        if (router.currentRoute.name !== 'task-list') {
          await router.push('/')
        }
        window.location.reload()
      } else {
        // stop loading
        commit('SET_NOTIFY', {
          text: result.errorMessage,
          color: 'warning'
        })
      }
    } catch (e) {
      // stop loading
      commit('SET_NOTIFY', {
        text: i18n.t('notify.applyRightsError'),
        color: 'error'
      })
    }
  },
  userIsLoggedIn ({ state, commit }) {
    // If user is already logged in notify and exit
    if (state.user) {
      commit('SET_NOTIFY', {
        text: i18n.t('login.loggedIn'),
        color: 'warning'
      })
      router.push('/')
      return true
    }
    return false
  },
  async updateAuthenticatedUser ({ state, commit, dispatch }, result) {
    if (result.success) {
      await dispatch('setUserData')
      await router.push(router.currentRoute.query.to || '/')
      //  if !loading || stop loading...
    } else {
      // stop loading
      commit('SET_NOTIFY', {
        text: result.errorMessage,
        color: 'warning'
      })
      if (router.currentRoute.name !== 'login') {
        await router.push({ path: '/login' })
      }
    }
  },
  async setUserData ({ commit }) {
    const user = auth.getUserData()
    user.delegatedRights = await auth.getDelegatedRights(user.id) || []
    commit('UPDATE_AUTHENTICATED_USER', user)
  }
}
