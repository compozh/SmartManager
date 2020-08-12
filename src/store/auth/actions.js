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
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    commit('START_PRELOADER', 'login')
    try {
      const result = await auth.login(login, password, rememberMe)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (error) {
      if (error) {
        console.error(error.message || error)
      }
      commit('SET_NOTIFY', {
        text: i18n.t('login.loginError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'login')
    }
  },
  async applyDelegatedRights ({ commit }, userId) {
    try {
      commit('START_PRELOADER', 'applyDelegatedRights')
      const result = await auth.applyDelegatedRights(userId)
      if (result.success) {
        if (router.currentRoute.name !== 'task-list') {
          await router.push('/')
        }
        window.location.reload()
      } else {
        commit('STOP_PRELOADER', 'applyDelegatedRights')
        commit('SET_NOTIFY', {
          text: result.errorMessage,
          color: 'warning'
        })
      }
    } catch (error) {
      if (error) {
        console.error(error.message || error)
      }
      commit('SET_NOTIFY', {
        text: i18n.t('notify.applyRightsError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'applyDelegatedRights')
    }
  },
  async addDelegateUser ({ commit }, params) {
    try {
      commit('START_PRELOADER', 'addDelegateUser')
      const result = await auth.addDelegateUser(params)
      if (result.success) {
        commit('SET_NOTIFY', {
          text: i18n.t('notify.addDelegateSuccess'),
          color: 'success'
        })
        return true
      } else {
        commit('STOP_PRELOADER', 'addDelegateUser')
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.addDelegateFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      if (error) {
        console.error(error.message || error)
      }
      commit('SET_NOTIFY', {
        text: i18n.t('notify.addDelegateError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'addDelegateUser')
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
      commit('STOP_PRELOADER', 'login')
    } else {
      commit('STOP_PRELOADER', 'login')
      commit('SET_NOTIFY', {
        text: result.errorMessage || i18n.t('login.loginFail'),
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
