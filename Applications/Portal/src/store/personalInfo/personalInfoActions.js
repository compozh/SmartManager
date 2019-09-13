import { PersonalInfoApi } from '@/api/personalInfo/personalInfoApi'
export default {
  async loadFullUserInfo({commit}) {
    let userInfo = await PersonalInfoApi.getFullUserInfo()
    commit('setFullUserInfo',userInfo)
  },

}
