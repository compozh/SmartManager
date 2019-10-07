import { EducationApi } from '@/api/education/educationApi.js'
export default {
  async loadEducationPlan({commit}) {
    let educationPlan = await EducationApi.getEducationPlan()
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
  