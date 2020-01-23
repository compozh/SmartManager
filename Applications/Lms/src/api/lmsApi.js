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

const getClient = async () => {
  const token = await auth.getToken()
  const options = {
    credentials: 'include',
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    headers: {
      'Authorization': `Bearer ${token}`,
      'schema': 'LMSSCHEMA'
    }
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

  static async getLessonContentFromGql(lessonid) {
    try {
      const client = await getClient()
      return await client.query({
        query: gql`query ($lessonid: ID) ${lessonContent}`,
        variables: {lessonid}
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  getLogo () {
    return 'https://m.it.ua/s00/ws/GetFile.ashx?file=itlogo.png&folder=DOCS'
  }
}
