import { PersonalInfoApi } from '@/api/personalInfo/personalInfoApi'
export default {
  async loadFullUserInfo({commit, state}) {
    // Если данные уже загружены-выходим
    if (state.fullUserInfo) {
      return
    }
    let userInfo = await PersonalInfoApi.getFullUserInfo()
    commit('setFullUserInfo',userInfo.data.personalInfoQuery.fullInfo)
  },

  async updateUserInfo({commit}, value) {
    let result = await PersonalInfoApi.updateUserInfo(value)
    if (!result) {
      return
    }
    commit('setFullUserInfo', result.data.personalInfoQueryMutation.setFullInfo)

  },
  async loadEmployeeInfo({commit}) {
    let result = await PersonalInfoApi.getEmployeeInfo()
    if (result) {
      commit('setEmployeeInfo', ...result.data.portalNabuQuery.employeeInfo.data)
    }
  },
  setEditMode({commit}, value) {
    commit('setEditMode', value)
  }
}
