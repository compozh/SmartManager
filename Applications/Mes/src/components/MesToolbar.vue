<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">

      <!-- Лого -->
      <v-flex row v-if="!searchWorkCenter">
        <router-link tag="h1" :to="{ name:'home', path: '/'}">
          <a class="mes-title-link">MES</a>
        </router-link>
        <span v-if="properties && properties.brandName && $vuetify.breakpoint.mdAndUp" class="brand-name" @click="refreshApp">{{properties.brandName}}</span>
      </v-flex>

      <v-btn class="downtime-registration-button" v-if="$vuetify.breakpoint.smAndDown && !searchWorkCenter" icon  @click="changeDowntimesOverlayVisible" color="rgba(179, 2, 2, 0.81)">
        <v-icon>pause</v-icon>
      </v-btn>
      <!-- Состояние РЦ -->
      <v-tooltip :disabled="!workCenterFixationData.description" bottom 
        v-if="!searchWorkCenter && workCenterFixationData.state == 'DOWN_TIME' || workCenterFixationData.state == 'EMERGENCY'">
        <template v-slot:activator="{ on }"  class="work-center-state-tooltip">
          <v-icon large class="work-center-state" :color="workCenterFixationData.state == 'DOWN_TIME' ? 'error' : 'warning'" v-on="on">warning</v-icon>
        </template>
        <span v-html="workCenterFixationData.description"></span>
      </v-tooltip>

      <!-- Выпадающий лист с рабочими центрами для фиксации -->
      <div :class="$vuetify.breakpoint.mdAndUp ? 'work-centers-select' : 'work-centers-select-small'" 
        v-if="workCentersForWorker.length > 1">
        <span class='work-centers-title' v-if="$vuetify.breakpoint.mdAndUp">
          {{this.$t('mes.labels.WorkCenter')}}: 
        </span>
        <v-btn icon v-else-if="!searchWorkCenter" @click="searchWorkCenter = !searchWorkCenter">
          <v-icon>work_outline</v-icon>
        </v-btn>
        <v-autocomplete
          v-if="searchWorkCenter || $vuetify.breakpoint.mdAndUp"
          autocomplete="off"
          :items="workCentersForWorker"
          :value="workCenter ? workCenter : ''"
          item-text="name"
          return-object
          :no-data-text="this.$t('mes.labels.NoWorkCenter')"
          @change="changeWorkCenter"
          @blur="searchWorkCenter = false"
          :autofocus="$vuetify.breakpoint.smAndDown? true : false"
          :class="$vuetify.breakpoint.mdAndUp ? 'work-centers-select-input' : 'work-centers-select-input-small'" 
        ></v-autocomplete>
      </div>

      <!-- Зафиксированый РЦ -->
      <div class="work-centers-caption" v-if="!searchWorkCenter && workCenter && workCentersForWorker.length == 1">
        <span class='work-centers-title'>{{this.$t('mes.labels.WorkCenter')}}: </span>
        <span class='work-centers-name'>{{workCenter.name}}</span>
      </div>

      <!-- Информация Юзера -->
      <div class="user-info-desc" v-if="!searchWorkCenter && $vuetify.breakpoint.mdAndUp">
        <span class="user-info-text">
          {{currentUserData.UserName}}
        </span>
      </div>
      <!-- Панель Юзера -->
      <v-flex class="grow-0 user-description-block" v-if="!searchWorkCenter">
        <user-panel hideDelegatedRightsButton="true" mini="true" style="border: 1px solid silver">
          <v-btn v-if="$vuetify.breakpoint.smAndDown" icon>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </user-panel>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

import Vue from 'vue'
import Init from './components/Init'
import UuidHelper from './components/UuidHelper'

export default {
  name: 'mes-toolbar',
  components: { Init },
  created() {
    var init = new Init(),
      me = this
    init.initialize()
    init.initializeSignalR()
    Vue.prototype.$authentication.getCurrentUser().then(currentUSer => {
      me.currentUserData = currentUSer.CurrentUserData
    })
  },
  data() {
    return { 
      currentUserData: {},
      searchWorkCenter: false
    }
  },
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    workCenterFixationData() {
      return this.$store.getters['mes/workCenterFixationData']
    },
    workCentersForWorker() {
      return this.$store.getters['mes/workCentersForWorker']
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
    userName() {
      return Vue.prototype.$authentication.getCurrentUser()
    },
    tasksPageState() {
      return this.$store.getters['mes/tasksPageState']
    },
    ticket() {
      return this.$store.getters['mes/ticket']
    }
  },
  methods: {
    async changeWorkCenter(newWorkCenter) {
      if (!newWorkCenter) {
        return
      }
      this.$store.commit('mes/setInitialWorkCenter', false)
      this.$store.commit('mes/setDialogLinearLoaderMessage', 'Смена рабочего центра')
      const prevWorkCenterFixation =  await this.$store.dispatch('mes/getFixationWorkCenterForWorker', { workerCode: this.properties.workerCode, fetchPolicy: 'network-only' })
      if (prevWorkCenterFixation && prevWorkCenterFixation.length) {
        this.$store.commit('mes/resetState')
        await this.$store.dispatch('mes/unfixWorkCenterForWorker', { fixationId: prevWorkCenterFixation[0].fixationId })
      }
      await this.$store.dispatch('mes/fixWorkCenterForWorker', { workCenter: newWorkCenter, workerCode: this.properties.workerCode })
      this.$store.commit('mes/setWorkCenter', newWorkCenter)
      this.$store.commit('mes/closeDialogLinearLoader')
      this.$store.commit('mes/setInitialWorkCenter', true)
    },
    refreshApp() {
      this.$router.go()
    },
    changeDowntimesOverlayVisible() {
      this.$emit('changeDowntimesOverlayVisible')
    }
  }
}
</script>

<style scoped lang="scss">
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
  width: 150px;
}
.work-center-state {
  margin: 0 10px;
}
.work-center-state-tooltip {
  padding: 15px;
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
  min-width: 450px;
}

.work-centers-select-small {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}
.work-centers-select-input {
  margin: 0 5px;
  max-width: 330px;
}

.work-centers-select-input-small {
  min-width: 80vw;
  height: 32px;
}
.work-centers-select-input-small .v-text-field__details {
  height: 0;
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
  cursor: pointer;
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
.v-tooltip__content.menuable__content__active.v-tooltip__content--fixed {
  padding: 16px;
}
.downtime-registration-button {
  margin: 0;
  // min-width: 50px !important;
  // padding: 0 !important
}
</style>
