import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getProcesses ({ commit }) {
    try {
      const processes = await api.getProcessesFromGql()
      commit('SET_PROCESSES', processes.processes)
    } catch (e) {
      console.error(e.message)
    }
  },
  async getForm ({ dispatch }, processDefinitionId) {
    try {
      const processDefinition = await api.getFormFromGql(processDefinitionId)
      return processDefinition
    } catch (e) {
      console.error(e.message)
    }
  },
  async startProcess ({ dispatch, commit }, data) {
    const processData = JSON.stringify(data)
    commit('START_PRELOADER', 'process')
    try {
      const response = await api.startProcessInGql(processData)
      const result = response.data.workFlowQuery.startBusinessProcess
      const startedProcess = JSON.parse(result)
      if (startedProcess.ProcessInstance) {
        commit('SET_NOTIFY', {
          text: i18n.t('notify.bpSuccess'),
          color: 'success'
        })
      }
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.bpError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'process')
    }
  }
}
