import Vue from 'vue'
import {i18n} from '@/i18n/i18n'
import {SmartManagerApi as api} from '@/api/smartManagerApi'

const vs = new Vue().$vs
const startLoading = () => vs.loading()
const stopLoading = () => vs.loading.close()

const notify = (type, title, text) => {
  vs.notify({
    title: i18n.t(`notify.${title}`),
    text: i18n.t(`notify.${text}`),
    color: type
  })
}

export default {
  async getFileDetails({commit, rootState}, {fileId, fileExt, id: taskOrCaseId}) {
    startLoading()
    try {
      const result = await api.getFileDetailsFromGql(fileId, fileExt)
      const fileDetails = JSON.parse(result.data.smtasks.fileDetails)
      commit('SET_ATTACHMENT_DETAILS', {fileId, fileDetails, taskOrCaseId, rootState})
      stopLoading()
      return fileDetails
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskTitle', 'taskError')
    }
  },
  async getAttachmentTypes(context, params) {
    const paramsJson = JSON.stringify(params)
    startLoading()
    try {
      const response = await api.getAttachmentTypesFromGql(paramsJson)
      stopLoading()
      return response.data.smtasks.attachmentTypes
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'commentsTitle', 'commentAddError')
    }
  },
  async addAttachments({dispatch}, {attachments, params}) {
    const paramsJson = JSON.stringify(params)
    startLoading()
    try {
      const response = await api.addAttachmentsInGql(attachments, paramsJson)
      stopLoading()
      // Returns results list
      const results = response.data.smtasksMutation.addAttachments
      results.forEach(result => {
        if (result.success) {
          vs.notify({
            title: result.name,
            text: i18n.t('notify.attachAddSuccess'),
            color: 'success'
          })
        } else if (result.errorMessage) {
          vs.notify({
            title: result.name,
            text: result.errorMessage,
            color: 'warning'
          })
        } else {
          notify('warning', 'attachTitle', 'attachAddFail')
        }
      })
      await dispatch('updateInfo', {
        type: params.type,
        id: params.id,
      })
      return results
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'attachTitle', 'attachAddError')
    }
  },
  async attachmentDelete(context, id) {
    startLoading()
    try {
      const response = await api.attachmentDeleteInGql(id)
      const result = response.data.smtasksMutation.attachmentDelete
      stopLoading()
      if (result.success) {
        notify('success', 'attachTitle', 'attachDelSuccess')
      } else {
        notify('warning', 'attachTitle', 'attachDelFail')
      }
      return result
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'attachTitle', 'attachDelError')
    }
  }
}
