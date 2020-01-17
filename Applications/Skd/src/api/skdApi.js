import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
import auth from '@it-enterprise/jwtauthentication'
// Queries
import usersQuery from './graphql/users.graphql'

const getClient = async () => {
  const token = await auth.getToken()
  const options = {
    uri: window.myConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'schema': 'SKDSCHEMA'
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class SkdApi {
  static async getUsersFromGql() {
    const client = await getClient()
    return await client.query({
      query: gql` ${usersQuery}`
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
}
