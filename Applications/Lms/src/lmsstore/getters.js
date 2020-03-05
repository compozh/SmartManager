export default {
  user(state) {
    return state.user
  },

  circularLoader (state) {
    return state.circularLoader
  },

  error (state) {
    return state.error
  },

  logoLink (state) {
    return state.logoLink
  },

  availableFilters (state) {
    return state.availableFilters
  },

  recommended (state) {
    return state.recommended
  },

  courses (state) {
    return state.courses
  },

  modules (state) {
    return state.modules
  },

  courseDetails (state) {
    return state.courseDetails
  },

  currentLessonGuid (state) {
    return state.currentLessonGuid
  },

  unit(state) {
    return state.unit
  },

  lessonContent(state) {
    return state.lessonContent
  },

  currentTestPage(state) {
    return state.currentTestPage
  },

  currentQuestionsView(state) {
    return state.currentQuestionsView
  },

  discussions (state) {
    return state.discussions
  },
  discussionId (state) {
    return state.discussionId
  }
}
