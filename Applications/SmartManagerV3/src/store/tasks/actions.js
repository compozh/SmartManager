import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ commit, state }, { folderId, preLoader }) {
    if (folderId === 'search') {
      return
    }
    !preLoader || commit('SET_PRELOADER', 'tasks')
    commit('SET_SEARCH', null)
    commit('SET_ACTIVE_FOLDER', { folderId, source: 'action' })
    try {
      const result = await api.getTasksFromGql({
        folderId: folderId === 'active' ? '' : folderId,
        helperExec: state.helperExec
      })
      const taskList = result.data.smtasks.tasks
      const tasks = { [folderId]: taskList }
      commit('SET_TASKS', tasks)
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.taskListError'),
        color: 'error'
      })
    }
    !preLoader || commit('SET_PRELOADER', 'tasks')
  },
  async getTaskDetails ({ commit }, { taskId, preLoader }) {
    !preLoader || commit('SET_PRELOADER', 'task')
    try {
      const result = await api.getTaskDetailsFromGql(taskId)
      const taskDetails = result.data.smtasks.taskDetails
      commit('SET_TASK_DETAILS', { [taskId]: taskDetails })
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.taskError'),
        color: 'error'
      })
    }
    !preLoader || commit('SET_PRELOADER', 'task')
  },
  async addComment ({ dispatch, commit }, { comment, params }) {
    const paramsJson = JSON.stringify(params)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      if (result.success) {
        await dispatch('updateInfo', {
          type: params.type,
          id: params.id,
          loading: true
        })
      } else {
        commit('SET_NOTIFY', {
          text: i18n.t('notify.commentAddFail'),
          color: 'error'
        })
      }
      return result
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.commentAddError'),
        color: 'error'
      })
    }
  },
  updateInfo ({ dispatch }, { type, id, loading }) {
    if (type === 'TASK' || type === 'DOCUMENT') {
      return dispatch('getTaskDetails', {
        taskId: id,
        loading
      })
    }
    if (type === 'CASE') {
      return dispatch('getCaseDetails', {
        caseId: id,
        loading: true
      })
    }
  }
}
