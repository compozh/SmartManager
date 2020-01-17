import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import acl from '@/acl/acl'
import cookies from 'vue-cookies'
import UuidHelper from './UuidHelper'
import { access } from 'fs'

export default class Init {
  initialize() {
    var fixedUuid = router.currentRoute.query.fixedUuid,
        cookiesUuid = cookies.get('mesUuid'),
        sessionStorageUuid = window.sessionStorage.getItem('mesUuid'),
        uuid = fixedUuid || cookiesUuid || sessionStorageUuid || UuidHelper.generate()

    if(!fixedUuid) {
      router.replace({ query: {...router.currentRoute.query.to, fixedUuid: uuid }})
    }
    cookies.set('mesUuid', uuid, '3y')
    window.sessionStorage.setItem('mesUuid', uuid)
    store.dispatch('mes/initializeWorkCenter', uuid)
    store.dispatch('mes/initializeProperties')
    store.dispatch('mes/initializeUser')
    store.dispatch('formio/initializeTicket')
    store.dispatch('mes/initializeMobilityProperties')
    store.dispatch('mes/verifyCamera')

    window.navigator.mediaDevices.ondevicechange = function(e) {
        store.dispatch('mes/verifyCamera')
    }
  }

  async initializeSignalR() {
      await store.dispatch('mes/initializeTicket')
      Vue.prototype.$signalR.connect('HUBBER', window.myConfig.SignalRUrl, this.applySignalR, store.getters['mes/ticket'])
  }

  applySignalR(msg) {
    let data = JSON.parse(msg)
    if (!data) {
      return
    }
    switch (data.Payload.Action) {
    case 'WorkCenterStateChanged':
      var state = data.Payload.Payload['STATE'],
        workCenterFixationData = store.getters['mes/workCenterFixationData']
      switch (state) {
      case 0: //DOWN_TIME
        workCenterFixationData.state = 'DOWN_TIME'
        break
      case 1: //BUSY
        workCenterFixationData.state = 'BUSY'
        break
      case 2: //EMERGENCY
        workCenterFixationData.state = 'EMERGENCY'
        break
      }
      workCenterFixationData.description = data.Message
      store.commit('mes/setWorkCenterFixationData', workCenterFixationData)
      break
    case 'TaskStateChanged':
      var workCenters = data.Payload.Payload['WORKCENTERCODES']
      if (!workCenters || !store.getters['mes/workCenter']) {
        break
      }
      workCenters = workCenters.includes(',') ? workCenters.trim().split(',') : [workCenters]
      if (workCenters.includes(store.getters['mes/workCenter'].code)) {
        store.commit('mes/setObsoluteDataTask', true)
      }
      break
    }
  }

  changeRoots(scope) {
    let center = scope.$store.getters['mes/workCenter']
    if(center){
      let access = center.accessPages
      scope.$acl.change(access)
    
      let pathTo = 
        access === 'ALL_PAGES' ? '/tasks' :
        access === 'ONLY_INSTALLATION' ? '/installations' :
        access === 'PRODUCTION' ? '/tasks' :
        access === 'ONLY_QUALITY' ? '/quality' : '/error/403'

      if(scope.$acl.get == access || pathTo == router.currentRoute.path) return
      router.replace({path : pathTo, query: {fixedUuid: router.currentRoute.query.fixedUuid}})
    }
  }

  preparePages(scope) {
    let dynamic  =  store.getters['mes/mobilityProperties']
    let workCenter = store.getters['mes/workCenter']
    let links = router.options.routes[0].children
    let dynamicPages = []
    if ( dynamic ) {
        dynamic.processesProperties.forEach(page => {
        let child = {}
        child.name = 'DYNAMIC'
        child.params = page.id.toLowerCase()
        child.path = 'dynamic'
        child.id = 'DYNAMIC'
        child.text = page.name
        child.sort = 100
        child.image = 'description'
        child.meta = {
          rule: 'allPages',
        }
        dynamicPages.push(child)
    })
      links =  links.concat(dynamicPages)
    } else {
      store.dispatch('mes/initializeMobilityProperties')
    }
    var pages = []
    if (workCenter)  {
      pages = links.sort((a,b) => {
        return a.sort > b.sort ? 1 : (a.sort == b.sort ? 0 : -1)
      }).filter(l => l.text
        && (l.path || l.params)
        && l.meta ? scope.$acl.check(l.meta.rule) : false)
    }
    return pages
  }
}
