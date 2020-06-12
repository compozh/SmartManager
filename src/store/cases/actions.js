import { SmartManagerApi as api } from '@/api/smartManagerApi'
// import i18n from '@/i18n'

export default {
  async getCases ({ commit }) {
    try {
      const result = await api.getCasesFromGql()
      const cases = result.data.smtasks.cases
      commit('setCases', cases)
      // !loading || stopLoading()
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'casesTitle', 'caseListError')
    }
  },
  async getCaseDetails ({ commit }, { caseId }) {
    // startLoading()
    try {
      const result = await api.getCaseDetailsFromGql(caseId)
      // stopLoading()
      const caseDetails = result.data.smtasks.caseDetails
      const caseItem = { [caseId]: caseDetails }
      commit('setCaseDetails', caseItem)
    } catch (e) {
      console.log(e.message)
      // stopLoading()
      // notify('danger', 'casesTitle', 'caseDetailsError')
    }
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
  }
}
