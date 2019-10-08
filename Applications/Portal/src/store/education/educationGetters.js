export default {
  getEducationPlan: state => {
    if (state.educationPlan) {
      return state.educationPlan
    }
    return undefined
  },
  getEducationResult: state => {
    return state.educationResult
  },
  getEducationAdditionalTraining: state => {
    return state.educationAdditionalTraining
  },
}