import auth from '@it-enterprise/jwtauthentication';

export default {
  logout({ commit }) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
  },
  async login({ dispatch }, { login, password, remember }) {
    const userIsLoggedIn = await dispatch('userIsLoggedIn')
    if (userIsLoggedIn) {
      return
    }
    const result = await auth.login(login, password, remember)
    await dispatch('updateAuthenticatedUser', result)
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
      return true
    }
    return false
  },
  updateAuthenticatedUser({ commit }, result) {
    if (result.success) {
      commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
    } else {
      // TODO: Вывести уведомление об о ошибке для пользователя
    }
  }
};
