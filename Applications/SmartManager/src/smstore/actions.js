import {SmartManagerApi} from '../api/smartManagerApi'

const api = new SmartManagerApi()

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
      const tasks = {
        [folderId]: result.data.smtasks.tasks
      }
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
    commit('setCircularLoader', true)

    try {
      const response = await api.addNewTaskToGql(payload)
      const result = response.data.smtasksMutation.addTask
      commit('setCircularLoader', false)

      if (result.success) {
        commit('setTaskAddForm', 'close')

        await dispatch('getFolders', {loader: 'setLinearLoader'})
        commit('setMessage', {type: 'success', text: 'Задача успешно добавлена'})
      } else {
        commit('setMessage', {type: 'error', text: 'Не удалось добавить задачу'})
      }
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setMessage', {type: 'error', text: 'Ошибка при добавлении задачи'})
      console.log('', e.message)
    }
  },
  async changeTaskStatus({commit, dispatch}, payload) {
    commit('setLinearLoader', true)

    try {
      const response = await api.changeTaskStatusInGql(payload)
      const result = response.data.smtasksMutation.changeStatus
      commit('setLinearLoader', false)

      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId: payload.id,
          loader: 'setLinearLoader'
        })
        commit('setMessage', {type: 'success', text: 'Статус задачи успешно изменен'})
      } else {
        commit('setMessage', {type: 'error', text: 'Не удалось изменить статус задачи'})
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async addAttachments({commit, dispatch, state}, payload) {
    commit('setLinearLoader', true)
    const taskId = state.taskInfo.id
    try {
      const response = await api.addAttachmentsInGql(taskId, payload)
      const result = response.data.smtasksMutation.addAttachments
      commit('setLinearLoader', false)

      if (result.success) {
        await dispatch('getTaskInfo', {
          taskId,
          loader: 'setLinearLoader'
        })
        commit('setMessage', {type: 'success', text: 'Вложение успешно добавлено'})
      } else {
        commit('setMessage', {type: 'error', text: 'Не удалось добавить вложение'})
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async changeTaskStage({commit, dispatch}, payload) {
    commit('setLinearLoader', true)

    try {
      const response = await api.changeTaskStageInGql(payload)
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
    const params = payload.params
    commit('setLinearLoader', true)
    try {
      const response = await api.addTaskCommentToGql(comment, params)
      const result = response.data.smtasksMutation.addComment
      commit('setLinearLoader', false)

      if (result.success) {
        commit('addComment', comment)
      } else {
        commit('setMessage', {type: 'error', text: 'Не удалось добавить коментарий'})
      }
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: 'Ошибка при добавлении коментария'})
      console.log('', e.message)
    }
  }
}
