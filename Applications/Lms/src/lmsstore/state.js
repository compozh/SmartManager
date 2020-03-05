import auth from '@it-enterprise/jwtauthentication'

export default {
  user: auth.getUserData(),
  circularLoader: false, // Circular progress component
  error: null,    // SnackBar for errors
  notification: null,
  logoLink: null,
  availableFilters: null,
  recommended: null,    // common object for recommendedCourses & recommendedModules
  courses: null,        // Availabels course
  modules: null,        // Availabels modules
  courseDetails: null,  // Подробная информация о курсе
  currentLessonGuid: '',       // Идентификатор текущего урока
  unit: null,           // Информация об уроке
  lessonContent: null,  // Содержимое урока
  currentTestPage: null, // Текущая страница теста
  currentQuestionsView: null, // Текущее представление секции "Вопросы и ответы"
  discussions: [], // Список вопросов к текущему уроку
  discussionId: null         // идентификатор выбранного пользователем вопроса к уроку
}
