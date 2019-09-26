import Vue from 'vue'
import {i18n} from '../../i18n/i18n'
import {SmartManagerApi as api} from '../../api/smartManagerApi'

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
    text,
    color: type
  })
}

function trimHtmlTags(stringWithHtmlTags) {
  const elem = document.createElement('div')
  elem.innerHTML = stringWithHtmlTags
  return elem.innerText
}

export default {
  async getFolders({commit}) {
    try {
      const result = await api.getFoldersFromGql()
      const folders = result.data.smtasks.folders
      commit('setFolders', folders)
    } catch (e) {
      notify('danger', 'foldersTitle', e.message)
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
      notify('danger', 'taskListTitle', e.message)
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
      notify('danger','taskTitle', e.message)
    }
  },
  async getUsers({commit}) {
    try {
      const result = await api.getUsersFromGql()
      const users = result.data.smtasks.users
      commit('setUsers', users)
    } catch (e) {
      notify('danger', 'usersTitle', e.message)
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
          i18n.t('notify.taskAddSuccess'))
      } else {
        notify(
          'warning',
          'taskTitle',
          i18n.t('notify.taskAddFail'))
      }
    } catch (e) {
      stopLoading()
      notify('danger','taskTitle', e.message)
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
        notify(
          'success',
          'statusTitle',
          i18n.t('notify.statChangeSuccess'))
      } else {
        notify(
          'warning',
          'statusTitle',
          i18n.t('notify.statChangeFail'))
      }
    } catch (e) {
      stopLoading()
      notify('danger','statusTitle', e.message)
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
        notify(
          'success',
          'attachTitle',
          i18n.t('notify.attachAddSuccess'))
      } else {
        notify(
          'warning',
          'attachTitle',
          i18n.t('notify.attachAddFail'))
      }
    } catch (e) {
      stopLoading()
      notify('danger','attachTitle', e.message)
    }
  },
  async changeStage({dispatch}, payload) {
    const stageParams = JSON.stringify(payload)
    startLoading(true)
    try {
      const response = await api.changeTaskStageInGql(stageParams)
      const result = response.data.smtasksMutation.changeStage
      stopLoading()
      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loader: true
        })
        notify('success', 'stageTitle', trimHtmlTags(result.log))
      } else {
        notify('warning', 'stageTitle', trimHtmlTags(result.log))
      }
    } catch (e) {
      stopLoading()
      notify('danger','stageTitle', e.message)
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
        notify(
          'success',
          'commentsTitle',
          i18n.t('notify.commentAddSuccess'))
      } else {
        notify(
          'warning',
          'commentsTitle',
          i18n.t('notify.commentAddFail'))
      }
    } catch (e) {
      stopLoading()
      notify('danger','commentsTitle', e.message)
    }
  }
}
