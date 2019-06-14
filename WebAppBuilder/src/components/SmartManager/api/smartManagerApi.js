import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'

// Queries
import folders from './graphql/folders.graphql'

const options = {
  uri: myConfig.GrapgQlUrl + 'api/graphql',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
    'schema': 'smartmanager'
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(options)
})

class SmartManagerApi {
  constructor() {}

  getFoldersFromGql() {
    client.query({
      query: gql` ${folders}`
    })
    .then(result => console.log(result));
  }

  getTasks() {}

}

export default SmartManagerApi
