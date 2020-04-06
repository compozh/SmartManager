import { SmartManagerApi as api } from '@/api/smartManagerApi'

const startLoading = () => ({})
const stopLoading = () => ({})

const notify = (type, title, text) => ({})

export default {
  async getFileDetails ({ commit, rootState }, { fileId, fileExt, id: taskOrCaseId }) {
    startLoading()
    try {
      const result = await api.getFileDetailsFromGql(fileId, fileExt)
      const fileDetails = JSON.parse(result.data.smtasks.fileDetails)
      if (fileDetails.ErrorMessage) {
        // vs.notify({
        //   title: i18n.t('notify.attachTitle'),
        //   text: fileDetails.ErrorMessage,
        //   color: 'warning'
        // })
      }
      commit('SET_ATTACHMENT_DETAILS', { fileId, fileDetails, taskOrCaseId, rootState })
      stopLoading()
      return fileDetails
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskTitle', 'taskError')
    }
  },
  async getAttachmentTypes ({ commit }, params) {
    const paramsJson = JSON.stringify(params)
    startLoading()
    try {
      const response = await api.getAttachmentTypesFromGql(paramsJson)
      stopLoading()
      const result = JSON.parse(response.data.smtasks.attachmentTypes)
      commit('SET_ATTACHMENT_TYPES', result)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'commentsTitle', 'commentAddError')
    }
  },
  async addAttachment ({ dispatch }, payload) {
    startLoading()
    const attachments = JSON.stringify(payload.attachments)
    const params = JSON.stringify(payload.params)
    try {
      const response = await api.addAttachmentsInGql(attachments, params)
      stopLoading()
      // Returns results list
      const results = response.data.smtasksMutation.addAttachments
      results.forEach(result => {
        if (result.success) {
          // vs.notify({
          //   title: result.name,
          //   text: i18n.t('notify.attachAddSuccess'),
          //   color: 'success'
          // })
        } else if (result.errorMessage) {
          // vs.notify({
          //   title: result.name,
          //   text: result.errorMessage,
          //   color: 'warning'
          // })
        } else {
          notify('warning', 'attachTitle', 'attachAddFail')
        }
      })
      await dispatch('updateInfo', {
        type: payload.params.type,
        id: payload.params.id,
        loading: true
      })
      return results
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'attachTitle', 'attachAddError')
    }
  },
  async attachmentDelete ({ dispatch }, { fileId, taskId, caseId }) {
    startLoading()
    try {
      const response = await api.attachmentDeleteInGql(fileId)
      stopLoading()
      const result = response.data.smtasksMutation.attachmentDelete
      if (result.success) {
        await dispatch('updateAfterDelete', { taskId, caseId })
        notify('success', 'attachTitle', 'attachDelSuccess')
      } else if (result.errorMessage) {
        // vs.notify({
        //   title: i18n.t('notify.attachTitle'),
        //   text: result.errorMessage,
        //   color: 'warning'
        // })
      } else {
        notify('warning', 'attachTitle', 'attachDelFail')
      }
      return result
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'attachTitle', 'attachDelError')
    }
  },
  async updateAfterDelete ({ dispatch }, { taskId, caseId }) {
    // Update task or case after delete if it needs
    if (taskId || caseId) {
      startLoading()
      const id = taskId ? { taskId } : { caseId }
      const action = taskId ? 'getTaskDetails' : 'getCaseDetails'
      await dispatch(action, id)
      stopLoading()
    }
  }
}
