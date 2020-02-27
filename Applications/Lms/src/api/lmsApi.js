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

  getLogo () {
    return 'https://m.it.ua/s00/ws/GetFile.ashx?file=itlogo.png&folder=DOCS'
  }
}
