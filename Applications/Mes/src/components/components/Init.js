import Vue from 'vue'
import store from '@/store'
import  { routerDependencies } from '@/router'
import cookies from 'vue-cookies'
import UuidHelper from './UuidHelper'

export default class Init {
    initialize() {
        var router = routerDependencies.router,
            fixedUuid = router.options.params.fixedUuid,
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
        if (!store.state.WebApps.applicationDescription || !store.getters['mes/mobilityProperties']) {
          return []
        }

        const app = store.state.WebApps.applicationDescription
        const sections = app.Sections || []
        var links = []
        for (let index = 0; index < sections.length; index++) {
          const section = sections[index]
          links = links.concat(
            (section.Routes || []).map(r => (r.section = section) && r)
          )
        }
        var dynamicPagesWithKey = []
        store.getters['mes/mobilityProperties'].processesProperties.forEach(page => {
           dynamicPagesWithKey[('_' + page.id).toLowerCase()] = page
        })
        var pages = []
        for (let page of links[1].Children) {
          if (store.getters['mes/workCenter'])  {
            switch (store.getters['mes/workCenter'].accessPages) {
            case 'ALL_PAGES':
              let component = page.Components[0],
                pageId = page.Id.toLowerCase()
              if (component && component.Name == "mes-dynamic-page" && !dynamicPagesWithKey[pageId]) {
                continue
              }
              let dynamicPage = dynamicPagesWithKey[pageId]
              if (dynamicPage) {
                page.Name = dynamicPage.name
                page.Image = dynamicPage.image || 'description'
                page.Sort = 100
              }
              pages.push(page)
              break
            case 'ONLY_INSTALLATION':
              if (page.Id == 'INSTALLATIONS') {
                pages.push(page)
              }
              break
            case 'ONLY_QUALITY':
              if (page.Id == 'QUALITY') {
                pages.push(page)
              }
              break
            }
          }
        }

        if (store.getters['mes/workCenter'] && scope.$route.path.replace('/', '').toLowerCase() == 'mes') {
          var pagePath = ''
          switch (store.getters['mes/workCenter'].accessPages) {
          case 'ALL_PAGES':
            pagePath = '/MES/tasks'
            break
          case 'ONLY_INSTALLATION':
            pagePath = '/MES/installations'
            break
          case 'ONLY_QUALITY':
            pagePath = '/MES/quality'
            break
          }
          routerDependencies.router.replace({path: pagePath})
        }
        pages = pages.sort((a,b) => {
          return a.Sort > b.Sort ? 1 : (a.Sort == b.Sort ? 0 : -1)
        })

        links = links.concat(pages)
        return links.filter(l => l.Name && l.Path)
      }
}
