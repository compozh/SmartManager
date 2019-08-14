import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
// Queries
import createModel from './graphql/createModel.graphql'
import models from './graphql/models.graphql'
import modelXml from './graphql/modelXml.graphql'
import Vue from 'vue'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    // eslint-disable-next-line no-undef
    uri: myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
      'schema': 'bpmnmodeler'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class BpmnModelerApi {
  constructor() {}

  getModels() {
    return getClient().query({
      query: gql` ${models}`
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  getModelXml(modelId) {
    return getClient().query({
      query: gql`query ($id: String) ${modelXml}`,
      variables: {modelId}
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  createModel(model) {
    return getClient().mutate({
      mutation: gql`mutation ($model: ModelInput!) ${createModel}`,
      variables: {
        newTask: model
      }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
}
