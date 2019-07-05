import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag'
// Queries
import resourcesGropsContents from './graphql/resourcesGropsContents.gql'
import resourcesItemsContents from './graphql/resourcesItemsContents.gql'
const options = {
  uri: myConfig.GrapgQlUrl + 'api/graphql',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
    'schema': 'PurchasesSchema'
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(options)
})

export class PurchasesApi {
  constructor() {}

  getImagesForCatalogueGroup(id) {
    return client.query({
      query: gql`query ($id: ID) ${resourcesGropsContents}`,
      variables: { id: id }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getImagesForCatalogueItem(id){
    return client.query({
      query: gql`query ($id: ID) ${resourcesItemsContents}`,
      variables: { id: id }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }
}