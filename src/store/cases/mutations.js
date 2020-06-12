export default {
  SET_CASES (state, cases) {
    state.cases = Object.assign({}, state.cases, cases)
  },
  SET_CASE_DETAILS (state, caseDetails) {
    state.caseDetails = Object.assign({}, state.caseDetails, caseDetails)
  },
  SHOW_CASE_DIALOG (state, toShow) {
    state.caseDialog = toShow
  }
}
