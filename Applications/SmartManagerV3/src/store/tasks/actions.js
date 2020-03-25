import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ commit, state }, { folderId, preLoader }) {
    if (folderId === 'search') {
      return
    }
    !preLoader || commit('SET_PRELOADER', 'tasks')
    commit('SET_SEARCH', null)
    commit('SET_CURRENT_FOLDER', folderId)
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
  }
}
