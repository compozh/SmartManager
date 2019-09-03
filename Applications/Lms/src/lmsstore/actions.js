import { LmsApi } from '../api/lmsApi'

const api = new LmsApi()

export default {
  async getAvailableFilters({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getAvailableFiltersFromGql()
      const filters = result.data.lms.availableFilters

      var availableFilters = [
        {
          name: 'Роль',
          items: filters.roles
        },
        {
          name: 'Уровень',
          items: filters.levels
        },
        {
          name: 'Продукт',
          items: filters.products
        },
        {
          name: 'Тэг',
          items: filters.tags
        }
      ]

      commit('setAvailableFilters', availableFilters)
      commit('setCircularLoader', false)

    } catch (e) {
      commit('setCircularLoader', false)
      commit('setError', e.message)
    }
  }
}
