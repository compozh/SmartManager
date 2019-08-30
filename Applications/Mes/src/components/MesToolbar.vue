<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">
      <v-flex row>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a class="mes-title-link">MES</a>
        </router-link>
        <span v-if="brandName" class="brand-name">{{brandName}}</span>
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
    },
    brandName() {
      let props = this.$store.dispatch('mes/initializeProperties')
      return props.brandName
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
  /* flex-grow: 10; */
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
  padding: 0 20px;
  color: #a00101de;
  font-size: 30px;
  font-weight: 500;
}
</style>
