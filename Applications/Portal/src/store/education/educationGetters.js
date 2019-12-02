export default {
  getEducationPlan: state => {
    if (state.educationPlan) {
      return state.educationPlan
    }
    return undefined
  },

  getStrategicGoals: state => {
    if (state.strategicGoals) {
      return state.strategicGoals
    }
    return undefined
  },

  getTaskForYear: state => {
    if (state.taskForYear) {
      return state.taskForYear
    }
    return undefined
  },

  getResultsInterimEvaluation: state => {
    if (state.resultsInterimEvaluation) {
      return state.resultsInterimEvaluation
    }
    return undefined
  },

  getCriterialEvaluation: state => {
    if (state.criterialEvaluation) {
      return state.criterialEvaluation
    }
    return undefined
  },

  getSelfEsteemResults: state => {
    if (state.selfEsteemResults) {
      return state.selfEsteemResults
    }
    return undefined
  },
  getResultsAssessmentSupremo: state => {
    if (state.resultsAssessmentSupremo) {
      return state.resultsAssessmentSupremo
    }
    return undefined
  },
  
  
  getEducationResult: state => {
    if (state.educationResult) {
      return state.educationResult
    }
    return undefined 
  },
  getEducationAdditionalTraining: state => {
    if (state.educationAdditionalTraining) {
      return state.educationAdditionalTraining
    }
    return undefined
  },
  getCurrentPageNabu: state => {
    return state.currentPageNabu
  },
  getEmployeeOriginal: state => {
    return state.employeeOriginal
  },
  getTrainingSchedule: state => {
    return state.trainingSchedule
  },
  getIndividualPlanReport: state => {
    return state.individualPlanReport
  },
  getCharacteristic: state => {
    return state.characteristic
  },
  getNormsOfWorkwear: state => {
    return state.normsOfWorkwear
  },
  getWorkwearOnPersonal: state => {
    return state.workwearOnPersonal
  }
}