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

  links(state) {
    return state.links
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

  moduleDetails: state => moduleGuid => {
    return state.modules.find(m => m.moduleGuid === moduleGuid)
  },

  coursesDetails(state) {
    return state.coursesDetails
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

  questionCircularLoader(state) {
    return state.questionCircularLoader
  },

  discussions (state) {
    return state.discussions
  },
  discussionId (state) {
    return state.discussionId
  },

  // Тест
  testCommonInfo(state) {
    return state.test.commonInfo
  },

  errorMessage(state) {
    return state.errorMessage
  },

  testTitleColors(state) {
    return state.test.titleColors
  }
}
