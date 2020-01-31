
import { ProcessApi } from '../api/processApi'
// eslint-disable-next-line
const api = new ProcessApi()

export default {
  async getForm ({ commit, dispatch }, processDefinitionId) {
    await dispatch('graphqlQueryWraper', {
      action: async () => {
        const processDefinition = await api.getFormFromGql(processDefinitionId)

        commit('setForm', processDefinition.form)
      }
    })
  },

  async startProcess ({ commit, dispatch }, processDefinitionId) {
    await dispatch('graphqlQueryWraper', {
      action: async () => {
        const form = await api.getFormFromGql(processDefinitionId)

        commit('setForm', form.form)
      }
    })
  },

  async graphqlQueryWraper ({ commit, dispatch }, { action }) {
    // commit('closeSnackbar')

    // if (linearLoader) {
    //   commit('setLinearLoader', true)
    // }
    var result
    try {
      result = await action()
    } catch (e) {
      console.log(e.message)
      // if (e.networkError && e.networkError.statusCode == 401) {
      //   await dispatch('auth/logout', null, { root: true })
      // }
      // else {
      //   commit('setSnackbarErrorMessage', e.message)
      // }
    }
    // if (linearLoader) {
    //   commit('setLinearLoader', false)
    // }
    return result
  }
}
