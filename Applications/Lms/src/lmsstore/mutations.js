export default {
  setUser(state, user) {
    state.user = user
  },
  setCircularLoader (state, payload ) {
    state.loading = payload
  },
  setError (state, payload ) {
    state.error = payload
  },
  clearError (state) {
    state.error = null
  },
  setLogoLink (state, payload) {
    state.logoLink = payload
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

  setLesson (state, payload) {
    state.unit = payload
  },

  setCurrentLessonGuid(state, payload) {
    state.currentLessonGuid = payload
  },

  setContent (state, payload) {
    state.lessonContent = payload
  },

  setNotification (state, payload) {
    state.notification = payload
  },

  setCurrentTestPage(state, payload) {
    state.currentTestPage = payload
  },

  setQuestionsView(state, payload) {
    state.currentQuestionsView = payload
  },
  setDiscussions(state, payload) {
    state.discussions = payload
  },
  setDiscussionId(state, payload) {
    state.discussionId = payload
  },
  addDiscussion(state, payload) {
    state.discussions.push(payload)
  }
}
