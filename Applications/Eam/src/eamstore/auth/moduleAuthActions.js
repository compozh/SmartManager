import auth from '@it-enterprise/jwtauthentication'
import { routerDependencies } from '@/router'
import { unregisterDevice, registerDevice } from '@/push-notification'

const router = routerDependencies.router

export default {
  async logout({ commit }) {
    await unregisterDevice()
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'EAMLOGIN') {
      router.push({ name: 'EAMLOGIN' })
    }
  },
  async login({ dispatch }, { login, password, remember }) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    const result = await auth.login(login, password, remember)
    await dispatch('updateAuthenticatedUser', result)
    await registerDevice()
    return result
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

      router.push({ name: 'EAMROOT' })
      return true
    }
    return false
  },
  async updateAuthenticatedUser({ commit }, result) {
    if (result.success) {
      let to = router.currentRoute.query.to || '/'
      commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
      await router.push({ name: 'EAMMAIN' })
      if (!to) {
        router.go()
      }
    } else {
      // TODO: Вывести уведомление об о ошибке для пользователя
      if (router.currentRoute.name !== 'EAMLOGIN') {
        router.push({ name: 'EAMROOT' })
      }
    }
  }
}
