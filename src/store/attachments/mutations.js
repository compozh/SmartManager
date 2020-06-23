export default {
  SET_ATTACHMENTS (state, attachments) {
    state.attachments = attachments
  },
  SET_ATTACHMENT_TYPES (state, types) {
    state.attachmentTypes = types
  },
  SET_ACTIVE_ATTACHMENT (state, attachment) {
    state.activeAttachment = attachment
  },
  SET_ATTACHMENT_DETAILS (state, { fileId, fileDetails }) {
    if (fileId) {
      if (fileDetails.ErrorMessage) {
        state.attachments[fileId] = {
          fileId,
          access: false,
          reason: fileDetails.ErrorMessage
        }
        return
      }
      const attachments = state.attachments
      const attachment = attachments.find(i => i.id === fileId)
      if (attachment) {
        attachment.access = true
        attachment.url = fileDetails.FileUrl
        attachment.srcUrl = fileDetails.SrcUrl + attachment.fileName
        attachment.versions = fileDetails.Versions
        attachment.notes = fileDetails.Notes
        attachment.signatures = fileDetails.Signatures
        state.attachments = attachments
      }
    }
  }
}
