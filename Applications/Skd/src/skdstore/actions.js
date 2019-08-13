import {SkdApi} from '../api/skdApi'
import _ from 'lodash'
const api = new SkdApi()


export default {
  async getUsers({commit}) {
    try {
      const result = await api.getUsersFromGql()
      const users = result.data
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
