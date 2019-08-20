import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import itmenuQuery from './graphql/itmenu.graphql'

import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ... authHeader,
      'schema': 'ITPORTAL'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class ITPortalApi {
  constructor() {}
  
  getITPortalMenu() {
    return getClient().query({
      query: gql` ${itmenuQuery}`
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
}