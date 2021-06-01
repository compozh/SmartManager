import { SmartManagerApi as api } from '@/api/smartManagerApi'
import i18n from '@/i18n'

export default {
  async getProcesses ({ commit }) {
    try {
      const result = await api.getBusinessProcessesFromGql()
      const processes = result.data.workFlowQuery.businessProcesses
      commit('SET_PROCESSES', processes)
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.bpError'),
        color: 'error'
      })
    }
  },
  async getFormDefinition ({ commit }, procDefId) {
    commit('START_PRELOADER', 'formDefinition')
    try {
      const response = await api.getFormDefinitionFromGql(procDefId)
      const result = response.data.workFlowQuery.formDefinition
      if (result.success) {
        return result
      }
      commit('SET_NOTIFY', {
        text: result.errorMessage || i18n.t('notify.bpError'),
        color: 'warning'
      })
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: i18n.t('notify.bpError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'formDefinition')
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
      return startedProcess
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.bpError'),
        color: 'error'
      })
    } finally {
      commit('STOP_PRELOADER', 'process')
    }
  },
  async getExternalTaskInfo ({ commit }, externalId) {
    try {
      const response = await api.getExternalTaskInfo(externalId)
      return response.data.workFlowQuery.externalTaskInfo
    } catch (error) {
      console.error(error.message || error)
      commit('SET_NOTIFY', {
        text: error.message || i18n.t('notify.taskError'),
        color: 'error'
      })
    }
  }
}
