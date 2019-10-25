import {PortalApi} from '@/api/portalApi'
export default {
  async loadApplicationDescription({commit}) {
    let description = await PortalApi.getApplicationDescription()
    commit('setApplicationDescription', description)


  },

}
