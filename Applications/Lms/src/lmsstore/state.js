import auth from '@it-enterprise/jwtauthentication'

export default {
  user: auth.getUserData(),
  circularLoader: false, // Circular progress component
  error: null,    // SnackBar for errors
  logoLink: null,
  availableFilters: null,
  recommended: null,    // common object for recommendedCourses & recommendedModules
  courses: null,        // Availabels course
  modules: null,        // Availabels modules
  courseDetails: null,  // Подробная информация о курсе
  unit: null,           // Информация об уроке
  lessonContent: null,  // Содержимое урока
  currentTestPage: null // Текущая страница теста
}
