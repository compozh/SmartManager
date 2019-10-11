import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'

import Vue from 'vue'

import ticket from './graphql/ticket.graphql'

import getForm from './graphql/getForm.graphql'
import createForm from './graphql/createForm.graphql'
import saveForm from './graphql/saveForm.graphql'
import submitForm from './graphql/submitForm.graphql'
import callFormCustomEvent from './graphql/callFormCustomEvent.graphql'
import callItemAutocomplete from './graphql/callItemAutocomplete.graphql'

const getClient = () => {
  const authHeader =  Vue.prototype.$authentication.getAuthHeader()
  const options = {
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ...authHeader,
      'schema': 'formio'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class FormioApi {
  constructor() {}

  async getTicketFromGql () {
    const result = await getClient().query({
      query: gql` ${ticket}`
    })
      .then(result => result)
    return result.data.formio.ticket
  }

  async getFormGql(formCode, fetchPolicy) {
    const result = await getClient().query({
      query: gql`${getForm}`,
      variables: { formCode },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)

    return result.data.formio.getForm
  }

  async submitFormGql(formCode, submission, formDefinitionParamsInput) {
    const result = await getClient().mutate({
      mutation: gql`${submitForm}`,
      variables: { formCode, submission, formDefinitionParamsInput }
    })
      .then(result => result)

    return result.data.formioMutation.submitForm
  }

  async callFormCustomEventGql(formCode, formCustomEventParamsInput) {
    const result = await getClient().mutate({
      mutation: gql`${callFormCustomEvent}`,
      variables: { formCode, formCustomEventParamsInput }
    })
      .then(result => result)

    return result.data.formioMutation.callFormCustomEvent
  }

  async callItemAutocompleteGql(formCode, formItemAutocompleteParamsInput, fetchPolicy) {
    const result = await getClient().query({
      query: gql`${callItemAutocomplete}`,
      variables: { formCode, formItemAutocompleteParamsInput },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
      .then(result => result)

    return result.data.formio.callItemAutocomplete
  }

  async createFormGql(formDefinitionParamsInput) {
    const result = await getClient().mutate({
      mutation: gql`${createForm}`,
      variables: { formDefinitionParamsInput }
    })
      .then(result => result)

    return result.data.formioMutation.createForm
  }

  async saveFormGql(formDefinitionParamsInput) {
    const result = await getClient().mutate({
      mutation: gql`${saveForm}`,
      variables: { formDefinitionParamsInput }
    })
      .then(result => result)

    return result.data.formioMutation.saveForm
  }
}
