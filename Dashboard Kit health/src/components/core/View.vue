<template>
  <v-content>
    <v-toolbar scroll-off-screen fixed dark :color="errorStatus ? 'error' :'none-error'">
      <v-toolbar-title class="white--text">
        {{header}}
        <!-- <i class="material-icons" >exit_to_app</i> -->
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="Exit">
        <v-icon >exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <div id="core-view">
      <v-fade-transition mode="out-in">
        <Dashboard/>
      </v-fade-transition>
    </div>
    <!-- <core-footer v-if="$route.name !== 'Maps'" /> -->
  </v-content>
</template>

<script>
import Dashboard from "../views/Dashboard.vue";
import moment from "moment";
export default {
  components: {
    Dashboard: Dashboard
  },
  data() {
    return {
      header: "Сводка здоровья проекта за " + moment().format("DD.MM.YYYY")
    };
  },
  metaInfo() {
    return {
      title: "Сводка здоровья проекта"
    };
  },
  methods: {
    Exit() {
      this.$store.dispatch("IsLogin", false);
      this.$store.dispatch("ErrorToday", false);
      sessionStorage.clear();
    }
  },
  computed: {
    errorStatus() {
      return this.$store.getters.getErrorToday;
    }
  }
};
</script>

<style scoped>
#core-view {
  padding-bottom: 100px;
}
.none-error {
  background-color: #008ffb !important;
}
.v-icon{
  font-size: 24px !important;
}

</style>
