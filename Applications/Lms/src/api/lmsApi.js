import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import recommended from './graphql/recommended.graphql'
import courses from './graphql/courses.graphql'
import modules from './graphql/modules.graphql'
import availableFilters from './graphql/availableFilters.graphql'
import courseDetails from './graphql/courseDetails.graphql'
import lessonContent from './graphql/lessonContent.graphql'
import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()

  const options = {
    credentials: 'include',
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    headers: {
      ...authHeader,
      'schema': 'LMSSCHEMA'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class LmsApi {
  constructor() { }

  getAvailableFiltersFromGql() {
    return getClient().query({
      query: gql` ${availableFilters}`
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  getRecommendedFromGql() {
    return getClient().query({
      query: gql` ${recommended}`
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getCoursesFromGql() {
    return getClient().query({
      query: gql` ${courses}`
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getModulesFromGql() {
    return getClient().query({
      query: gql` ${modules}`
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getCourseDetailFromGql(courseGuid) {
    return getClient().query({
      query: gql`query ($courseid: ID) ${courseDetails}`,
      variables: {
        courseid : courseGuid
      }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getLessonContentFromGql(lessonGuid) {
    return getClient().query({
      query: gql`query ($lessonid: ID) ${lessonContent}`,
      variables: {
        lessonid : lessonGuid
      }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getLogo () {
    return 'https://m.it.ua/s00/ws/GetFile.ashx?file=itlogo.png&folder=DOCS'
  }
}
