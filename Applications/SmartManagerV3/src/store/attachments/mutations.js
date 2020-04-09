export default {
  SET_ATTACHMENT_TYPES (state, types) {
    state.attachmentTypes = types
  },
  SET_ACTIVE_ATTACHMENT (state, attachment) {
    state.activeAttachment = attachment
  },
  SET_ATTACHMENT_DETAILS (state, { fileId, fileDetails, taskOrCaseId: id, rootState }) {
    if (fileId) {
      if (fileDetails.ErrorMessage) {
        state.attachmentDetails = {
          fileId,
          access: false,
          reason: fileDetails.ErrorMessage
        }
        return
      }
      const task = rootState.tasks.taskDetails[id] || rootState.cases.caseDetails[id]
      const attachment = task.originals.find(original => {
        return original.id === fileId
      })
      if (attachment) {
        attachment.access = true
        attachment.url = fileDetails.FileUrl
        attachment.srcUrl = fileDetails.SrcUrl + attachment.fileName
        attachment.versions = fileDetails.Versions
        state.attachmentDetails = Object.assign({}, attachment)
      }
    } else {
      // Reset value when mutation called with empty object
      state.attachmentDetails = null
    }
  }
}
