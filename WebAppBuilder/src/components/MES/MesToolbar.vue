<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen class="main-toolbar">
      <v-flex>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a>MES</a>
        </router-link>
      </v-flex>
      <v-spacer></v-spacer>
      <div class="work-centers-caption" v-if="workCenters && workCenters.length">
        <span class='work-centers-title'>Рабочий центр: </span>
        <span class='work-centers-name'>{{workCenters[0].name}}</span>
      </div>
      <v-flex class="grow-0">
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
export default {
  name: "mes-toolbar",
  created() {
    this.initialize();
  },
  computed: {
    workCenters() {
        return this.$store.getters['mes/workCenters'];
    }
  },
  methods: {
    async initialize() {
      await this.$store.dispatch('mes/initializeWorkCenters', { uuid: "QU9V0+AJ26LAGNLFGXLKIK6NM322NQSQ82EQ8PINQJ4=" });
    }
  }
};
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

.main-toolbar.row {
  margin: 0;
}
.work-centers-caption {
  padding: 0 10px;
}
.work-centers-title {
  font-size: 16px;
  font-weight: 500;
  color: #1976d2;
}
.work-centers-name {
  font-size: 14px;
  font-weight: 500;
  overflow-wrap: break-word;
}
</style>