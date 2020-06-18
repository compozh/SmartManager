export default {
  SET_CASES (state, cases) {
    state.cases = cases
  },
  SET_CASE_DETAILS (state, caseDetails) {
    state.caseDetails = Object.assign({}, state.caseDetails, caseDetails)
  },
  SHOW_CASE_DIALOG (state, toShow) {
    state.caseDialog = toShow
  },
  SET_CASE_EDITABLE (state, isEditable) {
    state.caseEditable = isEditable
  },
  SET_CASE_CHANGED (state, isChanged) {
    state.caseChanged = isChanged
  }
}
