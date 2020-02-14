<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed app v-model="drawer">
      <router-view name="navigation-drawer" />
    </v-navigation-drawer>
    <v-toolbar v-if="$vuetify.breakpoint.mdAndDown" scroll-off-screen app color="cyan" dark>
        <v-toolbar-side-icon @click="reverseDrawer"></v-toolbar-side-icon>
        <router-view name="toolbar" />
      </v-toolbar>
      <v-toolbar v-else app color="cyan" dark>
        <v-toolbar-side-icon @click="reverseDrawer"></v-toolbar-side-icon>
        <router-view name="toolbar" />
      </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <v-footer app inset>
      <slot name="footer"></slot>
      <v-flex v-if="$vuetify.breakpoint.mdAndDown" class="relevance-data-status">
        <span v-if="todayLastUpdated">{{refreshed}} {{getLastUpdatedDateTime.Time}}</span>
        <span
          v-else-if="yesterdayLastUpdated"
        >{{refreshed}} {{yesterday}} {{getLastUpdatedDateTime.Time}}</span>
        <span v-else>{{refreshed}} {{getLastUpdatedDateTime.Date}}</span>
      </v-flex>
      <v-flex xs2 class="btn-refresh-container">
        <v-btn v-if="$vuetify.breakpoint.mdAndDown" icon v-on:click="fetchUsers">
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-flex>
    </v-footer>
  </v-app>
</template>
<script>
// @ is an alias to /src
var moment = require("moment");
import "moment/locale/ru";

export default {
  name: "skd-default-app",
  data: () => ({
    yesterday: "Вчера",
    refreshed: "Обновлено"
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.getters["skd/getDrawer"];
      },
      set(value) {
        this.$store.commit("skd/setDrawer", value);
      }
    },
    getLastUpdatedDateTime() {
      return this.$store.getters["skd/getLastUpdatedDataTime"];
    },
    todayLastUpdated() {
      return this.getLastUpdatedDateTime.Date == moment().format("DD-MM-YYYY");
    },
    yesterdayLastUpdated() {
      return (
        this.getLastUpdatedDateTime.Date ==
        moment(new Date())
          .add(-1, "days")
          .format("DD-MM-YYYY")
      );
    }
  },
  methods: {
    reverseDrawer() {
      this.drawer = !this.drawer;
    },
    fetchUsers() {
      this.$store.dispatch("skd/getUsers");
    }
  }
};
</script>

<style scoped>
.relevance-data-status {
  padding-left: 10px;
  font-size: 0.95em;
}
</style>