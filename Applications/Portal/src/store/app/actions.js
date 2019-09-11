import {PortalApi} from '@/api/portalApi'
export default {
  setApplicationDescription({commit}, value) {

  },
  loadAppId({commit}) {
    let id = PortalApi.getAppId()
    commit('setAppId', id)
  }
}
