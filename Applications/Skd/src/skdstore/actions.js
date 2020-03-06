import {SkdApi as api} from '../api/skdApi'
import auth from '@it-enterprise/jwtauthentication'
import {routerDependencies} from '@/router'
const router = routerDependencies.router

export default {
  logout({commit}) {
    auth.clearTokens()
    commit('UPDATE_AUTHENTICATED_USER', null)
    if (router.currentRoute.name !== 'SKDLOGIN') {
      router.push({name: 'SKDLOGIN'})
    }
    commit('setLoginStatus', null)
  },
  async login({commit, state}, {login, password, remember}) {
    if (state.user) {
      await router.push({name: 'SKDALLUSERS'})
      return
    }
    try {
      const result = await auth.login(login, password, remember)
      commit('setLoginStatus', result)
      if (result.success) {
        commit('UPDATE_AUTHENTICATED_USER', auth.getUserData())
        await router.push(router.currentRoute.query.to || {name: 'SKDALLUSERS'})
      } else {
        if (router.currentRoute.name !== 'SKDLOGIN') {
          await router.push({name: 'SKDLOGIN'})
        }
      }
    } catch (e) {
      console.warn(e.message)
    }
  },
  async getUsers({commit}) {
    try {
      const result = await api.getUsersFromGql()
      const users = result.data
      commit('setLastUpdatedDataTime')
      commit('setUsersList', users.skd.personsTable.data)
      commit('setUsers', users)
    } catch (e) {
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async setFilter (context, filter) {
    context.commit('resetItemsOffset')
    context.commit('setFilter', filter)
  },
  async setItemsOffset(context, count) {
    context.commit('setItemsOffset',count)
  }
}
