import { EducationApi } from '@/api/education/educationApi.js'
export default {
  async loadEducationPlan({commit}) {
    let result = await EducationApi.getEducationPlan()
    if (result) {
      var educationPlan = result.data.portalNabuQuery.trainingPlan.map(element => {
        var object = {
          personnelNumber: element.personnelNumber,
          competence: element.competence,
          professionalTrainingType: element.professionalTrainingType,
          subject: element.subject,
          trainingTheme: element.trainingTheme,
          description: element.description,
          startAndEndDate: `${element.eventDateStart} - ${element.eventDateEnd}`
        }
        return object
      })
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
  