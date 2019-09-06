<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">
      <v-flex row>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a class="mes-title-link">MES</a>
        </router-link>
        <span v-if="properties && properties.brandName" class="brand-name">{{properties.brandName}}</span>
      </v-flex>
      <v-col class="work-centers-select" v-if="workCentersForWorker && workCentersForWorker.length > 1">
        <span class='work-centers-title'>Рабочий центр: </span>
        <v-autocomplete
          :items="workCentersForWorker"
          :value="workCenter ? workCenter : ''"
          item-text="name"
          return-object
          no-data-text="--- Рабочий центр отсутствует ---"
          @change="changeWorkCenter"
          class="work-centers-select-input"
        ></v-autocomplete>
      </v-col>
      <div class="work-centers-caption" v-if="workCenter && !workCentersForWorker.length">
        <span class='work-centers-title'>Рабочий центр: </span>
        <span class='work-centers-name'>{{workCenter.name}}</span>
      </div>
      <div class="user-info-desc">
        <span class="user-info-text">
          <!-- {{userInfo}} -->
          {{userName}}
        </span>
        <span class="user-info-text">
          <!-- {{userInfo}} -->
          Смена: Тест
        </span>
      </div>
      <v-flex class="grow-0 user-description-block">
        <user-panel hideDelegatedRightsButton="true" mini="true"></user-panel>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
export default {
  name: 'mes-toolbar',
  created() {
    this.initialize()
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
      return this.$store.getters['mes/userName']
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenter')
      await this.$store.dispatch('mes/initializeProperties')
      await this.$store.dispatch('mes/initializeUserName')
    },
    changeWorkCenter(newWorkCenter) {
      this.changeWorkCenterMethod(newWorkCenter)
    },
    async changeWorkCenterMethod(newWorkCenter) {
      await this.$store.dispatch('mes/initializeWorkCenterBySelection', newWorkCenter )
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
</style>
