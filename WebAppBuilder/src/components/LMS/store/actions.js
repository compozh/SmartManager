import { LmsApi } from '../api/lmsApi'

const api = new LmsApi()

export default {
  async getAvailableFilters({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getAvailableFiltersFromGql()
      const availableFilters = result.data.lms.availableFilters

      commit('setAvailableFilters', availableFilters)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  }
}