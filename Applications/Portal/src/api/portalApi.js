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
