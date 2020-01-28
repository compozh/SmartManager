import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import auth from '@it-enterprise/jwtauthentication'

export const getClient = async schema => {
  const token = await auth.getToken()
  const options = {
    uri: window.appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'schema': schema
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}
