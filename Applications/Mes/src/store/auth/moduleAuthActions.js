import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'
// const router = routerDependencies.router

export default {
  logout({commit}) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'MESLOGIN') {
      router.push({path: 'login', query: { to: router.currentRoute.path, fixedUuid: router.currentRoute.query.fixedUuid }})
    }
  },
  async login({dispatch}, {login, password, remember}) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return {success: true}
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
      console.warn(e.message)
      // TODO: Вывести уведомление об о ошибке для пользователя
    }
  },
  userIsLoggedIn({state}) {
    // If user is already logged in notify and exit
    if (state.user) {
      // TODO: Уведомление о том что пользователь уже вошел в систему
      router.push({path:router.currentRoute.query.to || '/', query: {fixedUuid: router.currentRoute.query.fixedUuid}})
      return true
    }
    return false
  },
  async updateAuthenticatedUser({commit}, result) {
    if (result.success) {
      let to = router.currentRoute.query.to
      commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
      await router.push({path: to || '/', query: {fixedUuid: router.currentRoute.query.fixedUuid}})
      if(!to ) {
        router.go()
      }
    } else {
      // TODO: Вывести уведомление об о ошибке для пользователя
      if (router.currentRoute.name !== 'MESLOGIN') {
        router.push({path: 'login', query: {fixedUuid: router.currentRoute.query.fixedUuid}})
      }
    }
  }
}
