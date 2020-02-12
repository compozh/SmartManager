<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed app :value="getDrawer">
      <router-view name="navigation-drawer" />
    </v-navigation-drawer>
    <v-toolbar app color="cyan" dark>
      <v-toolbar-side-icon @click.stop="reverseDrawer"></v-toolbar-side-icon>
      <router-view name="toolbar" />
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <v-footer class="flex-footer" app inset>
      <slot name="footer"></slot>
      <div v-if='$vuetify.breakpoint.mdAndDown'>
        <span v-if="todayLastUpdated" class="relevance-data-status">{{refreshed}} {{getLastUpdatedDateTime.Time}}</span>
        <span v-else-if="yesterdayLastUpdated" class="relevance-data-status">{{refreshed}} {{yesterday}} {{getLastUpdatedDateTime.Time}}</span>
        <span v-else class="relevance-data-status">{{refreshed}} {{getLastUpdatedDateTime.Date}}</span>
        </div>
    </v-footer>
  </v-app>
</template>
<script>
// @ is an alias to /src
var moment = require('moment')
import 'moment/locale/ru'

export default {
  name: 'skd-default-app',
  data: () => ({
    yesterday: 'Вчера',
    refreshed: 'Обновлено'
  }),
  computed: {
    getDrawer() {
      return this.$store.state.skd.drawer
    },
    getLastUpdatedDateTime() {
      return this.$store.getters['skd/getLastUpdatedDataTime']
    },
    todayLastUpdated() {
      return this.getLastUpdatedDateTime.Date == moment().format('DD-MM-YYYY')
    },
    yesterdayLastUpdated() {
      return this.getLastUpdatedDateTime.Date == moment(new Date()).add(-1,'days').format('DD-MM-YYYY') 
    }
  },
  methods: {
    reverseDrawer() {
      var value = this.getDrawer
      this.$store.commit('skd/setDrawer', !value)
    }
  }
}
</script>

<style scoped>
.flex-footer {
  display: flex;
  justify-content: center;
}
.relevance-data-status {
  font-size: 0.9em;
}
</style>