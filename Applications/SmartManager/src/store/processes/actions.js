import { SmartManagerApi as api } from '@/api/smartManagerApi'

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
  async startProcess ({ dispatch }, params) {
    try {
      const startProcessResult = await api.startProcessGql(params)
      return startProcessResult
    } catch (e) {
      console.error(e.message)
    }
  }
}
