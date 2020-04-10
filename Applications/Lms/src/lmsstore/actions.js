import { LmsApi as api } from '../api/lmsApi'
import auth from '@it-enterprise/jwtauthentication'
import { routerDependencies } from '@/router'
import { addStyles } from '../helpers/coursesModules'
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

    } catch (error) {
      commit('setError', error.message)
    }
  },

  async getRecommended({commit}) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.getRecommendedFromGql()
      const recommended = result.data.lms.recommended
      recommended.courses.forEach(c => addStyles(c))
      recommended.modules.forEach(m => addStyles(m))
      commit('setCourses', recommended.courses)
      commit('setModules', recommended.modules)
      commit('setRecommended', true)
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

  async getCourseDetails({commit}, courseGuid) {
    commit('setError', null)
    commit('setCircularLoader', true)

    try {
      const result = await api.getCourseDetailFromGql(courseGuid)
      const courseDetails = result.data.lms.courseDetails
      addStyles(courseDetails.course)
      commit('setCourseDetails', courseDetails)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getLessonContent ({commit}, lessonGuid) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.getLessonContentFromGql(lessonGuid, false)
      const unit = result.data.lms.lessonContent
      commit('setLesson', unit)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async getDiscussionList({commit}, lessonGuid) {
    commit('setError', null)
    commit('setQuestionCircularLoader', true)
    try {
      const result = await api.fetchQuestionsListCurrentLessonFromGql(lessonGuid)
      // преобразовать дату
      result.data.lms.discussions.forEach(d => d.dateTime = new Date(d.dateTime).toLocaleString())
      commit('setDiscussions', result.data.lms.discussions)
      commit('setQuestionCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setQuestionCircularLoader', false)
    }
  },

  async fixCourseStart({commit}, courseGuid) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.fixCourseStartFromGql(courseGuid)
      const message = result.data.lmsMutation.fixLessonPassing.success ?
        result.data.lmsMutation.fixLessonPassing.successMessage : result.data.lmsMutation.fixLessonPassing.errorMessage
      commit('setNotification', message)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async saveLessonPageState({commit},courseGuid, pageState) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.savePageStateFromGql(courseGuid, pageState)
      const message = result.data.lmsMutation.saveLessonPageState.success ?
        result.data.lmsMutation.saveLessonPageState.successMessage : result.data.lmsMutation.saveLessonPageState.errorMessage
      commit('setNotification', message)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  },

  async restoreCourseLearningPageState({commit}, courseGuid) {
    try {
      const result = await api.restorePageStateFromGql(courseGuid)
      const pageStateParams = result ? JSON.parse(result) : null
      if (pageStateParams) {
        commit('setCurrentLessonGuid',pageStateParams.currentLessonGuid)
        commit('setTabActive', pageStateParams.activeTab)
      }
    } catch (error) {
      commit('setError', error.message)
    }
  },

  async fixLessonPassing({commit}, {courseGuid, lessonGuid}) {
    commit('setError', null)
    commit('setCircularLoader', true)
    try {
      const result = await api.fixLessonPassingFromGql(courseGuid, lessonGuid)
      const message = result.data.lmsMutation.fixLessonPassing.success ?
        result.data.lmsMutation.fixLessonPassing.successMessage : result.data.lmsMutation.fixLessonPassing.errorMessage
      commit('setNotification', message)
      commit('setCircularLoader', false)
    } catch (error) {
      commit('setError', error.message)
      commit('setCircularLoader', false)
    }
  }
}
