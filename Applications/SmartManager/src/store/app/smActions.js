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
  async getTasks({commit}, payload) {
    const folderId = payload.folderId
    commit('setSearch', null)
    startLoading(payload.loading)
    try {
      const result = await api.getTasksFromGql(
        folderId === 'ALL' ? '' : folderId
      )
      stopLoading()
      const taskList = result.data.smtasks.tasks
      const tasks = {[folderId]: taskList}
      commit('setTasks', tasks)
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'taskListTitle', 'taskListError')
    }
  },
  async getTaskInfo({commit}, payload) {
    const taskId = payload.id
    startLoading(payload.loading)
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
        notify(
          'success',
          'taskTitle',
          'taskAddSuccess')
      } else {
        notify('warning', 'taskTitle', 'taskAddFail')
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
          id: payload.id,
          loading: true
        })
        notify('success', 'statusTitle', 'statChangeSuccess')
      } else {
        notify(
          'warning',
          'statusTitle',
          'statChangeFail')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'statusTitle', 'statChangeError')
    }
  },
  async addAttachments({dispatch, state}, payload) {
    startLoading(true)
    const taskId = state.taskInfo.id
    const attachments = JSON.stringify(payload)
    try {
      const response = await api.addAttachmentsInGql(taskId, attachments)
      const result = response.data.smtasksMutation.addAttachments
      stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId,
          loading: true
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
        notify(
          'success',
          'stageTitle',
          'stageChangeSuccess')
      } else {
        notify(
          'warning',
          'stageTitle',
          'stageChangeFail')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'stageTitle', 'stageChangeError')
    }
  },
  async addTaskComment({commit}, payload) {
    const comment = payload.comment
    const params = JSON.stringify(payload.params)
    startLoading(true)
    try {
      const response = await api.addTaskCommentToGql(comment, params)
      const result = response.data.smtasksMutation.addComment
      stopLoading()
      if (result.success) {
        commit('addComment', {
          id: payload.params.id,
          text: comment
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
  async getFormDefinition(context, deployId) {
    startLoading(true)
    try {
      const response = await api.getFormDefinitionFromGql(deployId)
      const result = response.data.workFlowQuery.formDefinition
      stopLoading()
      if (result.Success) {
        return result.Data
      }
      notify('warning', 'bpTitle', 'bpError')
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
        console.log('', startedProcess.ProcessInstance)
        notify('success', 'bpTitle', 'bpSuccess')
      }
    } catch (e) {
      stopLoading()
      console.log(e.message)
      notify('danger', 'bpTitle', 'bpError')
    }
  }
}
