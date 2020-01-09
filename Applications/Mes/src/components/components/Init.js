import Vue from 'vue'
import store from '@/store'
import router from '@/router'
import cookies from 'vue-cookies'
import UuidHelper from './UuidHelper'

export default class Init {
    initialize() {
        var fixedUuid = router.options.params.fixedUuid,
            cookiesUuid = cookies.get('mesUuid'),
            sessionStorageUuid = window.sessionStorage.getItem('mesUuid'),
            uuid

        if (fixedUuid) {
            uuid = fixedUuid
        } else if (cookiesUuid) {
            uuid = cookiesUuid
            router.push({ query: { fixedUuid: uuid }})
        } else if (sessionStorageUuid) {
            uuid = sessionStorageUuid
            router.push({ query: { fixedUuid: uuid }})
        } else {
            uuid = UuidHelper.generate()
            router.push({ query: { fixedUuid: uuid }})
        }
        // eslint-disable-next-line
        cookies.set('mesUuid', uuid, '3y')
        window.sessionStorage.setItem('mesUuid', uuid)
        store.dispatch('mes/initializeWorkCenter', uuid)
        store.dispatch('mes/initializeProperties')
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

      preparePages(scope) {
        
        let dynamic  = store.getters['mes/mobilityProperties']
        let links = router.options.routes[0].children

        if ( dynamic ) {
           var dynamicPages = []
           dynamic.processesProperties.forEach(page => {
            let child = {}
            child.name = 'DYNAMIC'
            child.params = page.id.toLowerCase()
            child.path = 'dynamic'
            child.id = 'DYNAMIC'
            child.text = page.name
            child.sort = 100
            child.image = 'description'
            dynamicPages.push(child)
        })
          links =  links.concat(dynamicPages)
        }

        var pages = []
        for (let page of links) {
          if (store.getters['mes/workCenter'])  {
            switch (store.getters['mes/workCenter'].accessPages) {
            case 'ALL_PAGES':
              pages.push(page)
              break
            case 'ONLY_INSTALLATION':
              if (page.id == 'INSTALLATIONS') {
                pages.push(page)
                if(page.name != scope.$route.name && scope.$route.name != 'ERROR' ) {
                  router.replace({path: page.path})
                }
              }
              break
            case 'ONLY_QUALITY':
              if (page.id == 'QUALITY') {
                if(page.name != scope.$route.name && scope.$route.name != 'ERROR' ) {
                  router.replace({path: page.path})
                }
                pages.push(page)
              }
              break
            }
          }
        }

        pages = pages.sort((a,b) => {
          return a.sort > b.sort ? 1 : (a.sort == b.sort ? 0 : -1)
        })
        return pages.filter(l => l.text && (l.path || l.params))
      }
}
