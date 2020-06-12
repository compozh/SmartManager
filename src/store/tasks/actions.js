import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ state, commit, rootState }, folderId) {
    if (folderId === 'search') {
      return
    }
    const preLoader = (state.tasks && state.tasks[folderId])
    preLoader || commit('START_PRELOADER', 'tasks')
    commit('START_LINEAR_PRELOADER', 'tasks')
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
      commit('STOP_PRELOADER', 'tasks')
      commit('STOP_LINEAR_PRELOADER', 'tasks')
    }
  },
  async getTaskDetails ({ state, commit }, { taskId }) {
    const preLoader = (state.task && state.taskDetails[taskId])
    preLoader || commit('START_PRELOADER', 'task')
    commit('START_LINEAR_PRELOADER', 'task')
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
      commit('STOP_LINEAR_PRELOADER', 'task')
    }
  },
  async addComment ({ dispatch, commit }, { comment, params }) {
    const paramsJson = JSON.stringify(params)
    try {
      const response = await api.addCommentToGql(comment, paramsJson)
      const result = response.data.smtasksMutation.addComment
      if (result.success) {
        await dispatch('getTaskDetails', { taskId: params.id })
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
  async changeTaskStatus ({ dispatch, commit, rootState }, params) {
    const statusParams = JSON.stringify(params)
    commit('START_PRELOADER', 'status')
    try {
      const response = await api.changeTaskStatusInGql(statusParams)
      const result = response.data.smtasksMutation.changeStatus
      if (result.success) {
        commit('SET_NOTIFY', {
          text: result.successMessage || i18n.t('notify.statChangeSuccess'),
          color: 'success'
        })
        await dispatch('getTasks', rootState.folders.activeFolderId)
        await dispatch('getTaskDetails', { taskId: params.id })
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
        await dispatch('getTaskDetails', { taskId: params.id })
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
    commit('START_LINEAR_PRELOADER', 'pin')
    try {
      const response = await api.taskPinInGql(taskId, pin)
      const result = response.data.smtasksMutation.taskPin
      if (result.success) {
        await dispatch('getTaskDetails', { taskId })
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
      commit('STOP_LINEAR_PRELOADER', 'pin')
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
      !newTask.parentId || await dispatch('getTaskDetails', {
        taskId: newTask.parentId
      })
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
  },
  async updateTask ({ dispatch, commit }, taskData) {
    const taskDataJson = JSON.stringify(taskData)
    commit('START_PRELOADER', 'updateTask')
    try {
      const response = await api.updateTaskInGql(taskDataJson)
      const result = response.data.smtasksMutation.taskUpdating
      if (result.success) {
        await dispatch('getTaskDetails', { taskId: taskData.id })
        commit('SET_NOTIFY', {
          text: result.successMessages || i18n.t('notify.updateSuccess'),
          color: 'success'
        })
      } else {
        commit('SET_NOTIFY', {
          text: result.errorMessages || i18n.t('notify.updateFail'),
          color: 'warning'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.updateError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'updateTask')
    }
  }
}
