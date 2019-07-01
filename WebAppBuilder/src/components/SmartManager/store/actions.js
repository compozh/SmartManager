import {SmartManagerApi} from '../api/smartManagerApi'

const api = new SmartManagerApi()

export default {
  async getFolders({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getFoldersFromGql()
      const folders = result.data.smtasks.folders

      commit('setFolders', folders)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  },
  async getTasks({commit}, payload) {
    const folderId = payload.folderId
    const loader = payload.loader

    commit('setError', null)
    commit(loader, true)

    try {
      const result = await api.getTasksFromGql(folderId)
      const tasks = {
        [folderId]: result.data.smtasks.tasks
      }
      commit('setTasks', tasks)
      commit(loader, false)

    } catch (e) {
      commit(loader, false)
      commit('setError', e.message)
    }
  },
  async getTaskInfo({commit}, payload) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getTaskInfoFromGql(payload)
      const taskInfo = result.data.smtasks.tasksGetInfo

      commit('setTaskInfo', taskInfo)
      commit('setCircularLoader', false)
    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  }
}