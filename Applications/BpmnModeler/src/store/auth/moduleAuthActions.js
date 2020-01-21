import auth from '@it-enterprise/jwtauthentication';
import router from '@/router';
// const router = routerDependencies.router;

export default {
  logout({ commit }) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'BPMNLOGIN') {
      router.push({ path: '/bpmnmodeler/login' })
    }
  },
  async login({ dispatch }, { login, password, remember }) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    try {
      const result = await auth.login(login, password, remember)
      await dispatch('updateAuthenticatedUser', result)
      return result
    } catch (e) {
      console.warn(e.message)
      // TODO: Вывести уведомление об о ошибке для пользователя
    }
  },
  async loginByCode({ dispatch }, code) {
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
  userIsLoggedIn({ state }) {
    // If user is already logged in notify and exit
    if (state.user) {
      // TODO: Уведомление о том что пользователь уже вошел в систему
      router.push('/bpmnmodeler')
      return true
    }
    return false
  },
  updateAuthenticatedUser({ commit }, result) {
    if (result.success) {
      commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
      router.push(router.currentRoute.query.to || '/bpmnmodeler')
    } else {
      // TODO: Вывести уведомление об о ошибке для пользователя
      if (router.currentRoute.name !== 'BPMNLOGIN') {
        router.push({ path: '/login' })
      }
    }
  }
};
