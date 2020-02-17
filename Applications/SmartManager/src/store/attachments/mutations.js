export default {
  SET_ATTACHMENT_DETAILS(state, {fileId, fileDetails, taskOrCaseId: id, rootState}) {
    const task = rootState.sm.taskInfo[id]
      || rootState.sm.caseDetails[id]
    const attachment = task.originals.find(original => {
      return original.id === fileId
    })
    if (attachment) {
      attachment.url = fileDetails.FileUrl
      attachment.versions = fileDetails.VERSIONS
      state.currentAttachment = attachment
    }
  },
  TOGGLE_EDS_POPUP(state, payload) {
    state.edsPopup = payload
  }
}
