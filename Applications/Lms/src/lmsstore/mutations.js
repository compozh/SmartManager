export default {
  setUser(state, user) {
    state.user = user
  },
  setCircularLoader (state, payload ) {
    state.circularLoader = payload
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

  setLinks(state, payload) {
    state.links = payload
  },

  addRouteToLinks(state, payload) {
    state.links.push(payload)
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

  setCurrentCourseGuid(state, payload) {
    state.currentCourseGuid = payload
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

  setTabActive(state, payload) {
    state.tabActive = payload
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
  setQuestionCircularLoader(state, payload) {
    state.questionCircularLoader = payload
  },

  setDiscussions(state, payload) {
    state.discussions = payload
  },
  setDiscussionId(state, payload) {
    state.discussionId = payload
  },
  addDiscussion(state, payload) {
    state.discussions.push(payload)
  },

  setDiscussion(state, payload) {
    state.discussion = payload
  },

  socialChange(state, payload) {
    if (payload > 0) {
      state.discussion.voutsUpQty += payload
    } else {
      state.discussion.voutsDownQty -= payload
    }
  },

  // Тест
  setTestInfo(state, payload) {
    state.test.commonInfo = payload
  },

  setErrorMessage(state, payload) {
    state.errorMessage = payload
  },

  setTestAttemptId(state, payload) {
    state.test.attemptId = payload
  }
}
