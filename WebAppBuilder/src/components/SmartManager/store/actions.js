import {SmartManagerApi} from '../api/smartManagerApi'

const api = new SmartManagerApi()

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
        // Изменения в веб-расчете: для получения всех задач необходимо передать пустую строку
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
      const taskInfo = result.data.smtasks.tasksGetInfo
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

      const message = result.success
      ? {type: 'success', text: `Задача успешно добавлена`}
      : {type: 'error', text: `Не удалось добавить задачу`}
      // дополнительно можно вывести result.errorMessage
      commit('setMessage', message)
      commit('setCircularLoader', false)
      commit('setTaskAddForm', 'close')
      dispatch('getFolders', {loader: 'setLinearLoader'})
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  },
  async changeTaskStatus({commit, dispatch}, payload) {
    commit('setLinearLoader', true)

    try {
      await api.changeTaskStatusInGql(payload)
      commit('setLinearLoader', false)

      dispatch('getTaskInfo', {
        taskId: payload.id,
        loader: 'setLinearLoader'
      })
    } catch (e) {
      commit('setLinearLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  }
}
