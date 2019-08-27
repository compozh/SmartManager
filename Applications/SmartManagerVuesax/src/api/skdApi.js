import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import usersQuery from './graphql/users.graphql'

import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    uri: window.appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ... authHeader,
      'schema': 'SKDSCHEMA'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class SkdApi {
  constructor() {}

  getUsersFromGql() {
    return getClient().query({
      query: gql` ${usersQuery}`
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
}
