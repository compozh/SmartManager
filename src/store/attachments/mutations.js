import Vue from 'vue'
import moment from 'moment'

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
    state.attachmentTypes = Object.assign({}, state.attachmentTypes, types)
  },
  SET_ACTIVE_ATTACHMENT (state, { attachment, version }) {
    state.activeAttachment = attachment
    state.currentVersion = version || attachment.versions.find(i => i.IsActive)
  },
  SET_ATTACHMENT_DETAILS (state, { fileId, fileDetails }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === fileId)
    const attachment = attachments.find(i => i.id === fileId)
    Vue.set(attachment, 'hasDetails', true)
    if (fileDetails.ErrorMessage) {
      attachment.access = false
      attachment.reason = fileDetails.ErrorMessage
      return
    }
    attachment.access = true
    attachment.url = fileDetails.FileUrl
    attachment.srcUrl = fileDetails.SrcUrl + attachment.fileName
    attachment.versions = fileDetails.Versions
    attachment.notes = fileDetails.Notes
    attachment.signatures = fileDetails.Signatures
    Vue.set(attachments, index, attachment)
  },
  CHANGE_ACTIVE_VERSION (state, { attachmentId, versionId }) {
    const attachments = state.attachments
    const attachment = attachments.find(i => i.id === attachmentId)
    attachment.versions.forEach(version => { version.IsActive = version.Id === versionId })
    Vue.set(state, 'attachments', attachments)
  },
  SET_ACTIVE_VERSION (state, fileId) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === fileId)
    const attachment = attachments.find(i => i.id === fileId)
    const version = attachment.versions.find(i => i.IsActive)
    // При изменении ID сворачивается список версий
    attachment.fileName = version.Name
    attachment.srcUrl = version.Details.SrcUrl
    attachment.fileExt = version.Details.FileType
    attachment.date = moment(version.Date).format('DD.MM.YYYY HH:mm')
    Vue.set(attachments, index, attachment)
  },
  DELETE_VERSION (state, { attachmentId, versionId }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === attachmentId)
    const attachment = attachments.find(i => i.id === attachmentId)
    attachment.versions = attachment.versions.filter(version => version.Id !== versionId)
    Vue.set(attachments, index, attachment)
  }
}
