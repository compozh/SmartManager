
import { ProcessesApi } from '../api/processesApi'

const api = new ProcessesApi()

export default {
  async getProcesses ({ commit, dispatch }) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let processes = await api.getProcessesFromGql()
        return processes
      }
    })

    return result
  },

  async getForm ({ dispatch }, processDefinitionId) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let processDefinition = await api.getFormFromGql(processDefinitionId)
        return processDefinition
      }
    })

    return result
  },

  async startProcess ({ commit, dispatch }, params) {
    let result = await dispatch('graphqlQueryWraper', {
      action: async () => {
        let startProcessResult = await api.startProcessGql(params)
        return startProcessResult
      }
    })

    return result
  },

  async graphqlQueryWraper ({ commit, dispatch }, { action }) {
    // commit('closeSnackbar')

    var result
    try {
      result = await action()
    } catch (e) {
      console.log(e.message)
      // commit('setSnackbarErrorMessage', e.message)
    }
    return result
  }
}
