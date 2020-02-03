import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'

import getProcesses from './graphql/getProcesses.graphql'
import getForm from './graphql/getForm.graphql'
import startProcess from './graphql/startProcess.graphql'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    auth.clearTokens()
  }
  if (graphQLErrors) {
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
      'schema': 'process'
    }
  }

  const httpLink = new HttpLink(options)
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(httpLink)
  })
}

export class ProcessApi {
  async getProcessesFromGql () {
    const client = await getClient()
    const result = await client.query({
      query: gql`${getProcesses}`,
      fetchPolicy: 'network-only'
    })

    return result.data.processQuery.getProcesses
  }

  async getFormFromGql (processDefinitionId) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${getForm}`,
      variables: { processDefinitionId },
      fetchPolicy: 'network-only'
    })

    return result.data.processQuery.getForm
  }

  async startProcessGql (startProcessParams) {
    const client = await getClient()
    const result = await client.mutate({
      mutation: gql`${startProcess}`,
      variables: { startProcessParams }
    })

    return result.data.processQueryMutation.startProcess
  }
}
