import { FormioApi } from '../api/formioApi'
import Vue from 'vue'
import  { routerDependencies } from '../../router'

const api = new FormioApi()
/* eslint-disable */
export default {
  async initializeTicket({commit}) {
    await this.dispatch('formio/graphqlQueryWraper', {
      action: async () => {
        const result = await api.getTicketFromGql()
        commit('setTicket', result)
      }
    })
  },
  async graphqlQueryWraper({ commit }, { action, linearLoader }) {
    commit('closeSnackbar')

    if (linearLoader) {
      commit('setLinearLoader', true)
    }
    var result;
    try {
      result = await action()
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
    return result
  },
  async getForm({ commit }, { formCode, properties, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.getFormGql(formCode, properties)
      },
      successAction: async result => { if(callback) callback(result) }
    })
  },
  async callFormCustomEvent({ commit }, { formCode, params, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callFormCustomEventGql(formCode, params)
      },
      successAction: async result => { if(callback) callback(result) }
    })
  },
  async callItemAutocomplete({ commit }, { formCode, params, fetchPolicy, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.callItemAutocompleteGql(formCode, params, fetchPolicy)
      },
      actionAfterQuery: async result => { if(callback) callback(result) }
    })
  },
  async createForm({ commit }, { formDefinition, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.createFormGql(formDefinition)
      },
      successAction: async result => { if(callback) callback(result) }
    })
  },
  async saveForm({ commit }, { formDefinition, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.saveFormGql(formDefinition)
      },
      successAction: async result => { if(callback) callback(result) }
    })
  },
  async submitForm({ commit }, { formCode, submission, properties, callback }) {
    return await this.dispatch('formio/graphqlQueryWithRequestResultWraper', {
      queryAction: async () => {
        return await api.submitFormGql(formCode, submission, properties)
      },
      successAction: async result => { if(callback) callback(result) }
    })
  },
  async graphqlQueryWithRequestResultWraper({ commit }, { queryAction, successAction, linearLoader, actionAfterQuery }) {
    commit('closeSnackbar')

    if (linearLoader) {
      commit('setLinearLoader', true)
    }

    try {
      let result = await queryAction()
      if (result.success == true) {
        if (successAction) {
          await successAction(result)
        }
        if (result.successMessage) {
          commit('setSnackbarSuccessMessage', result.successMessage)
        }
      } else {
        commit('setSnackbarErrorMessage', result.errorMessage)
      }
      if(actionAfterQuery) {
        actionAfterQuery(result)
      }
    } catch (e) {
      if (e.networkError && e.networkError.statusCode == 401) {
        Vue.prototype.$authentication.resetCurentUser()
        routerDependencies.router.push({name: 'LOGIN'})
      }
      else {
        commit('setSnackbarErrorMessage', e.message)
      }
    }
    if (linearLoader) {
      commit('setLinearLoader', false)
    }
  }
}
