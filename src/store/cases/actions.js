import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getCases ({ state, commit }) {
    commit('SET_SEARCH', null)
    commit('START_LINEAR_PRELOADER', 'cases')
    state.cases || commit('START_PRELOADER', 'cases')
    try {
      const result = await api.getCasesFromGql()
      const cases = result.data.smtasks.cases
      commit('SET_CASES', cases)
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.caseListError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'cases')
      commit('STOP_LINEAR_PRELOADER', 'cases')
    }
  },
  async getCaseDetails ({ state, commit }, { caseId }) {
    const result = { success: false }
    const preLoader = state.caseDetails && caseId in state.caseDetails
    preLoader || commit('START_PRELOADER', 'case')
    commit('START_LINEAR_PRELOADER', 'case')
    try {
      const response = await api.getCaseDetailsFromGql(caseId)
      const caseDetails = response.data.smtasks.caseDetails
      result.success = !!caseDetails
      commit('SET_CASE_DETAILS', { [caseId]: caseDetails })
      commit('SET_ATTACHMENTS', caseDetails.originals)
      commit('SET_COMMENTS', caseDetails.comments)
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.caseDetailsError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'case')
      commit('STOP_LINEAR_PRELOADER', 'case')
    }
    return result
  },
  async caseCreate (context, newCase) {
    const newCaseJson = JSON.stringify(newCase)
    // startLoading()
    try {
      const response = await api.caseCreateInGql(newCaseJson)
      // stopLoading()
      // notify('success', 'casesTitle', 'caseCreateSuccess')
      return response.data.smtasksMutation.newCase
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'casesTitle', 'caseError')
    }
  },
  async caseUpdate ({ dispatch }, caseData) {
    const caseDataJson = JSON.stringify(caseData)
    // startLoading()
    try {
      const response = await api.updateCaseInGql(caseDataJson)
      const result = response.data.smtasksMutation.caseUpdate
      // stopLoading()
      if (result.success) {
        await dispatch('getCaseDetails', { caseId: caseData.id })
        // notify('success','casesTitle','updateSuccess')
      } else {
        // notify('warning','casesTitle','updateFail')
      }
      return result.success
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'casesTitle', 'caseUpdateError')
    }
  },
  async caseFolderCreate ({ dispatch }, folderName) {
    // startLoading()
    try {
      await api.caseFolderCreateInGql(folderName)
      await dispatch('getFolders')
      // stopLoading()
      // notify('success', 'foldersTitle', 'folderCreateSuccess')
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'foldersTitle', 'folderCreateError')
    }
  },
  async changeBinding ({ dispatch }, { caseId, taskId, bind }) {
    // startLoading()
    try {
      const response = await api.changeBindingInGql(caseId, taskId, bind)
      const result = response.data.smtasksMutation.binding
      // stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', { taskId, loader: true })
      } else {
        // notify('warning', 'taskTitle', 'bindingFail')
      }
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'taskTitle', 'bindingError')
    }
  },
  async addCaseComment ({ dispatch, commit }, { comment, params }) {
    const paramsJson = JSON.stringify(params)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      if (result.success) {
        await dispatch('getCaseDetails', { caseId: params.id })
      } else {
        commit('SET_NOTIFY', {
          text: i18n.t('notify.commentAddFail'),
          color: 'error'
        })
      }
      return result
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.commentAddError'),
        color: 'error'
      })
    }
  }
}
