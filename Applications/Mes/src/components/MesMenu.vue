<template>
  <v-list>

    <!-- Пункт меню -->
    <v-list-item v-for="route in links" :key="route.name" :to="{name:route.name}">
      <v-list-item-action @click="reloadPage(route)">
          <v-icon large>{{route.Image}}</v-icon>
          <v-icon class="reload-icon" :color='obsoleteData.tasks ? "#009975" : "#326DA8"' v-if="$route.name == route.name">refresh</v-icon>
      </v-list-item-action>

      <!-- Описание пункта меню -->
      <v-list-item-content  @click="reloadPage(route)">
        <v-list-item-title>{{ route.Name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>


  </v-list>
</template>
<script>
import Init from './components/Init'

export default {
  name: 'mes-menu',
  computed: {
    workCenter() {
      return this.$store.getters['mes/workCenter']
    },
    mobilityProperties() {
      return this.$store.getters['mes/mobilityProperties']
    },
    links() {
      return Init.prototype.preparePages(this)
    },
    obsoleteData() {
      return this.$store.getters['mes/obsoleteData']
    }
  },
  methods: {
    reloadPage(route) {
      if (this.$router.history.current.name != route.name) {
        return
      }
      this.$store.commit('mes/changeMainContainerKey')
    }
  }
}
</script>

<style>
  .v-list.theme--light a.v-list-item--active{
    color: #326DA8 !important;
    caret-color: #326DA8 !important;
  }
  .v-navigation-drawer__content .v-list-item__content {
    padding: 0;
    height: 100%;
  }
  .v-navigation-drawer__content .v-list-item__title {
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    font-weight: 500;
  }
  .v-navigation-drawer--mini-variant .v-list-item {
    justify-content: start;
  }
  .reload-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 19px !important;
    font-weight: 800;
  }
  .v-navigation-drawer__content .v-list .v-list-item__action {
    margin-right: 0;
  }
  .v-navigation-drawer__content .v-list-item__title {
    margin-left: 10px;
    margin-top: 5px;
  }
</style>
