import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getFolders ({ state, commit }) {
    const preLoader = 'folderGroups' in state
    preLoader || commit('START_PRELOADER', 'folders')
    commit('START_LINEAR_PRELOADER', 'folders')
    try {
      const response = await api.getFoldersFromGql()
      const result = response.data.smtasks.folders
      const folders = JSON.parse(result)
      // Supplement task folders
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
      // Supplement case folders
      folders.caseFolders = folders.caseFolders.map(folder => {
        if (folder.Code === 'cases') {
          folder.Code = 'all'
          folder.Parent = ''
        } else {
          folder.Code = folder.FolderId
          folder.Parent = 'all'
        }
        return folder
      })
      commit('SET_FOLDERS', folders)
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.foldersError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'folders')
      commit('STOP_LINEAR_PRELOADER', 'folders')
    }
  }
}
