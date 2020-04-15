import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'
// Queries
import recommended from './graphql/recommended.graphql'
import courses from './graphql/courses.graphql'
import modules from './graphql/modules.graphql'
import availableFilters from './graphql/availableFilters.graphql'
import courseDetails from './graphql/courseDetails.graphql'
import lessonContent from './graphql/lessonContent.graphql'
import finishLesson from './graphql/finishLesson.graphql'
import fixStartCourse from './graphql/fixStartCourse.graphql'
import saveLessonPageState from './graphql/saveLessonPageState.graphql'
import restoreLessonPageState from './graphql/restoreLessonPageState.graphql'
import questionsListOfLesson from './graphql/questionsListOfLesson.graphql'
import discussionOfLesson from './graphql/discussionOfLesson.graphql'
import addPost from './graphql/addPost.graphql'

const getClient = async () => {
  const token = await auth.getToken()
  const options = {
    credentials: 'include',
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    headers: {

      'schema': 'LMSSCHEMA'
    }
  }
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class LmsApi {

  static async getAvailableFiltersFromGql() {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` ${availableFilters}`
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async getRecommendedFromGql() {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` ${recommended}`
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async getCoursesFromGql() {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` ${courses}`
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async getModulesFromGql() {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` ${modules}`
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async getCourseDetailFromGql(courseid) {
    try {
      const client = await getClient()
      return await client.query({
        query: gql`query ($courseid: ID) ${courseDetails}`,
        variables: {courseid}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async savePageStateFromGql(courseGuid, pageState) {
    try {
      const client = await getClient()
      return await client.mutate({
        mutation: gql` ${saveLessonPageState}`,
        variables: {courseGuid, pageState}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async restorePageStateFromGql(courseGuid) {
    try {
      const client = await getClient()
      const result = await client.query({
        query: gql`query ($courseGuid: String!) ${restoreLessonPageState}`,
        variables: {courseGuid}
      })
      return result ? result.data.lms.restoreLessonPageState.pageStateParamsJson : ''
    } catch (e) {
      console.log(e.message)
    }
  }

  static async getLessonContentFromGql(lessonid, isfree) {
    try {
      const client = await getClient()
      return await client.query({
        query: gql`query ($lessonid: ID, $isfree: Boolean) ${lessonContent}`,
        variables: {lessonid, isfree}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async fixCourseStartFromGql(courseGuid) {
    try {
      const client = await getClient()
      return await client.mutate({
        mutation: gql`${fixStartCourse}`,
        variables: {courseGuid}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async fixLessonPassingFromGql(courseGuid, lessonGuid) {
    try {
      const client = await getClient()
      return await client.mutate({
        mutation: gql`${finishLesson}`,
        variables: {lessonGuid, courseGuid}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async fetchQuestionsListCurrentLessonFromGql(lessonGuid) {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` query ($lessonGuid: ID) ${questionsListOfLesson}`,
        variables: {lessonGuid}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  static async fetchDiscassionOfLessonFromGql(questionId) {
    try {
      const client = await getClient()
      return await client.query({
        query: gql` query ($questionId:ID) ${discussionOfLesson}`,
        variables: {questionId}
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  static async addPostFromGql(userId, lessonGuid, parentPostId = 0, post) {
    try {
      const client = await getClient()
      return await client.mutate({
        mutation: gql`${addPost}`,
        variables: { userId, lessonGuid, parentPostId, post: JSON.stringify(post) }
      })
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  // STUB
  // TODO: реализовать запрос и обработку после добавления реализации на сервере
  static async getTestInfoFromGql(surveyGuid) {
    if (surveyGuid !== '00000000-0000-0000-0000-000000000000') {
      return {
        success: false,
        successmessage: null,
        errormessage: 'Ошибка! Запрошенный тест отсутствует',
        errorcode: '',
        test: {
          surveyId: 0,
          userId: 0,
          surveyStatus: 2,
          surveyName: null,
          surveyDescription: null,
          surveyLanguage: null,
          surveyType: null,
          attemptsTotal: 0,
          attemptsAvailable: 0
        }
      }
    } else {
      return {
        success: true,
        successmessage: '',
        errormessage: '',
        errorcode: '',
        test: {
          surveyId: 10,
          userId: 7,
          surveyStatus: 2, // open
          surveyName: 'Тестирование отображения теста в LMS',
          surveyDescription: `Пройдите тест.<br>
          Время отведенное для теста - 15 мин.<br>
          Для ответа нажмите кнопку "Ответить".
          Если вопрос покажется сложным перейдите к следующему, а позже, когда останется время - вернитесть, выбрав его по номеру в списке над текстом вопроса.<br>
          Для  досрочного завершения теста нажмите кнопку <b>"Завершить"</b>.
          <hr>
          Время отведенное для теста - 15 мин.<br>
          Для ответа нажмите кнопку "Ответить".
          Если вопрос покажется сложным перейдите к следующему, а позже, когда останется время - вернитесть, выбрав его по номеру в списке над текстом вопроса.<br>
          Для  досрочного завершения теста нажмите кнопку <b>"Завершить"</b>
          `,
          surveyLanguage: 'RU',
          surveyType: 1,
          attemptsTotal: 2,
          attemptsAvailable: 1
        }
      }
    }
  }

  // STUB
  // TODO: реализовать запрос и обработку после добавления реализации на сервере
  static async initializeTestFromGql(surveyId, userId) {
    const params = {surveyId, userId}
    console.log('initializeTestFromGql', params)
    if (surveyId === 10) {
      return {
        success: true,
        successmessage: null,
        errormessage: '',
        errorcode: '',
        answerHeader: 101
      }
    } else {
      return {
        success: false,
        successmessage: null,
        errormessage: 'Произошла ошибка! Продолжение прохождения теста невозможно!',
        errorcode: '',
        answerHeader: 0
      }
    }
  }

  async getLogo () {
    return 'https://m.it.ua/s00/ws/GetFile.ashx?file=itlogo.png&folder=DOCS'
  }
}
