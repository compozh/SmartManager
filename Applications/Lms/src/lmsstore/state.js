import auth from '@it-enterprise/jwtauthentication'

export default {
  user: auth.getUserData(),
  circularLoader: false, // Circular progress component
  error: null,           // SnackBar for errors
  notification: null,
  logoLink: null,
  availableFilters: null,
  links: [],            // ссылки для навигации
  recommended: false,    // common object for recommendedCourses & recommendedModules
  courses: null,        // Availabels course
  modules: null,              // Availabels modules
  currentCourseGuid: null,    // текущий курс на странице "CourseDetails" и "CourseLearning"
  courseDetails: null,        // Подробная информация о курсе
  coursesDetails: {},         // кеш для courseDetails
  currentLessonGuid: '',      // Идентификатор текущего урока
  unit: null,                 // Информация об уроке
  lessonContent: null,        // Содержимое урока
  currentQuestionsView: null, // Текущее представление секции "Вопросы и ответы"
  discussions: [],            // Список вопросов к текущему уроку
  discussionId: null,          // идентификатор выбранного пользователем вопроса к уроку
  questionCircularLoader: false, // прогресс загрузки дискуссий
  // тест
  currentTestPage: null,      // Текущая страница теста
  currentTestId: 0,           // Текущий тест. Id
  currentTestIndex: -1,       // Текущий тест. Индекс в кеше
  errorMessage: null,         // сообщение об ошибке во время прохождения теста
  tests: [],                  // Тесты курса. Кеш
  /// TODO: удалить после реализации кеширования
  test: {                     // Тест:
    commonInfo: null,         //      общая информация (id теста, id респондента, назавание, описание, тип, язык)
    titleColors: null,        //      цвет фона и текста названия теста
    data: null                //      данные: показатели (формы, группы, лимит времени), вопросы
  }
}
