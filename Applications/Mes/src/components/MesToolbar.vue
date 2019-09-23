<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">
      <v-flex row>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a class="mes-title-link">MES</a>
        </router-link>
        <span v-if="properties && properties.brandName" class="brand-name">{{properties.brandName}}</span>
      </v-flex>
      <v-col class="work-centers-select" v-if="workCentersForWorker.length > 1">
        <span class='work-centers-title'>Рабочий центр: </span>
        <v-autocomplete
          autocomplete="off"
          :items="workCentersForWorker"
          :value="workCenter ? workCenter : ''"
          item-text="name"
          return-object
          no-data-text="--- Рабочий центр отсутствует ---"
          @change="changeWorkCenter"
          class="work-centers-select-input"
        ></v-autocomplete>
      </v-col>
      <div class="work-centers-caption" v-if="workCenter && workCentersForWorker.length == 1">
        <span class='work-centers-title'>Рабочий центр: </span>
        <span class='work-centers-name'>{{workCenter.name}}</span>
      </div>
      <div class="user-info-desc">
        <span class="user-info-text">
          <!-- {{userInfo}} -->
          {{currentUserData.UserName}}
        </span>
        <!-- <span class="user-info-text">
          Смена: Тест
        </span> -->
      </div>
      <v-flex class="grow-0 user-description-block">
        <user-panel hideDelegatedRightsButton="true" mini="true"></user-panel>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>

import Vue from 'vue'
export default {
  name: 'mes-toolbar',
  created() {
    let me = this,
      fixedUuid = me.$router.options.params.fixedUuid,
      cookiesUuid = me.$cookies.get('mesUuid'),
      sessionStorageUuid = window.sessionStorage.getItem('mesUuid'),
      uuid
    if (fixedUuid) {
      uuid = fixedUuid
    } else if (cookiesUuid) {
      uuid = cookiesUuid
      me.$router.push({ query: { fixedUuid: uuid }})
    } else if (sessionStorageUuid) {
      uuid = sessionStorageUuid
      me.$router.push({ query: { fixedUuid: uuid }})
    } else {
      uuid = this.generateUUID()
      me.$router.push({ query: { fixedUuid: uuid }})
    }
    // eslint-disable-next-line
    $cookies.set('mesUuid', uuid, '3y')
    window.sessionStorage.setItem('mesUuid', uuid)
    me.$store.dispatch('mes/initializeWorkCenter', uuid)
    me.$store.dispatch('mes/initializeProperties')
    Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
      me.currentUserData = currentUSer.CurrentUserData
    })
  },
  data() {
    return { currentUserData: {} }
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    workCentersForWorker() {
      return this.$store.getters['mes/workCentersForWorker']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    userName() {
      return Vue.prototype.$authentication.getCurrentUser()
    }
  },
  methods: {
    async changeWorkCenter(newWorkCenter) {
      if (!newWorkCenter) {
        return
      }
      this.$store.commit('mes/setInitialWorkCenter', false)
      this.$store.commit('mes/setDialogLinearLoaderMessage', 'Смена рабочего центра')

      const workCentersFixed =  await this.$store.dispatch('mes/getFixationWorkCenterForWorker', { workerCode: this.properties.workerCode, fetchPolicy: 'network-only' })
      var currentWorkCetnerFixation = false
      if (this.workCenter) {
        for (let fixation of workCentersFixed) {
          if (fixation.code == newWorkCenter.code) {
            currentWorkCetnerFixation = true
          }
        }
      }

      this.$store.commit('mes/resetState')
      if (!currentWorkCetnerFixation) {
        await this.$store.dispatch('mes/fixWorkCenterForWorker', { workCenter: newWorkCenter, workerCode: this.properties.workerCode })
      } else {
        this.$store.commit('mes/setWorkCenter', newWorkCenter)
      }
      this.$store.commit('mes/closeDialogLinearLoader')
      this.$store.commit('mes/setInitialWorkCenter', true)
    },
    generateUUID() { // Public Domain/MIT
      var d = new Date().getTime()
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now() //use high-precision timer if available
      }
      var newGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })

      return newGuid
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 30px;
  text-align: left;
  white-space: nowrap;
}

a {
  text-decoration: none;
}

.grow-0 {
  flex-grow: 0 !important;
}
.mes-title-link {
  color: #326DA8;
}
.main-toolbar.row {
  margin: 0;
}
.work-centers-caption {
  padding: 0 10px;
}
.work-centers-title {
  font-size: 16px;
  font-weight: 500;
  color: #326DA8;
  width: 120px;
}
.work-centers-name {
  font-size: 14px;
  font-weight: 500;
  overflow-wrap: break-word;
}
.work-centers-select {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 10;
}
.work-centers-select-input {
  margin: 0 5px;
  max-width: 330px;
}
.work-centers-select-input .v-input__control {
  width: inherit;
}
.brand-name {
  align-self: center;
  padding: 0 10px;
  color: #326da8;
  font-size: 30px;
  font-weight: 700;
}
.user-info-desc {
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 3px 5px 0px 5px;
}
.user-info-name {
  display: flex;
  font-size: 14px;
  color: #326da8;
  font-weight: 500;
  line-height: 12px;
}
.user-info-text {
  display: flex;
  font-size: 14px;
  color: #326da8;
  font-weight: 500;
}
.router-link-active {
  padding-left: 5px;
}
</style>
