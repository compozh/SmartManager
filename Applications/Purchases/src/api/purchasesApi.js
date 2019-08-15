import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import _ from 'lodash'

// ResourceGroups query
import mainQuery from './graphql/base/queryWithGroupStringParams.graphql'
import queryWithGroupIdParam from './graphql/base/queryWithGroupIdParam.graphql'
import catalogueQueryFragment from './graphql/fragments/catalogueQuery.graphql'
import resourcesMinimalFieldsFragment from './graphql/fragments/resources/minimalFields.graphql'
import resourcesGroupsMinimalFieldsFragment from './graphql/fragments/resourcesGroups/minimalFields.graphql'
import catalogueItemAttachmentsFields from './graphql/fragments/catalogueItemAttachmentsFields.graphql'
// Queries

import breadcrumbsByGroup from './graphql/breadcrumbsByGroup.gql'
import resourcesGroupById from './graphql/resourcesGroupById.gql'
import resourceById from './graphql/resourceById.gql'
import cartItems from './graphql/cartItems.gql'
import favLists from './graphql/favLists.gql'
import elasticSearch from './graphql/elasticSearch.gql'
import masurementSearch from './graphql/masurementSearch.gql'
import addToCart from './graphql/addToCart.gql'
import addToCartByApplicationId from './graphql/base/mutations/addToCartByApplicationId.gql'
import updateCart from './graphql/updateCart.gql'
import deleteAllCarts from './graphql/deleteAllCarts.gql'
import deleteCart from './graphql/deleteCart.gql'
import createCart from './graphql/createCart.gql'
import createOrder from './graphql/createOrder.gql'
import store from '../store/index'
import addToFavorites from './graphql/addToFavorites.gql'
import changeLocalization from './graphql/changeLocalization.gql'
import resourcesGropsByParentGroup from './graphql/resourcesGropsByParentGroup.gql'
import mutationEditFavList from './graphql/mutationEditFavList.gql'
import mutationDeleteFavList from './graphql/mutationDeleteFavList.gql'

import deleteItemFromFavorites from './graphql/deleteItemFromFavorites.gql'
import mutationCreateFavList from './graphql/mutationCreateFavList.gql'
import applications from './graphql/applications.gql'
import docStatus from '../api/graphql/docStatus.gql'
import recoursesByIds from '../api/graphql/recoursesByIds.gql' 
import applicationsByIds from '../api/graphql/applicationsByIds.gql' 
import mutationChangeListForItem from '../api/graphql/mutationChangeListForItem.gql'
import Vue from 'vue'

const authHeader =  Vue.prototype.$authentication.getAuthHeader()
const options = {
  credentials: 'include',
  uri: window.myConfig.GrapgQlUrl + 'api/graphql',
  headers: {
    ...authHeader,
    // 'Authorization': 'Bearer ' + localStorage.getItem('ItUniTocken'),
    'schema': 'PurchasesSchema'
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink(options)
})


export class PurchasesApi {
  constructor() {}

  getResourceById(id) {
    return client.query({
      query: gql`${resourceById}`,
      variables: { id: id },
      fetchPolicy: 'no-cache'
    })
      .catch(error => console.log(error.message))
  }

  getBreadcrumbsByGroupCallback(response) {
    let data = response.data.purchases.resourcesGroupsBreadcrumbs
    store.commit('purchases/setBreadCrumbs', data)
  }

  restoreGraphCache() {    
    client.cache.reset()
  }
  getBreadcrumbsByGroup(group, reload) {
    let q = {
      query: gql`${breadcrumbsByGroup}`,
      variables: { group: group },
    }
    if (reload) {
      this.restoreGraphCache()
    }

    client.query(q)
      .then(this.getBreadcrumbsByGroupCallback)
      .catch(error => console.log(error.message))
  }

  getResourcesGroupsByParentGroupCallback(result) {
    let t = result.data.purchases.resourcesGroups
    store.commit('purchases/setResourceGroups', t)
  }

  getResourcesGroupsByParentGroup(group) {
    return client.query({
      query: gql`${resourcesGropsByParentGroup}`,
      variables: { group: group },
      fetchPolicy: 'no-cache'
    })
      .then(this.getResourcesGroupsByParentGroupCallback)
      .catch(error => console.log(error.message))
  }
  
