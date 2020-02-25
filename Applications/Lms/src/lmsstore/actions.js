import { LmsApi as api } from '../api/lmsApi'
import auth from '@it-enterprise/jwtauthentication'
import { routerDependencies } from '@/router'
const router = routerDependencies.router

export default {
  logout({commit}) {
    auth.clearTokens()
    commit('setUser', null)
    if (router.currentRoute.name !== 'LMSREALHOME') {
      router.push({name: 'LMSREALHOME'})
    }
  },
  async login({commit, state}, {login, password, remember}) {
    if (state.user) {
      console.log('User is logged in')
      await router.push(router.currentRoute.params.routeToBack || {name: 'LMSREALHOME'})
      return
    }
    try {
      const result = await auth.login(login, password, remember)
      if (result.success) {
        commit('setUser', auth.getUserData())
        await router.push({name: 'LMSREALHOME'})
      } else {
        console.log(result.errorMessage)
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  getLogoLink({commit}) {
    commit('setError', null)
    try {
      const result = api.getLogo()
      const link = result
      commit('setLogoLink', link)
    } catch (error) {
      commit('setError', error.message)
      commit('setLogoLink', 'https://m.it.ua/s00/ws/GetFile.ashx?file=itlogo.png&folder=DOCS')
    }
  },
  async getAvailableFilters({commit}) {
    commit('setError', null)
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

  async getCourseDetails({commit}, payload) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getCourseDetailFromGql(payload)
      const courseDetails = result.data.lms.courseDetails
      commit('setCourseDetails', courseDetails)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getLessonContent ({commit}, {lessonGuid, courseGuid}) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.getLessonContentFromGql(lessonGuid, courseGuid, false)
      const unit = result.data.lms.lessonContent
      // const lessonContent = JSON.parse(unit.content)

      commit('setLesson', unit)
      // commit('setContent', lessonContent)
      commit('setCircularLoader', false)

    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async fixLessonPassing ({commit}, payload) {
    commit('setError', null)
    commit('setCirularLoader', true)
    try {
      const result = await api.fixLessonPassingFromGql(payload)
      if (result.success) {
        console.log(`lesson: ${payload} finished!`)
      } else {
        console.log(`lesson: ${payload} not finished! Server answer: ${result.errorMessage}`)
      }
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
      console.log(`lesson: ${payload} not finished! Error: ${error}`)
    }
  }
}
