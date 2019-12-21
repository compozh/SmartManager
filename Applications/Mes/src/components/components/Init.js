import Vue from 'vue'
import store from '@/store'
import  { routerDependencies } from '@/router'
import cookies from 'vue-cookies'
import UuidHelper from './UuidHelper'
import signalR from '@/signalR'

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
        signalR.connect('HUBBER', window.myConfig.SignalRUrl, this.applySignalR, store.getters['mes/ticket'])
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
}