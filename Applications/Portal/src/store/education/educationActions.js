import { EducationApi } from '@/api/education/educationApi.js'
export default {
  async loadEducationPlan({commit}) {
    let result = await EducationApi.getEducationPlan()
    if (result) {
      var educationPlanData = result.data.portalNabuQuery.trainingPlan[0].datas
      var educationPlanHeaders = result.data.portalNabuQuery.trainingPlan[0].headers
    }
    var educationPlan = {
      datas: educationPlanData,
      headers: educationPlanHeaders
    }
    commit('setEducationPlan', educationPlan)
  },
  async loadEducationResult({commit}) {
    let educationResult = await EducationApi.getEducationResult()
    commit('setEducationResult', educationResult)
  },
  async loadEducationAdditionalTraining({commit}) {
    let educationAdditionalTraining = await EducationApi.getEducationAdditionalTraining()
    commit('setEducationAdditionalTraining', educationAdditionalTraining)
  },
  
}
  