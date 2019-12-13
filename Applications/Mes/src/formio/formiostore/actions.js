import { FormioApi } from '../api/formioApi'
import Vue from 'vue'
import  { routerDependencies } from '../../router'

const api = new FormioApi()
/* eslint-disable */
export default {
  async initializeTicket({ commit }) {
        const result = await api.getTicketFromGql()
        commit('setTicket', result)
  },
  async getForm({ dispatch }, { formCode, properties, fetchPolicy }) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getFormGql(formCode, JSON.stringify(properties || '', null, 4), fetchPolicy)
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
  async submitForm({ dispatch }, { formCode, submission, properties }) {
    return await dispatch('graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.submitFormGql(formCode, submission, JSON.stringify(properties || '', null, 4))
      }
    })
  },
  async graphqlQueryWithRequestResultWraper({ commit }, { queryAction }) {
    commit('closeSnackbar')
    try {
      let result = await queryAction()
      if (result.success == true) {
        if (result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage)
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage)
      }
      return result
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    return false
  }
}
