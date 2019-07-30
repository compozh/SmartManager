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
    commit('setCircularLoader', true)

    try {
      const result = await api.getTaskInfoFromGql(payload)
      const taskInfo = result.data.smtasks.tasksGetInfo
      commit('setTaskInfo', taskInfo)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
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
      const result = await api.addNewTaskToGql(payload)
      const success = result.data.smtasksMutation.addTask.success

      const message = success
      ? {type: 'success', text: `Задача успешно добавлена`}
      : {type: 'error', text: `Ошибка при добавлении задачи`}

      commit('setMessage', message)
      commit('setCircularLoader', false)
      commit('setTaskAddForm', 'close')
      dispatch('getFolders', {loader: 'setLinearLoader'})
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setMessage', {type: 'error', text: e.message})
    }
  }
}