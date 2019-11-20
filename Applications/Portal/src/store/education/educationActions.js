import { EducationApi } from '@/api/education/educationApi.js'
import moment from 'moment'
export default {

  async loadStrategicGoals({commit}) {
    let result = await EducationApi.getStrategicGoals()
    if (result) {
      let strategicGoals = CommonDataAndHeaders(result.data.portalNabuQuery.strategicGoal)
      commit('setStrategicGoals', strategicGoals)

      let employeeOriginal = result.data.portalNabuQuery.emplOriginal.data
      commit('setEmployeeOriginal', employeeOriginal)
    }

  },
  async loadTaskForYear({commit}) {
    let result = await EducationApi.getTaskForYear()
    if (result) {
      let taskForYear = CommonDataAndHeaders(result.data.portalNabuQuery.taskForYear)

      taskForYear.data.forEach(el => {
        el.goalDate = moment(el.goalDate ).format('DD.MM.YYYY')
      })
      commit('setTaskForYear', taskForYear)
    }
  },

  async loadResultsInterimEvaluation({commit}) {
    let result = await EducationApi.getResultsInterimEvaluation()
    if (result) {
      let midtermGrade = CommonDataAndHeaders(result.data.portalNabuQuery.midtermGrade)

      midtermGrade.data.forEach(el => {
        el.goalDate = moment(el.goalDate ).format('DD.MM.YYYY')
        el.dateView = moment(el.dateView ).format('DD.MM.YYYY')
        return el
      })

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
      trainingPlan.data.forEach(el => {
        el.startAndEndDate = `${moment(el.eventDateStart ).format('DD.MM.YYYY')} - ${moment(el.eventDateEnd ).format('DD.MM.YYYY')}`
        return el
      })
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

  async loadTrainingSchedule({commit}) {
    let result = await EducationApi.getTrainingSchedule()
    if (result) {
      let trainingSchedule = CommonDataAndHeaders(result.data.portalNabuQuery.trainingSchedule)
      commit('setTrainingSchedule', trainingSchedule)
    }
  },

  async loadIndividualPlanReport({commit}) {
    let result = await EducationApi.getIndividualPlanReport()
    if (result) {
      commit('setIndividualPlanReport',result.data.portalNabuQuery.individualPlanReport)
    }
  },

  setCurrentPageNabu({commit}, page) {
    commit('setCurrentPageNabu', page)
  }
}

function CommonDataAndHeaders(type) {
  return { data: type.data, headers: type.headers }
}