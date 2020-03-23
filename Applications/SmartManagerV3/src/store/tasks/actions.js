import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getTasks ({ commit, state }, { folderId, loader }) {
    if (folderId === 'search') {
      return
    }
    // const loading = loader || !state.tasks[folderId]
    // !loading || startLoading()
    commit('SET_SEARCH', null)
    commit('SET_CURRENT_FOLDER', folderId)
    try {
      const result = await api.getTasksFromGql({
        folderId: folderId === 'active' ? '' : folderId,
        helperexec: state.helperexec
      })
      const taskList = result.data.smtasks.tasks
      const tasks = { [folderId]: taskList }
      commit('SET_TASKS', tasks)
      // !loading || stopLoading()
    } catch (e) {
      // stopLoading()
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.taskListError'),
        color: 'error'
      })
    }
  }
}