  getResourcesGroupById(group) {
    return client.query({
      query: gql`
        ${mainQuery} 
        ${catalogueQueryFragment} 
        ${resourcesMinimalFieldsFragment} 
        ${resourcesGroupsMinimalFieldsFragment}`,
      variables: { group: group }//,
      //fetchPolicy: 'no-cache'
    })
      .then(this.getResourcesGroupByIdCallback)
      .catch(error => console.log(error.message))
  }

  getResourcesGroupByIdCallback(result) {
    let t = result.data.purchases.resourcesGroup
    store.commit('purchases/setResourceGroup', t)
  }

  getImagesForCatalogueGroup(group) {
    const FIELDS = gql`
      fragment resourcesGroupFields on ResourceGroup {
        content
      }
    `
    return client.query({
      query: gql`${resourcesGroupById} ${FIELDS}`,
      variables: { group: group },
      //fetchPolicy: 'no-cache'
    })
  }
  getImagesForCatalogueItem(id) {

    const query = gql`${queryWithGroupIdParam} ${catalogueItemAttachmentsFields}`
    return client.query({
      query: query,
      variables: { id: id }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  getCartItemsCallback(result) {
    let cartItems = result.data.purchases.cartItems
    store.commit('purchases/setCartItems', cartItems)
  }

  getCartItems() {
    return client.query({
      query: gql`${cartItems}`,
      variables: { },
      fetchPolicy: 'no-cache'
    })
      .then(this.getCartItemsCallback)
      .catch(error => console.log(error.message))
  }

  getMeasurementUnits(txt) {
    const FIELDS = gql`
    fragment measurementUnitFields on MeasurementUnitGraph {
      id, name, fullName
    }
  `
    var v = { name: `%${txt}%` }
    return client.query({
      query: gql`${masurementSearch} ${FIELDS}`,
      variables: v
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }

  elasticSearch(text) {
    return client.query({
      query: gql`${elasticSearch}`,
      variables: { name: text }
    })
      .then(result => result)
      .catch(error => console.log(error.message))
  }
  
  createCartMutationCallback(result) {
    let response_data = result.data.purchasesMutation.createCart
    var cartItem = {
      id: response_data.id,
      resourceId: response_data.resourceId,
      measurementUnit: {id: response_data.measurementUnit.id,name: response_data.measurementUnit.name},
      resourceName: response_data.resourceName,
      quantity: response_data.quantity,
      dateDelivery: response_data.dateDelivery
    }
    store.commit('purchases/createCartItem', cartItem)
    store.commit('purchases/setMessage', `\"${cartItem.resourceName}\" добавлен в корзину.`)
  }
  
  deleteAllCartsMutationCallback() {
    store.commit('purchases/deleteAllCarts')
  }

  deleteCartMutationCallback(result) {
    let response_data = result.data.purchasesMutation.deleteCart
    var cartItemId = response_data.id

    store.commit('purchases/deleteCartItem', cartItemId)
  }

  addToCartMutationCallback(result) {
    let cartItem = result.data.purchasesMutation.addToCart
    store.commit('purchases/addCartItem', cartItem)
    store.commit('purchases/setMessage', `\"${cartItem.resourceName}\" добавлен в корзину.`)
  }

  addToCartMutation(itemId) {
    return client.mutate({
      mutation: gql`${addToCart}`,
      variables: {resourceId: itemId}
    })
      .then(this.addToCartMutationCallback)
      .catch(error => console.log(error.message))
  }
  
  addToCartByApplicationIdCallback(response) {
    let items = response.data.purchasesMutation.addToCartByApplicationId
    for (let i = 0;i < items.length;i++) {
      store.commit('purchases/addCartItem', items[i])
    }
    store.commit('purchases/setMessage', 'Ресурсы добавлены в корзину.')
  }

  addToCartByApplicationId(applicationId) {
    return client.mutate({
      mutation: gql`${addToCartByApplicationId}`,
      variables: {applicationId: applicationId}
    })
      .then(this.addToCartByApplicationIdCallback)
      .catch(error => console.log(error.message))
  }
  
  getCartInputTypeParam(cartItem) {
    let test =  {
      id: cartItem.id,
      resourceId: cartItem.resourceId,
      measurementUnitId: cartItem.measurementUnit === null ? cartItem.measurementUnitId : cartItem.measurementUnit.id,
      resourceName: cartItem.resourceName,
      quantity: cartItem.quantity < 1 ? 1 : cartItem.quantity,
      dateDelivery: cartItem.dateDelivery
    }

    return test
  }

  getOrderInputTypeParam(order) {
    let test =  {
      number: order.NDM,
      date: order.DDM,
      kDM1: order.DM1,
      kDM2: order.DM2,
      title: order.Description
    }

    return test
  }

  updateCartMutationCallback(result) {
    let response_data = result.data.purchasesMutation.updateCart
    store.commit('purchases/updateCartItem', response_data)
  }

  updateCartMutation(cartInput) {
    let item = this.getCartInputTypeParam(cartInput)
    return client.mutate({
      mutation: gql`${updateCart}`,
      variables: {cart: item}
    })
      .then(this.updateCartMutationCallback)
      .catch(error => console.log(error.message))
  }
  
  deleteAllCartsMutation() {
    return client.mutate({
      mutation: gql`${deleteAllCarts}`
    })
      .then(this.deleteAllCartsMutationCallback)
      .catch(error => console.log(error.message))
  }

  deleteCartMutation(id) {
    let responseId
    client.mutate({
      mutation: gql`${deleteCart}`,
      variables: {cartId: id}
    })
      .then(this.deleteCartMutationCallback)
      .catch(error => console.log(error.message))    
    
    return responseId
  }

  createCartMutation() {
    return client.mutate({
      mutation: gql`${createCart}`
    })
      .then(this.createCartMutationCallback)
      .catch(error => console.log(error.message))
  }
  //TODO
  createOrderMutationCallback(result) {
    
    let test = result
  }
  createOrderMutation(order) {
    let orderInput = this.getOrderInputTypeParam(order)
    return client.mutate({
      mutation: gql`${createOrder}`,
      variables: {orderInput: orderInput}
    })
      .then(this.deleteAllCartsMutationCallback)
      .catch(error => console.log(error.message))
  }

  getFavListsCallback(result) {
    let favLists = result.data.purchases.favLists
    store.commit('purchases/setFavLists', favLists)
  }
  async getFavLists() {
    await client.query({
      query: gql`query ${favLists}`,
      variables: { },
      fetchPolicy: 'no-cache'
    })
      .then(this.getFavListsCallback)
      .catch(error => console.log(error.message))
  }


  async addToFavoritesOneMutation(alias, keyValue, content) {
    let aliasFavLists = undefined
    if (content.$store.state.purchases.favlists) {
      aliasFavLists = content.$store.state.purchases.favlists.filter(w => w.alias == alias)
    } else {
      await this.getFavLists()
      aliasFavLists = content.$store.state.purchases.favlists.filter(w => w.alias == alias)
    }

    let defFavLists = aliasFavLists ? aliasFavLists.filter(w => w.isDefaultList)[0] : undefined

    if (!defFavLists) {
      defFavLists = aliasFavLists.length == 1 ? aliasFavLists[0] : undefined
    }
    if (defFavLists || !aliasFavLists.some(w => 1 == 1)) {
      await client.mutate({
        mutation: gql`${addToFavorites}`,
        variables: {alias: alias, keyValue: keyValue, listId: defFavLists ? defFavLists.id : ''}
      }).then(result => {
        let res = result.data.purchasesMutation.addToFavoritesOne
        let oldFavList = content.$store.state.purchases.favlists
        if (oldFavList && oldFavList.some(w => w.id == res.list.id)) {
          oldFavList.filter(w => w.id == res.list.id)[0].keyValues.push(res.keyValue)
          //content.$store.state.purchases.favlists = oldFavList;
        } else {
          oldFavList.push(res.list)
        }
      })

    } else {
      await store.commit('purchases/setChose', {
        list: aliasFavLists.map(w => { return {Title: w.caption, Key: w.id } }) , 
        caption: 'Выбор из списка',
        method: async (key) => {
          await client.mutate({
            mutation: gql`${addToFavorites}`,
            variables: {alias: alias, keyValue: keyValue, listId: key}
          }).then( async result => {
            let res = result.data.purchasesMutation.addToFavoritesOne
            let oldFavList = content.$store.state.purchases.favlists
            if (oldFavList && oldFavList.some(w => w.id == res.list.id)) {
              oldFavList.filter(w => w.id == res.list.id)[0].keyValues.push(res.keyValue)
              //content.$store.state.purchases.favlists = oldFavList;
            } else {
              oldFavList.push(res.list)
            }
          })
        }
      })
    }
    
  }

  
  getFavListInputTypeParam(favList) {
    let test =  {
      id: favList.id,//favList.id != null ? favList.id: favList.listiD,
      alias: favList.alias,
      caption: favList.caption,
      comment: '',
      isDefaultList: favList.isDefaultList,
      iconKey: '',
      keyValues: favList.keyValues
    }

    return test
  }

  mutationChangeListForItem(keyValue, newFavListId, oldFavListId) {
    return client.mutate({
      mutation: gql`${mutationChangeListForItem}`,
      variables: { keyValue: keyValue, newFavListId: newFavListId, oldFavListId: oldFavListId}     
    })
      .catch(error => { console.log(error.message) })
  }

  mutationEditFavList(favList) {
    let favListInput = this.getFavListInputTypeParam(favList)
    return client.mutate({
      mutation: gql`${mutationEditFavList}`,
      variables: {favList: favListInput}     
    })
      .catch(error => { console.log(error.message) })
  }
  mutationDeleteFavList(favList) {
    
    let favListInput = this.getFavListInputTypeParam(favList)
    
    return client.mutate({
      mutation: gql`${mutationDeleteFavList}`,
      variables: {favList: favListInput}     
    })
      .catch(error => { console.log(error.message) })
  }
  
  async deleteItemFromFavorites(alias, keyValue, context) {
    if (!store.state.purchases.favlists) {
      await this.getFavLists()
    }
    await client.mutate({
      mutation: gql`${deleteItemFromFavorites}`,
      variables: {alias: alias, keyValue: keyValue},     
    }).then( res => {
     
      let listId = res.data.purchasesMutation.deleteItemFromFavorites.id
      
      let oldFavlist = context.$store.state.purchases.favlists
      let keyValuess = oldFavlist.find(w => w.id == listId).keyValues
      let itemsToAdd = keyValuess.filter(w => w != keyValue)
      // var test1 = _.remove(keyValuess, function(n) {
      //   return n != keyValue;
      // });
      
      oldFavlist.find(w => w.id == listId).keyValues = []
      itemsToAdd.forEach(w => { oldFavlist.find(w => w.id == listId).keyValues.push(w) } )
      
    })
      .catch(error => { console.log(error.message) })
  }
  
  mutationCreateFavList() {

    store.commit('purchases/setChose', {
      list: [{Title: 'Заявки', Key: 'DOC'}, {Title: 'Ресурсы', Key: 'KSM'},] , 
      caption: 'Тип списка?',
      method: (key) => {
        return client.mutate({
          mutation: gql`${mutationCreateFavList}`,
          variables: {alias: key},     
          fetchPolicy: 'no-cache'
        })
          .then(result => {
            let newFavList = result.data.purchasesMutation.mutationCreateFavList
              
            store.commit('purchases/addToFavLists', newFavList)
            store.commit('purchases/setMessage',  'Добавлен список')
          })
          .catch(error => { console.log(error.message) })
      }
    })
  }
  getApplicationsCallback(result) {
    let applications = result.data.purchases.applications
    store.commit('purchases/addApplications', applications)
  }
  getApplications() {
    return client.mutate({
      mutation: gql`query($curr: Boolean) ${applications}`,
      variables: { curr: true }     
    })
      .then(this.getApplicationsCallback)
      .catch(error => console.log(error.message))
  }
  
  getClient() {
    return client
  }

  getDocStatus() {
    return client.query({
      query: gql`${docStatus}`,
      variables: { }     
    })
      .then(this.getDocStatusCallback)
      .catch(error => console.log(error.message))
  }
  getDocStatusCallback(result) {
    let docStatus = result.data.purchases.docStatus
    store.commit('purchases/setDocStatus', docStatus)
  }

  getApplicationsByIds(ids) {
    return client.mutate({
      mutation: gql`${applicationsByIds}`,
      variables: { ids: ids}     
    })
      .then(this.getApplicationsCallback)
      .catch(error => console.log(error.message))
  }
  
  getResourcesByIds(ids) {
    console.log(123)
    debugger
    return client.query({
      query: gql`${recoursesByIds}`,
      variables: { ids: ids }//,
      //fetchPolicy: 'no-cache'
    })
      .then(this.getResourcesByIdsCallback)
      .catch(error => console.log(error.message))
    
  }

  getResourcesByIdsCallback(result) {
    let t = result.data.purchases.resources
    //debugger;
    store.commit('purchases/addResources', t)
  }
}