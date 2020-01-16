import {PortalApi} from '@/api/portalApi'

export default {
  async loadApplicationDescription({commit}) {
    const response = await PortalApi.getApplicationDescription()
    const appDescription = JSON.parse(response.data.webapps.application)
    commit('setApplicationDescription', appDescription)
  },
}
