import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import gql from 'graphql-tag'

import auth from '@it-enterprise/jwtauthentication'
import { routerDependencies } from '@/router'
import config from '../../config'

import ticket from './graphql/ticket.graphql'
import getForm from './graphql/getForm.graphql'
import createForm from './graphql/createForm.graphql'
import saveForm from './graphql/saveForm.graphql'
import submitForm from './graphql/submitForm.graphql'
import callFormCustomEvent from './graphql/callFormCustomEvent.graphql'
import callItemAutocomplete from './graphql/callItemAutocomplete.graphql'


export class FormioApi {

  async getTicketFromGql () {
    const result = await query({
      query: gql` ${ticket}`
    })
    return result.data.formioQuery.ticket
  }

  async getFormGql(formCode, properties, fetchPolicy, deviceSizeType) {
    const result = await query({
      query: gql`${getForm}`,
      variables: { formCode, properties, deviceSizeType },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.formioQuery.getForm
  }

  async submitFormGql(formCode, submission, properties) {
    const result = await mutate({
      mutation: gql`${submitForm}`,
      variables: { formCode, submission, properties }
    })
    return result.data.formioQueryMutation.submitForm
  }

  async callFormCustomEventGql(formCode, formCustomEventParamsInput) {
    const result = await mutate({
      mutation: gql`${callFormCustomEvent}`,
      variables: { formCode, formCustomEventParamsInput }
    })
    return result.data.formioQueryMutation.callFormCustomEvent
  }

  async callItemAutocompleteGql(formCode, formItemAutocompleteParamsInput, fetchPolicy) {
    const result = await query({
      query: gql`${callItemAutocomplete}`,
      variables: { formCode, formItemAutocompleteParamsInput },
      fetchPolicy: fetchPolicy || 'cache-first'
    })
    return result.data.formioQuery.callItemAutocomplete
  }

  async createFormGql(formDefinitionParamsInput) {
    const result = await mutate({
      mutation: gql`${createForm}`,
      variables: { formDefinitionParamsInput }
    })
    return result.data.formioQueryMutation.createForm
  }

  async saveFormGql(formDefinitionParamsInput) {
    const result = await mutate({
      mutation: gql`${saveForm}`,
      variables: { formDefinitionParamsInput }
    })
    return result.data.formioQueryMutation.saveForm
  }
}

async function query(options) {
  const token = await auth.getToken();
  addAuthHeader(options, token);
  return await getClient().query(options);
}

async function mutate(options) {
  const token = await auth.getToken();
  addAuthHeader(options, token);
  return await getClient().mutate(options);
}

function addAuthHeader(options, token) {
  if (!options.context) {
    options.context = {};
  }
  if (!options.context.headers) {
    options.context.headers = {};
  }
  options.context.headers['Authorization'] = `Bearer ${token}`;
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens();
    routerDependencies.router.push('/login');
  }
  if (graphQLErrors) {
    return graphQLErrors.message;
  }
});

function getClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(new HttpLink({
      uri: config.GrapgQlUrl + 'api/graphql',
      credentials: 'include',
      headers: {
        'schema': 'formio'
      }
    }))
  });
}