import i18n from '@/i18n'
import router from '@/router'
import auth from '@/utils/auth'

const languageTag = () => {
  switch (i18n.locale) {
    case 'ru': return 'ru-RU'
    case 'uk': return 'uk-UA'
    case 'zh': return 'zh-Hans'
    default: return 'en-US'
  }
}

export default {
  async authTypes ({ commit }) {
    commit('START_PRELOADER', 'authTypes')
    try {
      const result = await auth.getAllowedAuthTypes()
      commit('SET_AUTH_TYPES', result.AllowedAuthTypes)
    } catch (error) {
      console.error(error.message || error)
    } finally {
      commit('STOP_PRELOADER', 'authTypes')
    }
  },

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

  async smartId ({ commit }) {
    try {
      await auth.loginByOidc({ lang: languageTag() })
    } catch (error) {
      if (error) {
        console.error(error.message || error)
      }
      commit('SET_NOTIFY', {
        text: 'SmartId use error',
        color: 'error'
      })
    }
  },

  async applyDelegatedRights ({ commit, dispatch }, userId) {
    try {
      commit('START_PRELOADER', 'applyDelegatedRights')
      const result = await auth.applyDelegatedRights(userId)
      if (result.success) {
        dispatch('setUserData')
        dispatch('getFolders')
        dispatch('getTasks', 'active')
        if (router.currentRoute.name !== 'task-list') {
          await router.push('/')
        }
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

  async addDelegateUser ({ dispatch, commit }, params) {
    try {
      commit('START_PRELOADER', 'addDelegateUser')
      const result = await auth.addDelegateUser(params)
      if (result.success) {
        dispatch('setUserData')
        commit('UPDATE_DELEGATED_RIGHTS', params)
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

  async editDelegatedRights ({ dispatch, commit }, params) {
    try {
      commit('START_PRELOADER', 'editDelegatedRights')
      const result = await auth.editDelegation(params)
      if (result.success) {
        await dispatch('setUserData')
        // commit('UPDATE_DELEGATED_RIGHTS', params)
      } else {
        commit('STOP_PRELOADER', 'editDelegatedRights')
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.editDelegationFail'),
          color: 'warning'
        })
      }
      return true
    } catch (error) {
      if (error) {
        console.error(error.message || error)
      }
      commit('SET_NOTIFY', {
        text: i18n.t('notify.editDelegationError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'editDelegatedRights')
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
    user.delegatedUsers = await auth.getDelegatedUsers(user.id) || []
    user.delegatedRights = await auth.getDelegatedRights() || []
    commit('UPDATE_AUTHENTICATED_USER', user)
  }
}
