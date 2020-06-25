export default {
  SET_ATTACHMENTS (state, attachments) {
    if (state.attachments && state.attachments.length) {
      state.attachments = attachments.map(attachment => {
        const existingAttachment = state.attachments.find(i => i.id === attachment.id)
        return Object.assign(attachment, existingAttachment || {})
      })
    } else {
      state.attachments = attachments
    }
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
        state.attachmentDetails = {
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
        if (state.activeAttachment.id === attachment.id) {
          state.attachmentDetails = Object.assign({}, attachment)
        }
      }
    } else {
      // Reset value when mutation called with empty object
      state.attachmentDetails = null
    }
  },
  VIEW_VERSION (state, { attachmentId, version }) {
    state.attachmentDetails = {
      url: version.FileUrl
    }
    state.activeAttachment = {
      id: attachmentId
    }
  }
}
