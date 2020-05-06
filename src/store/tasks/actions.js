import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ state, commit, rootState }, folderId) {
    if (folderId === 'search') {
      return
    }
    commit('SET_LINEAR_PRELOADER', true)
    const preLoader = (state.tasks && state.tasks[folderId])
    preLoader || commit('START_PRELOADER', 'tasks')
    commit('SET_SEARCH', null)
    commit('SET_ACTIVE_FOLDER', { folderId, source: 'action' })
    try {
      const result = await api.getTasksFromGql({
        folderId: folderId === 'active' ? '' : folderId,
        helperExec: rootState.helperExec
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
    } finally {
      commit('SET_LINEAR_PRELOADER', false)
      commit('STOP_PRELOADER', 'tasks')
    }
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
    } finally {
      commit('STOP_PRELOADER', 'task')
    }
  },
  async addComment ({ dispatch, commit }, { comment, params }) {
    const paramsJson = JSON.stringify(params)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      if (result.success) {
        await dispatch('getTaskDetails', {
          taskId: params.id,
          preLoader: true
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
    const statusParams = JSON.stringify(params)
    commit('START_PRELOADER', 'status')
    try {
      const response = await api.changeTaskStatusInGql(statusParams)
      const result = response.data.smtasksMutation.changeStatus
      if (result.success) {
        await dispatch('getTaskDetails', {
          taskId: params.id,
          preLoader: true
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
  },
  async changeStage ({ dispatch, commit }, params) {
    const stageParams = JSON.stringify(params)
    commit('START_PRELOADER', 'stage')
    try {
      const response = await api.changeTaskStageInGql(stageParams)
      const result = response.data.smtasksMutation.changeStage
      if (result.success) {
        await dispatch('getTaskDetails', {
          taskId: params.id,
          preLoader: true
        })
        commit('SET_NOTIFY', {
          text: result.log || i18n.t('notify.stageChangeSuccess'),
          color: 'success'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.log || i18n.t('notify.stageChangeFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.stageChangeError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'stage')
    }
  },
  async taskDelete ({ dispatch, commit, state }, taskId) {
    commit('START_PRELOADER', 'delete')
    try {
      const response = await api.taskDeleteInGql(taskId)
      const result = response.data.smtasksMutation.taskDelete
      if (result.success) {
        // If deleted task has parent - update parent
        const parentId = state.taskDetails[taskId].parentTask.id
        if (parentId) {
          await dispatch('getTaskDetails', { taskId })
        }
        // If deleted task bind to case - update case
        const caseId = state.taskDetails[taskId].caseId
        if (caseId) {
          await dispatch('getCaseDetails', { caseId })
        }
        // TODO: If deleted task has child tasks - update child tasks
        commit('SET_NOTIFY', {
          text: result.successMessage || i18n.t('notify.taskDelSuccess'),
          color: 'success'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.taskDelFail'),
          color: 'warning'
        })
      }
      return result.success
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.taskDelError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'delete')
    }
  },
  async taskPin ({ dispatch, commit }, { taskId, pin }) {
    commit('START_PRELOADER', 'pin')
    try {
      const response = await api.taskPinInGql(taskId, pin)
      const result = response.data.smtasksMutation.taskPin
      if (result.success) {
        await dispatch('getTaskDetails', { taskId, preLoader: true })
        commit('SET_NOTIFY', {
          text: result.successMessages ||
            pin ? i18n.t('notify.taskPinedSuccess') : i18n.t('notify.taskUnPinedSuccess'),
          color: pin ? 'success' : 'info'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessage || i18n.t('notify.taskPinFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.taskPinError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'pin')
    }
  },
  async createTask ({ dispatch, commit }, newTask) {
    const taskParams = JSON.stringify(newTask)
    commit('START_PRELOADER', 'createTask')
    try {
      const response = await api.addNewTaskToGql(taskParams)
      const result = response.data.smtasksMutation.addTask
      commit('STOP_PRELOADER', 'createTask')
      if (result.success) {
        await dispatch('getFolders')
        commit('SET_NOTIFY', {
          text: result.successMessages || i18n.t('notify.taskAddSuccess'),
          color: 'success'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessages || i18n.t('notify.taskAddFail'),
          color: 'warning'
        })
      }
      return result
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.taskAddError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'createTask')
    }
  }
}
