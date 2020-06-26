import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getFileDetails ({ commit }, { fileId, fileExt }) {
    commit('START_LINEAR_PRELOADER', 'fileDetails')
    try {
      const result = { success: true, errorMessage: '' }
      const response = await api.getFileDetailsFromGql(fileId, fileExt)
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
      return result
    } catch (e) {
      console.log(e.message)
      // notify('danger', 'taskTitle', 'taskError')
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'fileDetails')
    }
  },
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
        text: error.message || 'Type getting error' /* TODO: add resource notify.typeGettingError */,
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'attachmentTypes')
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
  async addVersion ({ dispatch, commit }, { fileId, fileExt, filePath }) {
    commit('START_LINEAR_PRELOADER', 'addVersion')
    try {
      const response = await api.addAttachmentVersionInGql(fileId, filePath)
      const result = response.data.smtasksMutation.addAttachmentVersion
      if (result.success) {
        dispatch('getFileDetails', { fileId, fileExt })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || 'Version adding fail', /* TODO: add resource notify.versionAddingFail */
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || 'Version adding error', /* TODO: add resource notify.versionAddingError */
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'addVersion')
    }
  },
  async setActiveVersion ({ dispatch, commit }, { attachmentId, versionId }) {
    commit('START_LINEAR_PRELOADER', 'setActiveVersion')
    try {
      const response = await api.setActiveVersionInGql(versionId)
      const result = response.data.smtasksMutation.setActiveVersion
      if (result.success) {
        dispatch('getFileDetails', { fileId: attachmentId })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || 'Active version setting fail', /* TODO: add resource notify.versionAddingFail */
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || 'Active version setting error', /* TODO: add resource notify.versionAddingError */
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'setActiveVersion')
    }
  },
  async deleteVersion ({ dispatch, commit }, { attachmentId, versionId }) {
    commit('START_LINEAR_PRELOADER', 'deleteVersion')
    try {
      const response = await api.deleteVersionInGql(versionId)
      const result = response.data.smtasksMutation.deleteVersion
      if (result.success) {
        dispatch('getFileDetails', { fileId: attachmentId })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || 'Version delete fail', /* TODO: add resource notify.versionAddingFail */
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || 'Version delete error', /* TODO: add resource notify.versionAddingError */
        color: 'error'
      })
    } finally {
      commit('STOP_LINEAR_PRELOADER', 'deleteVersion')
    }
  },
  async attachmentDelete ({ dispatch, commit }, { fileId, taskId, caseId }) {
    commit('START_PRELOADER', 'attachmentDelete')
    try {
      const response = await api.attachmentDeleteInGql(fileId)
      const result = response.data.smtasksMutation.attachmentDelete
      if (result.success) {
        await dispatch('updateAfterDelete', { taskId, caseId })
        commit('SET_NOTIFY', {
          text: result.successMessage || i18n.t('notify.attachDelSuccess'),
          color: 'success'
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
  async updateAfterDelete ({ dispatch, commit }, { taskId, caseId }) {
    // Update task or case after delete if it needs
    if (taskId || caseId) {
      commit('START_LINEAR_PRELOADER', 'updateAfterDelete')
      const id = taskId ? { taskId } : { caseId }
      const action = taskId ? 'getTaskDetails' : 'getCaseDetails'
      await dispatch(action, id)
      commit('STOP_LINEAR_PRELOADER', 'updateAfterDelete')
    }
  }
}
