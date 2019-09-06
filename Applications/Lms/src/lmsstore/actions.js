import { LmsApi } from '../api/lmsApi'
import { tryFunctionOrLogError } from 'apollo-utilities';

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

    } catch (error) {
      commit('setCircularLoader', false)
      commit('setError', error.message)
    }
  },

  async getRecommended({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.getRecommendedFromGql()
      const recommended = result.data.lms.recommended

      commit('setRecommended', recommended)
      commit('setCircularLoader', false)

    } catch (error) {
      commit('setCircularLoader', false)
      commit('setError', error.message)
    }
  },

  async getCourses({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getCoursesFromGql()
      const courses = result.data.lms.courses

      commit('setCourses', courses)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getModules ({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getModulesFromGql()
      const modules = result.data.lms.modules

      commit('setModules', modules)
      commit('setCircularLoader', false)

    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getCourseDetails(courseid) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getCourseDetailFromGql(courseid)
      const courseDetails = result.data.lms.courseDetail

      commit('setCourseDetails', courseDetails)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getLessonContent (lessonid) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getLessonContentFromGql(lessonid)
      const lessonContent = result.data.lms.lessonContent

      commit('setLessonContent', lessonContent)
      commit('setCircularLoader', false)

    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  }
}
