import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getFolders ({ commit }, preLoader) {
    !preLoader || commit('START_PRELOADER', 'folders')
    try {
      const response = await api.getFoldersFromGql()
      const result = response.data.smtasks.folders
      const folders = JSON.parse(result)
      // Change active folder code and name
      folders.taskFolders = folders.taskFolders.map(folder => {
        if (folder.Code === '') {
          folder.Code = 'active'
          folder.Parent = ''
          folder.Name = i18n.t('folders.active')
        } else {
          folder.Parent = 'active'
        }
        return folder
      })
      commit('SET_FOLDERS', folders)
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.foldersError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'folders')
    }
  }
}
