import {SmartManagerApi} from '../api/smartManagerApi'

const api = new SmartManagerApi()

export default {
  setLoading({commit}, payload) {
    commit('setLoading', payload)
  },
  setError({commit}, payload) {
    commit('setError', payload)
  },
  clearError({commit}) {
    commit('clearError');
  },
  async getFolders({commit}) {
    commit('clearError');
    commit('setLoading', true)

    try {
      const result = await api.getFoldersFromGql()
      const folders = result.data.smtasks.folders

      commit('setFolders', folders)
      commit('setLoading', false)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.message)
    }
  },
  async getTasks({commit}, payload) {
    commit('clearError');
    commit('setLoading', true)

    try {
      const result = await api.getTasksFromGql(payload)
      const tasks = {
        [payload]: result.data.smtasks.tasks
      }

      commit('setTasks', tasks)
      commit('setLoading', false)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.message)
    }
  },
  async updateTasks({commit}, payload) {
    commit('clearError');
    commit('setLinear', true)
    
    try {
      const result = await api.getTasksFromGql(payload)
      const tasks = {
        [payload]: result.data.smtasks.tasks
      }
      commit('setTasks', tasks)
      commit('setLinear', false)
    } catch (e) {
      commit('setError', e.message)
    }
  },
  async getTaskInfo({commit}, payload) {
    commit('clearError');
    commit('setLoading', true)

    try {
      const result = await api.getTaskInfoFromGql(payload)
      const taskInfo = result.data.smtasks.tasksGetInfo

      commit('setTaskInfo', taskInfo)
      commit('setLoading', false)
    } catch (e) {
      commit('setLoading', false)
      commit('setError', e.message)
    }
  }
}