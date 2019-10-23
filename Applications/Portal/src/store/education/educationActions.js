import { EducationApi } from '@/api/education/educationApi.js'
export default {

  async loadStrategicGoals({commit}) {
    let result = await EducationApi.getStrategicGoals()
    if (result) {
      let strategicGoals = CommonDataAndHeaders(result.data.portalNabuQuery.strategicGoals)
      commit('setStrategicGoals', strategicGoals)
    }

  },
  async loadTaskForYear({commit}) {
    let result = await EducationApi.getTaskForYear()
    if (result) {
      let taskForYear = CommonDataAndHeaders(result.data.portalNabuQuery.taskForYear)
      commit('setTaskForYear', taskForYear)
    }
  },

  async loadResultsInterimEvaluation({commit}) {
    let result = await EducationApi.getResultsInterimEvaluation()
    if (result) {
      let midtermGrade = CommonDataAndHeaders(result.data.portalNabuQuery.midtermGrade)
      commit('setResultsInterimEvaluation', midtermGrade)
    }
  },

  async loadCriterialEvaluation({commit}) {
    let result = await EducationApi.getCriterialEvaluation()
    if (result) {
      let gradeCriteria = CommonDataAndHeaders(result.data.portalNabuQuery.gradeCriteria)
      commit('setCriterialEvaluation', gradeCriteria)
    }
  },

  async loadSelfEsteemResults({commit}) {
    let result = await EducationApi.getSelfEsteemResults()
    if (result) {
      let selfGradeForYear = CommonDataAndHeaders(result.data.portalNabuQuery.selfGradeForYear)
      commit('setSelfEsteemResults', selfGradeForYear)
    }
  },

  async loadResultsAssessmentSupremo({commit}) {
    let result = await EducationApi.getResultsAssessmentSupremo()
    if (result) {
      let headGradeForYear = CommonDataAndHeaders(result.data.portalNabuQuery.headGradeForYear)
      commit('setResultsAssessmentSupremo', headGradeForYear)
    }
  },
  
  async loadEducationPlan({commit}) {
    let result = await EducationApi.getEducationPlan()
    if (result) {
      let trainingPlan = CommonDataAndHeaders(result.data.portalNabuQuery.trainingPlan)
      commit('setEducationPlan', trainingPlan)
    }
  },
  
  async loadEducationResult({commit}) {
    let result = await EducationApi.getEducationResult()
    if (result) {
      let trainingResult = CommonDataAndHeaders(result.data.portalNabuQuery.trainingResult)
      commit('setEducationResult', trainingResult)
    }
  },
  
  async loadEducationAdditionalTraining({commit}) {
    let result = await EducationApi.getEducationAdditionalTraining()
    if (result) {
      let additionalTraining = CommonDataAndHeaders(result.data.portalNabuQuery.additionalTraining)
      commit('setEducationAdditionalTraining', additionalTraining)
    }
  },
}

function CommonDataAndHeaders(type) {
  return { data: type.data, headers: type.headers }
}