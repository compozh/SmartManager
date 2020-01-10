<template>
  <v-list>

    <!-- Лого -->
    <v-list-item row v-if="$vuetify.breakpoint.smAndDown" class="logo">
      <router-link tag="h1" :to="{ name:'home', path: '/', query : {fixedUuid: $route.query.fixedUuid}}">
        <a class="mes-title-link">MES</a>
      </router-link>
      <span v-if="properties && properties.brandName" class="brand-name" @click="refreshApp">{{properties.brandName}}</span>
    </v-list-item>

    <!-- Пункт меню -->
    <v-list-item v-for="(route, i) in links" :key="route.id + i"  @click="toggleMenuMode"
      :to="{ name: route.id, params: route.name == 'DYNAMIC'?  { id:  route.params} : {}, query : {fixedUuid: $route.query.fixedUuid}}">
      <v-list-item-action @click="reloadPage(route)">
        <v-icon large>{{route.image}}</v-icon>
        <v-icon class="reload-icon" :color='obsoleteData.tasks ? "#009975" : "#326DA8"' >refresh</v-icon>
      </v-list-item-action>

      <!-- Описание пункта меню -->
      <v-list-item-content  @click="reloadPage(route)">
        <v-list-item-title style="white-space: normal;">{{ route.name == 'DYNAMIC'? route.text : $t(route.text) }}</v-list-item-title>
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
    },
    properties() {
      return this.$store.getters['mes/properties']
    },
  },
  methods: {
    reloadPage(route) {
      if (this.$router.history.current.name != route.id) {
        return
      }
      this.$store.commit('mes/changeMainContainerKey')
    },
    refreshApp() {
      this.$router.go()
    },
    toggleMenuMode() {
      this.$vuetify.breakpoint.smAndDown ? 
      this.$store.commit('mes/setMenuDrawerMode', false) :
      this.$store.commit('mes/setMenuMiniMode', true)
    },
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
    text-align: start;
    font-size: 14px;
    /* height: 24px; */
    line-height: 24px;
    font-weight: 500;
  }
  .v-navigation-drawer--mini-variant .v-list-item {
    justify-content: start;
  }
  .v-list-item .reload-icon {
    display: none;
  }
  .v-list-item--active .reload-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 19px !important;
    font-weight: 800;
    display: block;
  }
  
  .v-navigation-drawer__content .v-list .v-list-item__action {
    margin-right: 0;
  }
  .v-navigation-drawer__content .v-list-item__title {
    margin-left: 10px;
    margin-top: 5px;
  }

.brand-name {
  align-self: center;
  padding: 0 10px;
  color: #326da8;
  font-size: 30px;
  font-weight: 700;
  cursor: pointer;
}
h1 {
  font-size: 30px;
  text-align: left;
  white-space: nowrap;
}

a {
  text-decoration: none;
}


.mes-title-link {
  color: #326da8 !important;
}

.logo {
  border-bottom: 1px solid silver;
  height: 70px;
}
</style>