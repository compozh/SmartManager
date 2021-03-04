import Vue from 'vue'
import moment from 'moment'

// TODO: add getAttachmentIndex getter

export default {
  SET_ATTACHMENTS (state, attachments) {
    state.attachments = attachments.map((attachment, idx) => {
      attachment.index = idx
      // Set attachment access defaults
      if (!attachment.access) {
        attachment.access = {
          download: true,
          changeActiveVersion: true,
          editFile: true,
          editNewVersion: true,
          deleteVersion: true,
          annotationsEdit: true,
          commentsEdit: true,
          delete: true,
          remarksView: true,
          remarksAdd: true,
          othersRemarksEdit: true,
          othersRemarksDelete: true
        }
      }
      if (state.attachments && state.attachments.length) {
        const existingAttachment = state.attachments.find(i => {
          return i.id === attachment.id && i.hash === attachment.hash
        })
        // Изменение порядка замены объекта вложения при обновлении
        // для корректного обновления ключевых свойств
        // В старом варианте значения нового объекта заменялись старыми!
        // return Object.assign(attachment, existingAttachment || {})
        return Object.assign(existingAttachment || {}, attachment)
      }
      return attachment
    })
  },
  SET_ATTACHMENT_TYPES (state, types) {
    state.attachmentTypes = Object.assign({}, state.attachmentTypes, types)
  },
  SET_CURRENT_TYPE (state, type) {
    state.currentType = type
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
      attachment.reason = fileDetails.ErrorMessage
      return
    }
    attachment.url = fileDetails.FileUrl
    attachment.srcUrl = fileDetails.SrcUrl + attachment.fileName
    attachment.versions = fileDetails.Versions
    attachment.notes = fileDetails.Notes
    attachment.signatures = fileDetails.Signatures
    Vue.set(attachments, index, attachment)
  },
  CHANGE_ACTIVE_VERSION (state, { attachmentId, versionId }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === attachmentId)
    const attachment = attachments.find(i => i.id === attachmentId)
    attachment.versions.forEach(version => { version.IsActive = version.Id === versionId })
    Vue.set(attachments, index, attachment)
  },
  SET_ACTIVE_VERSION (state, fileId) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === fileId)
    const attachment = attachments.find(i => i.id === fileId)
    const version = attachment.versions.find(i => i.IsActive)
    // При изменении ID сворачивается список версий
    attachment.id = version.Id
    attachment.fileName = version.Name
    attachment.srcUrl = version.Details.SrcUrl
    attachment.fileExt = version.Details.FileType
    attachment.date = moment(version.Date).format('DD.MM.YYYY HH:mm')
    Vue.set(attachments, index, attachment)
  },
  SET_PDF_URL (state, pdfUrl) {
    const versionId = state.currentVersion.Id
    const attachmentId = state.activeAttachment.id
    const attachments = state.attachments
    const attachment = attachments.find(i => i.id === attachmentId)
    const version = attachment.versions.find(i => i.Id === versionId)
    version.Details.Pdf = pdfUrl
  },
  DELETE_VERSION (state, { attachmentId, versionId }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === attachmentId)
    const attachment = attachments.find(i => i.id === attachmentId)
    attachment.versions = attachment.versions.filter(version => version.Id !== versionId)
    Vue.set(attachments, index, attachment)
  },
  ADD_NOTE (state, { roots, noteText, rootState }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === roots.attachmentId)
    const attachment = attachments.find(i => i.id === roots.attachmentId)
    const version = attachment.versions.find(i => i.Id === roots.versionId)
    const newNote = {
      Corrected: false,
      DateAdd: moment().format('YYYY-MM-DD HH:mm'),
      DateCorr: '0001-01-01T02:00:00+02:00',
      Editable: true,
      NoteId: Date.now(),
      Text: noteText,
      UserAdd: rootState.auth.user.userName,
      UserCorr: ''
    }
    version.Details.Notes.unshift(newNote)
    Vue.set(attachments, index, attachment)
  },
  UPDATE_NOTE (state, { roots, noteId, noteText }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === roots.attachmentId)
    const attachment = attachments.find(i => i.id === roots.attachmentId)
    const version = attachment.versions.find(i => i.Id === roots.versionId)
    const note = version.Details.Notes.find(i => i.NoteId === noteId)
    note.Text = noteText
    Vue.set(attachments, index, attachment)
  },
  DELETE_NOTE (state, { roots, noteId }) {
    const attachments = state.attachments
    const indexA = attachments.findIndex(i => i.id === roots.attachmentId)
    const attachment = attachments.find(i => i.id === roots.attachmentId)
    const version = attachment.versions.find(i => i.Id === roots.versionId)
    const indexN = version.Details.Notes.findIndex(i => i.NoteId === noteId)
    version.Details.Notes.splice(indexN, 1)
    Vue.set(attachments, indexA, attachment)
  },
  SET_ATTACHMENT_SIGN (state, { attachmentId, sign }) {

  },
  DELETE_SIGN (state, { attachmentId, signId }) {
    const attachments = state.attachments
    const index = attachments.findIndex(i => i.id === attachmentId)
    const attachment = attachments.find(i => i.id === attachmentId)
    attachment.signatures = attachment.signatures.filter(i => i.Id !== signId)
    if (attachment.signatures.length === 0) attachment.isSign = false
    Vue.set(attachments, index, attachment)
  }
}
