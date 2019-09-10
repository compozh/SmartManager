import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import documentsQuery from './graphql/documents.graphql'
import documentQuery from './graphql/document.graphql'
import createDocumentMutation from './graphql/createDocument.graphql'
import deleteDocumentMutation from './graphql/deleteDocument.graphql'

import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    uri: window.appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ... authHeader,
      'schema': 'DOCUMENTS_KEYS'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class KeysApi {
  constructor() {}

  static getDocuments(dateFrom, dateTo) {
    return getClient().query({
      query: gql` ${documentsQuery}`,
      variables: {
        dateFrom, dateTo
      }
    })
  }

  static getDocument(id) {
    return getClient().query({
      query: gql` ${documentQuery}`,
      variables: { id }
    })
  }

  static createDocument({number, date, comment}) {
    return getClient().mutate({
      mutation: gql` ${createDocumentMutation}`,
      variables: { date, number, comment }
    })
  }

  static deleteDocument(id) {
    return getClient().mutate({
      mutation: gql` ${deleteDocumentMutation}`,
      variables: { id }
    })
  }
}
