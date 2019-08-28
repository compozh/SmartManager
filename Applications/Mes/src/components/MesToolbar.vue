<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">
      <v-flex>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a class="mes-title-link">MES</a>
        </router-link>
      </v-flex>
      <v-spacer></v-spacer>
      <v-col class="work-centers-select" v-if="workCentersForWorker && workCentersForWorker.length > 1">
        <span class='work-centers-title'>Рабочий центр: </span>
        <v-select
          :items="workCentersForWorker"
          :value="workCenter ? workCenter : ''"
          item-text="name"
          return-object
          @change="changeWorkCenter"
          class="work-centers-select-input"
        ></v-select>
      </v-col>
      <div class="work-centers-caption" v-if="workCenter && !workCentersForWorker.length">
        <span class='work-centers-title'>Рабочий центр: </span>
        <span class='work-centers-name'>{{workCenter.name}}</span>
      </div>
      <v-flex class="grow-0">
        <user-panel mini="true"></user-panel>
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
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenter')
    },
    changeWorkCenter(newWorkCenter) {
      this.changeWorkCenterMethod(newWorkCenter)
    },
    async changeWorkCenterMethod(newWorkCenter) {
      await this.$store.dispatch('mes/initializeProperties')
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
}
.work-centers-select-input {
  max-width: 300px;
  margin: 0 5px;
}
</style>
