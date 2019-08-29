import {i18n} from '../../i18n/i18n'
import {SmartManagerApi as api} from '../../api/smartManagerApi'

function trimHtmlTags(stringWithHtmlTags) {
  const elem = document.createElement('div')
  elem.innerHTML = stringWithHtmlTags
  return elem.innerText
}

export default {
  async getFolders({commit}, payload) {
    const loader = payload.loader
    commit(loader, true)

    try {
      const result = await api.getFoldersFromGql()
      const folders = result.data.smtasks.folders
      commit('setFolders', folders)
      commit(loader, false)

    } catch (e) {
      commit(loader, false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async getTasks({commit}, payload) {
    const folderId = payload.folderId
    const loader = payload.loader

    commit('setSearch', null)
    commit(loader, true)

    try {
      const result = await api.getTasksFromGql(
        folderId === 'ALL' ? '' : folderId
      )
      const taskList = result.data.smtasks.tasks
      taskList.forEach(task => task.name = trimHtmlTags(task.name))

      const tasks = {[folderId]: taskList}
      commit('setTasks', tasks)
      commit(loader, false)

    } catch (e) {
      commit(loader, false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async getTaskInfo({commit}, payload) {
    const taskId = payload.taskId
    const loader = payload.loader

    commit(loader, true)

    try {
      const result = await api.getTaskInfoFromGql(taskId)
      const taskInfo = result.data.smtasks.taskDetails

      taskInfo.name = trimHtmlTags(taskInfo.name)
      commit('setTaskInfo', taskInfo)
      commit(loader, false)

    } catch (e) {
      commit(loader, false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async getUsers({commit}) {
    commit('setLinearLoader', true)

    try {
      const result = await api.getUsersFromGql()
      const users = result.data.smtasks.users
      commit('setLinearLoader', false)
      commit('setUsers', users)

    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async addNewTask({commit, dispatch}, payload) {
    const newTask = JSON.stringify(payload)
    commit('setCircularLoader', true)

    try {
      const response = await api.addNewTaskToGql(newTask)
      const result = response.data.smtasksMutation.addTask
      commit('setCircularLoader', false)

      if (result.success) {
        commit('setTaskAddForm', 'close')

        await dispatch('getFolders', {
          loader: 'setLinearLoader'
        })
        commit('setMessage', {
          type: 'success',
          text: i18n.$t('sm.messages.taskAddSuccess')
        })
      } else {
        commit('setMessage', {
          type: 'error',
          text: i18n.t('sm.messages.taskAddFail')
        })
      }
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setMessage', {
        type: 'error',
        text: i18n.t('sm.messages.taskAddError')
      })
      console.log('', e.message)
    }
  },
  async changeTaskStatus({commit, dispatch}, payload) {
    const status = JSON.stringify(payload)
    commit('setLinearLoader', true)

    try {
      const response = await api.changeTaskStatusInGql(status)
      const result = response.data.smtasksMutation.changeStatus
      commit('setLinearLoader', false)

      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loader: 'setLinearLoader'
        })
        commit('setMessage', {
          type: 'success',
          text: i18n.t('sm.messages.statChangeSuccess')
        })
      } else {
        commit('setMessage', {
          type: 'error',
          text: i18n.t('sm.messages.statChangeFail')
        })
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async addAttachments({commit, dispatch, state}, payload) {
    commit('setLinearLoader', true)
    const taskId = state.taskInfo.id
    const attachments = JSON.stringify(payload)
    try {
      const response = await api.addAttachmentsInGql(taskId, attachments)
      const result = response.data.smtasksMutation.addAttachments
      commit('setLinearLoader', false)

      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId,
          loader: 'setLinearLoader'
        })
        commit('setMessage', {
          type: 'success',
          text: i18n.t('sm.messages.attachAddSuccess')
        })
      } else {
        commit('setMessage', {
          type: 'error',
          text: i18n.t('sm.messages.attachAddFail')
        })
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async changeTaskStage({commit, dispatch}, payload) {
    const stageParams = JSON.stringify(payload)
    commit('setLinearLoader', true)

    try {
      const response = await api.changeTaskStageInGql(stageParams)
      const result = response.data.smtasksMutation.changeStage

      const text = trimHtmlTags(result.log)
      commit('setLinearLoader', false)

      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loader: 'setLinearLoader'
        })
        commit('setMessage', {type: 'success', text})
      } else {
        commit('setMessage', {type: 'error', text})
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async addTaskComment({commit}, payload) {
    const comment = payload.comment
    const params = JSON.stringify(payload.params)
    commit('setLinearLoader', true)
    try {
      const response = await api.addTaskCommentToGql(comment, params)
      const result = response.data.smtasksMutation.addComment
      commit('setLinearLoader', false)

      if (result.success) {
        commit('addComment', comment)
      } else {
        commit('setMessage', {
          type: 'error',
          text: i18n.t('sm.messages.commentAddSuccess')
        })
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {
        type: 'error',
        text: i18n.t('sm.messages.commentAddFail')
      })
      console.log('', e.message)
    }
  }
}
