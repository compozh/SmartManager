import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import _ from 'lodash';
// Queries
import resourcesGropsById from './graphql/resourcesGropsById.gql'
import resourcesGropsByGoup from './graphql/resourcesGropsByGoup.gql'
import resources from './graphql/resources.gql'
import cartItems from './graphql/cartItems.gql'
import elasticSearch from './graphql/elasticSearch.gql'
import masurementSearch from './graphql/masurementSearch.gql'
import addToCart from './graphql/addToCart.gql'
import store from '../../../store/index'

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

  getResourcesGroups(id, flds){
    var FIELDS = gql`
    fragment resourcesGroupsFields on ResourceGroup {
      ${flds}
    }
  `;
    return client.query({
      query: gql`query ($id: ID) ${resourcesGropsById} ${FIELDS}`,
      variables: { id: id }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getResourcesGroupsByGroup(group, flds){
    var FIELDS = gql`
    fragment resourcesGroupsFields on ResourceGroup {
      ${flds}
    }
  `;
    return client.query({
      query: gql`query ($group: String) ${resourcesGropsByGoup} ${FIELDS}`,
      variables: { group: group }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }


  getImagesForCatalogueGroup(id) {
    return this.getResourcesGroups(id, "content");
  }

  getImagesForCatalogueItem(id){
    const FIELDS = gql`
    fragment resourcesFields on Resource {
      content
    }
  `;
    return client.query({
      query: gql`query ($id: ID) ${resources} ${FIELDS}`,
      variables: { id: id }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  getCartItems(){
    return client.query({
      query: gql`query ${cartItems}`,
      variables: { }
    })
    .then(result => 
      result)
    .catch(error => console.log(error.message))
  }

  getMeasurementUnits(txt){
    const FIELDS = gql`
    fragment measurementUnitFields on MeasurementUnitGraph {
      id, name, fullName
    }
  `;
    var v = { name: `%${txt}%` };
    return client.query({
      query: gql`query ($name: [String]) ${masurementSearch} ${FIELDS}`,
      variables: v
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }

  elasticSearch(text){
    return client.query({
      query: gql`query ($name: String) ${elasticSearch}`,
      variables: { name: text }
    })
    .then(result => result)
    .catch(error => console.log(error.message))
  }
  
  addToCartMutationCallback(result){
    let response_data = result.data.purchasesMutation.addToCart;
        var cartItem = response_data;
        store.commit('purchases/addCartItem', cartItem);
        store.commit("purchases/setMessage", `\"${cartItem.resourceName}\" добавлен в корзину.`);
  }

  addToCartMutation(item){
    return client.mutate({
      mutation: gql`${addToCart}`,
      variables: {resourceId: item.id}
    })
      .then(this.addToCartMutationCallback)
      .catch(error => console.log(error.message))
    }
}