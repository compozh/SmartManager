import {ITPortalApi} from '../api/itPortalApi'
const api = new ITPortalApi()


export default {
  async getITPortalMenu({commit}) {
    try {
      const result = await api.getITPortalMenu()
      const menu = result.data
      console.log(12)
      commit('setITPortal', menu)
    } catch (e) {
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
}
