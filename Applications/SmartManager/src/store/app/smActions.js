import Vue from 'vue'
import {i18n} from '@/i18n/i18n'
import {SmartManagerApi as api} from '@/api/smartManagerApi'

const vs = new Vue().$vs

function startLoading(loading) {
  !loading || vs.loading()
}

function stopLoading() {
  vs.loading.close()
}

function notify(type, title, text) {
  vs.notify({
    title: i18n.t(`notify.${title}`),
    text: i18n.t(`notify.${text}`),
    color: type
  })
}

export default {
  async getFolders({commit}) {
    try {
      const result = await api.getFoldersFromGql()
      const folders = result.data.smtasks.folders
      commit('setFolders', folders)
    } catch (e) {
      console.log(e.message)
      notify('danger', 'foldersTitle', 'foldersError')
    }
  },
  async getTasks({commit}, {folderId, loading}) {
    commit('setSearch', null)
    startLoading(loading)
    try {
      const result = await api.getTasksFromGql(
        folderId === 'ALL' ? '' : folderId
      )
      !loading || stopLoading()
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
    startLoading(loading)
    try {
      const result = await api.getTaskInfoFromGql(taskId)
      stopLoading()
      const taskInfo = result.data.smtasks.taskDetails
      const task = {[taskId]: taskInfo}
      commit('setTaskInfo', task)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskTitle', 'taskError')
    }
  },
  async getFileUrl({commit}, {fileId, fileExt, id: taskOrCaseId}) {
    startLoading(true)
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
    startLoading(true)
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
  async changeStatus({dispatch}, payload) {
    const status = JSON.stringify(payload)
    startLoading(true)
    try {
      const response = await api.changeTaskStatusInGql(status)
      stopLoading()
      const result = response.data.smtasksMutation.changeStatus
      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loading: true
        })
        notify('success', 'statusTitle', 'statChangeSuccess')
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
    startLoading(true)
    try {
      const response = await api.addAttachmentsInGql(attachments, paramsJson)
      const result = response.data.smtasksMutation.addAttachments
      stopLoading()
      if (result.success) {
        await dispatch('updateInfo', {
          type: params.type,
          id: params.id
        })
        notify('success', 'attachTitle', 'attachAddSuccess')
      } else {
        notify('warning', 'attachTitle', 'attachAddFail')
      }
      return result
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'attachTitle', 'attachAddError')
    }
  },
  async changeStage({dispatch}, payload) {
    const stageParams = JSON.stringify(payload)
    startLoading(true)
    try {
      const response = await api.changeTaskStageInGql(stageParams)
      const result = response.data.smtasksMutation.changeStage
      stopLoading()
      console.log('result', result)
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
    startLoading(true)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      stopLoading()
      if (result.success) {
        await dispatch('updateInfo', {
          type: params.type,
          id: params.id
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
    startLoading(true)
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
    startLoading(true)
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
    startLoading(loading)
    try {
      const result = await api.getCasesFromGql()
      stopLoading()
      const cases = result.data.smtasks.cases
      commit('setCases', cases)
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseListError')
    }
  },
  async getCaseDetails({commit}, {caseId, loading}) {
    startLoading(loading || true)
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
    startLoading(true)
    try {
      const response = await api.caseCreateInGql(newCaseJson)
      stopLoading()
      notify('success', 'caseTitle', 'caseCreateSuccess')
      return response.data.smtasksMutation.newCase
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'caseTitle', 'caseError')
    }
  },
  async caseUpdate({dispatch}, caseData) {
    const caseDataJson = JSON.stringify(caseData)
    startLoading(true)
    try {
      const response = await api.caseUpdateInGql(caseDataJson)
      const result = response.data.smtasksMutation.caseUpdate
      stopLoading()
      if (result.success) {
        dispatch('getCaseDetails', {caseId: caseData.id})
      }
    } catch (e) {
      console.log(e.message)
      stopLoading()
      notify('danger', 'casesTitle', 'caseUpdateError')
    }
  },
  async caseFolderCreate({dispatch}, folderName) {
    startLoading(true)
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
  async updateInfo({dispatch}, {type, id}) {
    if (type === 'TASK' || type === 'DOCUMENT') {
      return await dispatch('getTaskInfo', {
        taskId: id,
        loading: true
      })
    }
    if (type === 'CASE') {
      return await dispatch('getCaseDetails', {
        caseId: id,
        loading: true
      })
    }
  }
}
