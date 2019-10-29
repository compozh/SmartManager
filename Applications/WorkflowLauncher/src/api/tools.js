import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import Vue from 'vue'

export const getClient = (schema) => {

  const authHeader = Vue.prototype.$authentication ? Vue.prototype.$authentication.getAuthHeader() : undefined
  const options = {
    uri: window.appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ... authHeader,
      'schema': schema
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}
