import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ commit, state }, { folderId, preLoader }) {
    if (folderId === 'search') {
      return
    }
    !preLoader || commit('START_PRELOADER', 'tasks')
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
    commit('STOP_PRELOADER', 'tasks')
  },
  async getTaskDetails ({ commit }, { taskId, preLoader }) {
    !preLoader || commit('START_PRELOADER', 'task')
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
    commit('STOP_PRELOADER', 'task')
  },
  async addComment ({ dispatch, commit }, { comment, params }) {
    const paramsJson = JSON.stringify(params)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      if (result.success) {
        await dispatch('getTaskDetails', {
          taskId: params.id,
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
  async changeTaskStatus ({ dispatch, commit }, params) {
    const paramsJson = JSON.stringify(params)
    commit('START_PRELOADER', 'status')
    try {
      const response = await api.changeTaskStatusInGql(paramsJson)
      const result = response.data.smtasksMutation.changeStatus
      if (result.success) {
        await dispatch('getTaskDetails', {
          id: params.id,
          loading: true
        })
        commit('SET_NOTIFY', {
          text: result.successMessage || i18n.t('notify.statChangeSuccess'),
          color: 'success'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.statChangeFail'),
          color: 'warning'
        })
      }
      return result.success
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.statChangeError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'status')
    }
  }
}
