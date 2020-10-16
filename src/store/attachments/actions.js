import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getAttachmentTypes ({ commit }, params) {
    const paramsJson = JSON.stringify(params)
    commit('START_LINEAR_PRELOADER', 'attachmentTypes')
    try {
      const response = await api.getAttachmentTypesFromGql(paramsJson)
      const result = JSON.parse(response.data.smtasks.attachmentTypes)
      commit('SET_ATTACHMENT_TYPES', { [params.BusinessObjectKey || params.id]: result })
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.typeGettingError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'attachmentTypes')
    }
  },
  async getFileDetails ({ commit }, { fileId, fileExt, fileSize }) {
    commit('START_LINEAR_PRELOADER', 'fileDetails')
    try {
      const result = { success: true, errorMessage: '', data: null }
      const response = await api.getFileDetailsFromGql(fileId, fileExt, fileSize)
      const fileDetails = JSON.parse(response.data.smtasks.fileDetails)
      if (fileDetails.ErrorMessage) {
        result.success = false
        result.errorMessage = fileDetails.ErrorMessage
        commit('SET_NOTIFY', {
          text: fileDetails.ErrorMessage,
          color: 'warning'
        })
      }
      commit('SET_ATTACHMENT_DETAILS', { fileId, fileDetails })
      result.data = fileDetails
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('fileDetailsError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'fileDetails')
    }
  },
  async addAttachments ({ dispatch, commit }, payload) {
    commit('START_LINEAR_PRELOADER', 'addAttachments')
    const attachments = JSON.stringify(payload.attachments)
    const params = JSON.stringify(payload.params)
    try {
      const response = await api.addAttachmentsInGql(attachments, params)
      // Returns results list
      const results = response.data.smtasksMutation.addAttachments
      results.forEach(result => {
        if (result.success) {
          commit('SET_NOTIFY', {
            text: result.successMessage || i18n.t('notify.attachAddSuccess'),
            color: 'success'
          })
        } else {
          commit('SET_NOTIFY', {
            text: result.errorMessage || i18n.t('notify.attachAddFail'),
            color: 'warning'
          })
        }
      })
      await dispatch('getTaskDetails', { taskId: payload.params.id })
      return results
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.attachAddError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'addAttachments')
    }
  },
  async attachmentDelete ({ dispatch, commit }, { fileId, taskId, caseId }) {
    commit('START_PRELOADER', 'attachmentDelete')
    try {
      const response = await api.attachmentDeleteInGql(fileId)
      const result = response.data.smtasksMutation.attachmentDelete
      if (result.success) {
        await dispatch('updateAfterChanges', { taskId, caseId })
        commit('SET_NOTIFY', {
          text: result.successMessage || i18n.t('notify.attachDelSuccess'),
          color: 'info'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.attachDelFail'),
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.attachDelError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'attachmentDelete')
    }
  },
  async addVersion ({ dispatch, commit }, { fileId, fileExt, fileSize, filePath }) {
    commit('START_LINEAR_PRELOADER', 'addVersion')
    try {
      const response = await api.addAttachmentVersionInGql(fileId, filePath)
      const result = response.data.smtasksMutation.addAttachmentVersion
      if (result.success) {
        await dispatch('getFileDetails', { fileId, fileExt, fileSize })
        commit('SET_ACTIVE_VERSION', fileId)
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('versionAddingFail'),
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('versionAddingError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'addVersion')
    }
  },
  async setActiveVersion ({ dispatch, commit }, { attachmentId, version }) {
    commit('START_LINEAR_PRELOADER', 'setActiveVersion')
    try {
      const response = await api.setActiveVersionInGql(version.Id)
      const result = response.data.smtasksMutation.setActiveVersion
      if (result.success) {
        commit('CHANGE_ACTIVE_VERSION', { attachmentId, versionId: version.Id })
        commit('SET_ACTIVE_VERSION', attachmentId)
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('setActiveVersionFail'),
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('setActiveVersionError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'setActiveVersion')
    }
  },
  async deleteVersion ({ dispatch, commit }, { attachment, versionId }) {
    commit('START_LINEAR_PRELOADER', 'deleteVersion')
    try {
      const response = await api.deleteVersionInGql(versionId)
      const result = response.data.smtasksMutation.deleteVersion
      if (result.success) {
        // If the server responds successfully, delete the version on the client
        commit('DELETE_VERSION', { attachmentId: attachment.id, versionId })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('deleteVersionFail'),
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('deleteVersionError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'deleteVersion')
    }
  },
  async addNote ({ dispatch, commit, rootState }, { roots, noteText }) {
    commit('START_LINEAR_PRELOADER', 'addNote')
    try {
      const response = await api.addNoteInGql(roots.versionId, noteText)
      const result = response.data.smtasksMutation.addNote
      if (result.success) {
        commit('ADD_NOTE', { roots, noteText, rootState })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('noteAddingFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('noteAddingError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'addNote')
    }
  },
  async updateNote ({ dispatch, commit }, { roots, noteId, noteText }) {
    commit('START_LINEAR_PRELOADER', 'updateNote')
    try {
      const response = await api.updateNoteInGql(noteId, noteText)
      const result = response.data.smtasksMutation.updateNote
      if (result.success) {
        commit('UPDATE_NOTE', { roots, noteId, noteText })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('updateNoteFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('updateNoteError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'updateNote')
    }
  },
  async deleteNote ({ dispatch, commit }, { roots, noteId }) {
    commit('START_LINEAR_PRELOADER', 'deleteNote')
    try {
      const response = await api.deleteNoteFromGql(noteId)
      const result = response.data.smtasksMutation.deleteNote
      if (result.success) {
        commit('DELETE_NOTE', { roots, noteId })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('deleteNoteFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('deleteNoteError'),
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'deleteNote')
    }
  },
  async updateAfterChanges ({ dispatch, commit }, { taskId, caseId }) {
    // Update task or case after changes
    if (taskId || caseId) {
      commit('START_LINEAR_PRELOADER', 'updateAfterChanges')
      const id = taskId ? { taskId } : { caseId }
      const action = taskId ? 'getTaskDetails' : 'getCaseDetails'
      await dispatch(action, id)
      commit('STOP_LINEAR_PRELOADER', 'updateAfterChanges')
    }
  }
}
