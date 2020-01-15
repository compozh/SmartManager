import { FormioApi } from '../api/formioApi'

const api = new FormioApi()
/* eslint-disable */
export default {
  async initializeTicket({ commit }) {
    const result = await api.getTicketFromGql()
    commit('setTicket', result)
  },
  async getForm({ dispatch }, { formCode, properties, fetchPolicy, deviceSizeType }) {
    deviceSizeType = deviceSizeType || 'lg'
    var params = { params: JSON.stringify(properties || '', null, 4), deviceSizeType }
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getFormGql(formCode, params, fetchPolicy)
      }
    })
  },
  async callFormCustomEvent({ dispatch }, { formCode, params }) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callFormCustomEventGql(formCode, params)
      }
    })
  },
  async callItemAutocomplete({ dispatch }, { formCode, params, fetchPolicy }) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callItemAutocompleteGql(formCode, params, fetchPolicy)
      }
    })
  },
  async createForm({ dispatch }, formDefinition) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.createFormGql(formDefinition)
      }
    })
  },
  async saveForm({ dispatch }, formDefinition) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.saveFormGql(formDefinition)
      }
    })
  },
  async submitForm({ dispatch }, { formCode, submission, properties, deviceSizeType }) {
    var params = { 
      submission,
      params: JSON.stringify(properties || '', null, 4),
      deviceSizeType: deviceSizeType || 'lg' 
     }
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.submitFormGql(formCode, params)
      }
    })
  },
  async graphqlQueryWithRequestResultWraper({ commit, dispatch }, { queryAction }) {
    commit('closeSnackbar')
    var result
    try {
      result = await queryAction()
      if (result.success == true) {
        if (result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage)
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage)
      }
      return result
    } catch (e) {
      if (e.networkError && e.networkError.statusCode === 401) {
        await dispatch('auth/logout')
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    return result
  }
}
