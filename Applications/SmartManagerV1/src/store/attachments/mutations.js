export default {
  SET_ATTACHMENT_TYPES(state, types) {
    state.attachmentTypes = types
  },
  SET_ATTACHMENT_DETAILS(state, {fileId, fileDetails, taskOrCaseId: id, rootState}) {
    if (fileDetails.ErrorMessage) {
      state.currentAttachment = {
        fileId,
        access: false,
        reason: fileDetails.ErrorMessage
      }
      return
    }
    const task = rootState.sm.taskInfo[id]
      || rootState.sm.caseDetails[id]
    const attachment = task.originals.find(original => {
      return original.id === fileId
    })
    if (attachment) {
      attachment.access = true
      attachment.url = fileDetails.FileUrl
      attachment.srcUrl = fileDetails.SrcUrl + attachment.fileName
      attachment.versions = fileDetails.Versions
      state.currentAttachment = Object.assign({}, attachment)
    }
  },
  TOGGLE_EDS_POPUP(state, payload) {
    state.edsPopup = payload
  },
  TOGGLE_TYPES_DIALOG(state, payload) {
    state.addAttachmentDialog = payload
  }
}
