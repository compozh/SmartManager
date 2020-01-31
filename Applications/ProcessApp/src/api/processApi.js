import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'

import getForm from './graphql/getForm.graphql'

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
  async getFormFromGql (processDefinitionId) {
    const client = await getClient()
    const result = await client.query({
      query: gql`${getForm}`,
      variables: { processDefinitionId },
      fetchPolicy: 'network-only'
    })
    // eslint-disable-next-line
    return result.data.processQuery.getForm
  }
}
