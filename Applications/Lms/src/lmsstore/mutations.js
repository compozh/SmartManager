export default {

  setCircularLoader (state, payload ) {
    state.loading = payload
  },
  setError (state, payload ) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  },
  setAvailableFilters (state, payload ) {
    state.availableFilters = payload
  },

  setRecommended (state, payload) {
    state.recommended = payload
  },

  setCourses (state, payload) {
    state.courses = payload
  },

  setModules (state, payload) {
    state.modules = payload
  },

  setCourseDetails (state, payload) {
    state.courseDetails = payload
  },

  setLessonContent (state, payload) {
    state.lessonContent = payload
  }
}
