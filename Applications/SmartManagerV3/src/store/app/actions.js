import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getApplicationParams ({ commit }) {
    commit('SET_PRELOADER', true)
    try {
      const response = await api.getApplicationParamsFromGql()
      const result = response.data.smtasks.applicationParams
      commit('SET_APPLICATIONS_PARAMS', result)
    } catch (e) {
      console.error(e.message)
    }
    commit('SET_PRELOADER', false)
  },
  async getFolders ({ commit }, preLoader) {
    commit('SET_PRELOADER', preLoader)
    try {
      const response = await api.getFoldersFromGql()
      const result = response.data.smtasks.folders
      const folders = result.map(folder => {
        if (folder.code === '') {
          folder.code = 'active'
          folder.name = i18n.t('folders.active')
        }
        return folder
      })
      commit('SET_FOLDERS', folders)
    } catch (e) {
      console.log(e.message)
      commit('SET_NOTIFY', {
        text: i18n.t('login.foldersError'),
        color: 'error'
      })
    }
    commit('SET_PRELOADER', false)
  }
}
