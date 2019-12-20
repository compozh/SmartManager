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
}