import {getClient} from './tools'

import gql from 'graphql-tag'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Queries
export class PortalApi {
  static getAppId() {
    // получение appId
    let tempRouter = new VueRouter({
      mode: 'history',
      base: process.env.VUE_APP_BASE_PATH_FULL,
      routes: [{path: '/:ApplicationId', children: [{path: '*'}]}
      ]
    })

    tempRouter.history.getCurrentLocation = function() {
      let path = window.location.pathname
      let base = tempRouter.history.base

      // Removes base from path (case-insensitive)
      if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
        path = path.slice(base.length)
      }
      return (path || '/') + window.location.search + window.location.hash
    }
    let tempVue = new Vue({
      router: tempRouter
    })
    return tempVue.$route.params.ApplicationId
  }

  static async getApplicationDescription() {
    const appId = this.getAppId()
    // загрузка описания приложения
    const client = await getClient('WEBAPPS')
    return await client.query({
      query: gql` query q($appId : String) {\n  webapps{\n    application(applicationId:$appId)\n  }\n}`,
      variables: { appId }
    })
  }
}
