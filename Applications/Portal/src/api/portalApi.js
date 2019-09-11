import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {HttpLink} from 'apollo-link-http'
import gql from 'graphql-tag'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Queries



export const getClient = (schema) => {

  const authHeader = Vue.prototype.$authentication ? Vue.prototype.$authentication.getAuthHeader() : undefined
  const options = {
    uri: window.appConfig.GrapgQlUrl + 'api/graphql',
    credentials: 'include',
    headers: {
      ... authHeader,
      'schema': schema
    }
  }
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(options)
  })
}

export class PortalApi {

  static getAppId() {
    // получение appId
    let tempRouter = new VueRouter({
      mode: 'history',
      base: process.env.VUE_APP_BASE_PATH,
      routes: [{path: '/:ApplicationId', children: [{path: '*'}]}
      ]
    })
    let tempVue = new Vue({
      router: tempRouter
    })
    return tempVue.$route.params.ApplicationId
  }

  static async getApplicationDescription() {

    let appId = PortalApi.getAppId()

    // загрузка описания приложения
    return await getClient('WEBAPPS').query({
      query: gql` query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}`,
      variables: { appId }
    })
  }

}
