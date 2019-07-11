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
import updateCart from './graphql/updateCart.gql'
import deleteAllCarts from './graphql/deleteAllCarts.gql'
import deleteCart from './graphql/deleteCart.gql'
import createCart from './graphql/createCart.gql'
import createOrder from './graphql/createOrder.gql'
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

  getCartItemsCallback(responce){
    let test = responce;
    debugger;
  }

  getCartItems(){
    return client.query({
      query: gql`query ${cartItems}`,
      variables: { }
    })
    .then(r=>r)
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
  
  createCartMutationCallback(result){
    let response_data = result.data.purchasesMutation.createCart;
    var cartItem = {
      id:                 response_data.id,
      resourceId:         response_data.resourceId,
      measurementUnitId:  response_data.measurementUnit.id,
      resourceName:       response_data.resourceName,
      quantity:           response_data.quantity,
      dateDelivery:       response_data.dateDelivery
    }
    store.commit('purchases/createCartItem', cartItem);
  }
  
  deleteAllCartsMutationCallback(){
    store.commit('purchases/deleteAllCarts');
  }

  deleteCartMutationCallback(result){
    let response_data = result.data.purchasesMutation.deleteCart;
    var cartItemId = response_data.id;

    store.commit('purchases/deleteCartItem', cartItemId);
  }

  addToCartMutationCallback(result){
    let response_data = result.data.purchasesMutation.addToCart;
    var cartItem = {
      id:                 response_data.id,
      resourceId:         response_data.resourceId,
      measurementUnitId:  response_data.measurementUnit.id,
      resourceName:       response_data.resourceName,
      quantity:           response_data.quantity,
      dateDelivery:       response_data.dateDelivery
    }
    store.commit('purchases/addCartItem', cartItem);
  }

  addToCartMutation(item){
    return client.mutate({
      mutation: gql`${addToCart}`,
      variables: {resourceId: item.id}
    })
      .then(this.addToCartMutationCallback)
      .catch(error => console.log(error.message))
    }
  
  getCartInputTypeParam(cartItem){
    let test =  {
        id:                 cartItem.id,
        resourceId:         cartItem.resource===null ? null : cartItem.resource.id,
        measurementUnitId:  cartItem.measurementUnit.id,
        resourceName:       cartItem.resourceName,
        quantity:           cartItem.quantity<1 ? 1 : cartItem.quantity,
        dateDelivery:       cartItem.dateDelivery
    }

    return test;
  }

  getOrderInputTypeParam(order){
    debugger;
    let test =  {
        number:         order.NDM,
        date:           order.DDM,
        kDM1:           order.DM1,
        kDM2:           order.DM2,
        title:          order.Description
    }
    debugger;

    return test;
  }

  // TODO fix
  updateCartMutation(cartInput){
    let item = this.getCartInputTypeParam(cartInput);
    return client.mutate({
      mutation: gql`${updateCart}`,
      variables: {cart: item}
    })
      .then(this.addToCartMutationCallback)
      .catch(error => console.log(error.message))
  }
  
  deleteAllCartsMutation(){
    return client.mutate({
      mutation: gql`${deleteAllCarts}`
    })
      .then(this.deleteAllCartsMutationCallback)
      .catch(error => console.log(error.message))
  }

  deleteCartMutation(id){
    let responseId;
    client.mutate({
      mutation: gql`${deleteCart}`,
      variables: {cartId: id}
    })
      .then(this.deleteCartMutationCallback)
      .catch(error => console.log(error.message))    
    
    return responseId;
  }

  createCartMutation(){
    return client.mutate({
      mutation: gql`${createCart}`
    })
      .then(this.createCartMutationCallback)
      .catch(error => console.log(error.message))
  }

  createOrderMutationCallback(result){
    
    let test = result;
  }
  createOrderMutation(order){
    let orderInput = this.getOrderInputTypeParam(order);
    debugger;
    return client.mutate({
      mutation: gql`${createOrder}`,
      variables: {orderInput:orderInput}
    })
      .then(this.deleteAllCartsMutationCallback)
      .catch(error => console.log(error.message))
  }
}