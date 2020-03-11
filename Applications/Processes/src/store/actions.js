
import { ProcessesApi } from '../api/processesApi'
import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'

const api = new ProcessesApi()

export default {
  async getProcesses ({ dispatch }) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let processes = await api.getProcessesFromGql()
        return processes
      }
    })

    return result
  },

  async getForm ({ dispatch }, processDefinitionId) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let processDefinition = await api.getFormFromGql(processDefinitionId)
        return processDefinition
      }
    })

    return result
  },

  async startProcess ({ commit, dispatch }, params) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let startProcessResult = await api.startProcessGql(params)
        return startProcessResult
      }
    })

    return result
  },

  async graphqlQueryWraper ({ commit }, { action }) {
    // commit('closeSnackbar')

    var result
    try {
      result = await action()
    } catch (e) {
      commit('setSnackbarErrorMessage', e.message)
    }
    return result
  },

  logout ({ commit }) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'login') {
      router.push({ path: '/login', query: { to: router.currentRoute.path } })
    }
  },
  async login ({ dispatch }, { login, password, remember }) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return { success: true }
    }
    try {
      const result = await auth.login(login, password, remember)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      console.warn(e.message)
      return e
      // TODO: Вывести уведомление об о ошибке для пользователя
    }
  },
  async loginByCode ({ dispatch }, code) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    try {
      const result = await auth.loginByCode(code)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      console.warn(e.message)
      // TODO: Вывести уведомление об о ошибке для пользователя
    }
  },
  userIsLoggedIn ({ state }) {
    // If user is already logged in notify and exit
    if (state.user) {
      // TODO: Уведомление о том что пользователь уже вошел в систему
      router.push({ path: router.currentRoute.query.to || '/' })
      return true
    }
    return false
  },
  async updateAuthenticatedUser ({ commit }, result) {
    if (result.success) {
      let to = router.currentRoute.query.to || '/'
      commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
      await router.push({ path: to })
      if (!to) {
        router.go()
      }
    } else {
      // TODO: Вывести уведомление об о ошибке для пользователя
      if (router.currentRoute.name !== 'login') {
        router.push({ path: '/login', query: { to: router.currentRoute.path } })
      }
    }
  }
}
