import Vue from 'vue'
import {i18n} from '@/i18n/i18n'
import {SmartManagerApi as api} from '@/api/smartManagerApi'

const vs = new Vue().$vs
const startLoading = vs.loading
const stopLoading = vs.loading.close
const notify = (type, title, text) => {
  vs.notify({
    title: i18n.t(`notify.${title}`),
    text: i18n.t(`notify.${text}`),
    color: type
  })
}

export default {
  async getFolders({commit}, loading) {
    !loading || startLoading()
    try {
      const result = await api.getFoldersFromGql()
      !loading || stopLoading()
      const folders = result.data.smtasks.folders
      commit('setFolders', folders)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'foldersTitle', 'foldersError')
    }
  },
  async getTasks({commit, state}, folderId) {
    if (folderId === 'search') {
      return
    }
    const loader = !state.tasks[folderId]
    commit('setSearch', null)
    commit('setCurrentFolder', folderId)
    !loader || startLoading()
    try {
      const result = await api.getTasksFromGql(
        folderId === 'ALL' ? '' : folderId
      )
      !loader || stopLoading()
      const taskList = result.data.smtasks.tasks
      const tasks = {[folderId]: taskList}
      commit('setTasks', tasks)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskListTitle', 'taskListError')
    }
  },
  async getTaskInfo({commit}, {taskId, loading}) {
    !loading || startLoading()
    try {
      const result = await api.getTaskInfoFromGql(taskId)
      const taskInfo = result.data.smtasks.taskDetails
      const task = {[taskId]: taskInfo}
      commit('setTaskInfo', task)
      !loading || stopLoading()
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskTitle', 'taskError')
    }
  },
  async getFileUrl({commit}, {fileId, fileExt, id: taskOrCaseId}) {
    startLoading()
    try {
      const result = await api.getFileUrlFromGql(fileId, fileExt)
      const fileUrl = result.data.smtasks.fileUrl
      commit('setFileUrl', {fileId, fileUrl, taskOrCaseId})
      stopLoading()
      return fileUrl
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskTitle', 'taskError')
    }
  },
  async getUsers({commit}) {
    try {
      const result = await api.getUsersFromGql()
      const users = result.data.smtasks.users
      commit('setUsers', users)
    } catch (e) {
      console.log(e.message)
      notify('danger', 'usersTitle', 'usersError')
    }
  },
  async addNewTask({dispatch}, payload) {
    const newTask = JSON.stringify(payload)
    startLoading()
    try {
      const response = await api.addNewTaskToGql(newTask)
      const result = response.data.smtasksMutation.addTask
      stopLoading()
      if (result.success) {
        await dispatch('getFolders')
        notify('success','taskTitle','taskAddSuccess')
      } else {
        notify('warning','taskTitle','taskAddFail')
      }
      return result
    } catch (e) {
      stopLoading()
      notify('danger', 'taskTitle', 'taskAddError')
      throw Error
    }
  },
  async updateTask({dispatch}, taskData) {
    const taskDataJson = JSON.stringify(taskData)
    startLoading()
    try {
      const response = await api.updateTaskInGql(taskDataJson)
      const result = response.data.smtasksMutation.taskUpdating
      stopLoading()
      if (result.success) {
        dispatch('getTaskInfo', {taskId: taskData.id})
        notify('success','taskTitle','updateSuccess')
      } else {
        notify('warning','taskTitle','updateFail')
      }
      return result.success
    } catch (e) {
      stopLoading()
      notify('danger', 'taskTitle', 'updateError')
      throw Error
    }
  },
  async changeStatus({dispatch}, params) {
    const paramsJson = JSON.stringify(params)
    startLoading()
    try {
      const response = await api.changeTaskStatusInGql(paramsJson)
      stopLoading()
      const result = response.data.smtasksMutation.changeStatus
      if (result.success) {
        await dispatch('updateInfo', {
          type: params.type,
          id: params.id,
          loading: true
        })
        notify('success', 'statusTitle', 'statChangeSuccess')
        return result.success
      } else {
        notify('warning','statusTitle','statChangeFail')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'statusTitle', 'statChangeError')
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
  },
  async changeStage({dispatch}, payload) {
    const stageParams = JSON.stringify(payload)
    startLoading()
    try {
      const response = await api.changeTaskStageInGql(stageParams)
      const result = response.data.smtasksMutation.changeStage
      stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loader: true
        })
        notify('success','stageTitle','stageChangeSuccess')
      } else {
        notify('warning','stageTitle','stageChangeFail')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'stageTitle', 'stageChangeError')
    }
  },
  async addComment({dispatch}, {comment, params}) {
    const paramsJson = JSON.stringify(params)
    startLoading()
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      // Loading will be stopped after task info update
      if (result.success) {
        await dispatch('updateInfo', {
          type: params.type,
          id: params.id,
          loading: true
        })
        notify('success', 'commentsTitle', 'commentAddSuccess')
      } else {
        notify('warning', 'commentsTitle', 'commentAddFail')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'commentsTitle', 'commentAddError')
    }
  },
  async getBusinessProcesses() {
    try {
      const result = await api.getBusinessProcessesFromGql()
      return result.data.workFlowQuery.businessProcesses
    } catch (e) {
      console.log(e.message)
      notify('danger', 'bpTitle', 'bpError')
    }
  },
  async getFormDefinition(context, procDefId) {
    startLoading()
    try {
      const response = await api.getFormDefinitionFromGql(procDefId)
      const result = response.data.workFlowQuery.formDefinition
      stopLoading()
      if (result.Success) {
        return result.Data
      }
      notify('warning', 'bpTitle', result.ErrorMessage)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'bpTitle', 'bpError')
    }
  },
  async startBusinessProcess(context, payload) {
    const processData = JSON.stringify(payload)
    startLoading()
    try {
      const response = await api.startBusinessProcessInGql(processData)
      stopLoading()
      const result = response.data.workFlowQuery.startBusinessProcess
      const startedProcess = JSON.parse(result)

      if (startedProcess.ProcessInstance) {
        notify('success', 'bpTitle', 'bpSuccess')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'bpTitle', 'bpError')
    }
  },
  async getCases({commit}, loading) {
    !loading || startLoading()
    try {
      const result = await api.getCasesFromGql()
      !loading || stopLoading()
      const cases = result.data.smtasks.cases
      commit('setCases', cases)
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseListError')
    }
  },
  async getCaseDetails({commit}, {caseId}) {
    startLoading()
    try {
      const result = await api.getCaseDetailsFromGql(caseId)
      stopLoading()
      const caseDetails = result.data.smtasks.caseDetails
      const caseItem = {[caseId]: caseDetails}
      commit('setCaseDetails', caseItem)
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseDetailsError')
    }
  },
  async caseCreate(context, newCase) {
    const newCaseJson = JSON.stringify(newCase)
    startLoading()
    try {
      const response = await api.caseCreateInGql(newCaseJson)
      stopLoading()
      notify('success', 'casesTitle', 'caseCreateSuccess')
      return response.data.smtasksMutation.newCase
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseError')
    }
  },
  async caseUpdate({dispatch}, caseData) {
    const caseDataJson = JSON.stringify(caseData)
    startLoading()
    try {
      const response = await api.updateCaseInGql(caseDataJson)
      const result = response.data.smtasksMutation.caseUpdate
      stopLoading()
      if (result.success) {
        await dispatch('getCaseDetails', {caseId: caseData.id})
        notify('success','casesTitle','updateSuccess')
      } else {
        notify('warning','casesTitle','updateFail')
      }
      return result.success
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseUpdateError')
    }
  },
  async caseFolderCreate({dispatch}, folderName) {
    startLoading()
    try {
      await api.caseFolderCreateInGql(folderName)
      await dispatch('getFolders')
      stopLoading()
      notify('success', 'foldersTitle', 'folderCreateSuccess')
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'foldersTitle', 'folderCreateError')
    }
  },
  async changeBinding({dispatch}, {caseId, taskId, bind}) {
    startLoading()
    try {
      const response = await api.changeBindingInGql(caseId, taskId, bind)
      const result = response.data.smtasksMutation.binding
      stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', {taskId, loader: true})
      } else {
        notify('warning', 'taskTitle', 'bindingFail')
      }
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'taskTitle', 'bindingError')
    }
  },
  async taskDelete({dispatch, state}, taskId) {
    startLoading()
    try {
      const response = await api.taskDeleteInGql(taskId)
      const result = response.data.smtasksMutation.taskDelete
      stopLoading()
      if (result.success) {
        // If deleted task has parent - update parent
        const parentId = state.taskInfo[taskId].parentTask.id
        if (parentId) {
          await dispatch('getTaskInfo', { taskId: parentId })
        }
        // If deleted task bind to case - update case
        const caseId = state.taskInfo[taskId].caseId
        if (caseId) {
          await dispatch('getCaseDetails', { caseId: caseId })
        }
        // TODO: If deleted task has child tasks - update child tasks
        notify('success', 'taskTitle', 'taskDelSuccess')
      } else {
        notify('warning', 'taskTitle', 'taskDelFail')
      }
      return result.success
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'taskTitle', 'taskDelError')
      return false
    }
  },
  async taskPin({dispatch}, {taskId, pin}) {
    startLoading()
    try {
      const response = await api.taskPinInGql(taskId, pin)
      const result = response.data.smtasksMutation.taskPin
      stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', {taskId, loader: true})
        notify('success', 'taskTitle', 'taskPinSuccess')
      } else {
        notify('warning', 'taskTitle', 'taskPinFail')
      }
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'taskTitle', 'taskPinError')
    }
  },
  async globalSearch({commit, state}) {
    startLoading()
    commit('setCurrentFolder', 'search')
    try {
      const response = await api.globalSearchInGql(state.search)
      stopLoading()
      const result = response.data.smtasks.globalSearchResult
      commit('setTasks', {search: result})
      commit('setSearch', null)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskListTitle', 'taskListError')
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
  async updateInfo({dispatch}, {type, id, loading}) {
    if (type === 'TASK' || type === 'DOCUMENT') {
      return await dispatch('getTaskInfo', {
        taskId: id, loading})
    }
    if (type === 'CASE') {
      return await dispatch('getCaseDetails', {
        caseId: id,
        loading: true
      })
    }
  }
}
