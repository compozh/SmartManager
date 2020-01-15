import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import {onError} from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'
import router from '@/router'

// const router = routerDependencies.router

import ticket from './graphql/ticket.graphql'

import getForm from './graphql/getForm.graphql'
import createForm from './graphql/createForm.graphql'
import saveForm from './graphql/saveForm.graphql'
import submitForm from './graphql/submitForm.graphql'
import callFormCustomEvent from './graphql/callFormCustomEvent.graphql'
import callItemAutocomplete from './graphql/callItemAutocomplete.graphql'

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens()
    if (router.currentRoute.name !== 'MESLOGIN') {
      router.push({path: 'login', query: {to: router.currentRoute.path, fixedUuid: router.currentRoute.query.fixedUuid}})
    }
  }
  if (graphQLErrors) {
    // TODO: Обработать ошибку
    return graphQLErrors.message
  }
})

const getClient = async () => {
  const token = await auth.getToken()
  const options = {
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'schema': 'formio'
    }
  }
  const httpLink = new HttpLink(options)
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink)
  })
}

export class FormioApi {
  constructor() {}

  async getTicketFromGql () {
    const client = await getClient()
    const result = await client.query({
      query: gql` ${ticket}`
    })
    return result.data.formioQuery.ticket
  }

  async getFormGql(formCode, properties, deviceSizeType, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${getForm}`,
      variables: { formCode, properties, deviceSizeType },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.formioQuery.getForm
  }

  async submitFormGql(formCode, submission, properties) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${submitForm}`,
      variables: { formCode, submission, properties }
    })
    return result.data.formioQueryMutation.submitForm
  }

  async callFormCustomEventGql(formCode, formCustomEventParamsInput) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${callFormCustomEvent}`,
      variables: { formCode, formCustomEventParamsInput }
    })
    return result.data.formioQueryMutation.callFormCustomEvent
  }

  async callItemAutocompleteGql(formCode, formItemAutocompleteParamsInput, fetchPolicy) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${callItemAutocomplete}`,
      variables: { formCode, formItemAutocompleteParamsInput },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.formioQuery.callItemAutocomplete
  }

  async createFormGql(formDefinitionParamsInput) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${createForm}`,
      variables: { formDefinitionParamsInput }
    })
    return result.data.formioQueryMutation.createForm
  }

  async saveFormGql(formDefinitionParamsInput) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${saveForm}`,
      variables: { formDefinitionParamsInput }
    })
    return result.data.formioQueryMutation.saveForm
  }
}
