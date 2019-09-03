import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
import recommended from './graphql/recommended.graphql'
import courses from './graphql/courses.graphql'
import modules from './graphql/modules.graphql'
import availableFilters from './graphql/availableFilters.graphql'
import courseDetails from './graphql/courseDetails.graphql'
import lessonContent from './graphql/lessonContent.graphql'
import Vue from 'vue'

// const options = {
//   uri: myConfig.GrapgQlUrl + 'api/graphql',
//   credentials: 'include',
//   headers: {
//     'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
//     'schema': 'lms'
//   }
// }

// const client = new ApolloClient ({
//   cache: new InMemoryCache(),
//   link: new HttpLink(options)
// })
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
}