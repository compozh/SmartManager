<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <v-app-bar-nav-icon class="hidden-sm-and-down" v-on="on"
                          small
                          :disabled="activeZoneId === 2"
                          @click="toggleSideBar">
        <fa-icon icon="bars" size="lg"/>
      </v-app-bar-nav-icon>
    </template>
    <span>
      {{ sideBarOpen ? $t('navBar.collapseSideBar') : $t('navBar.expandSideBar') }}
    </span>
  </v-tooltip>
</template>

<script>
import { sideBar } from '@/mixins/layout'
import { zones } from '@/mixins/units'

export default {
  name: 'SideBarBtn',
  mixins: [sideBar, zones]
}
</script>

<style scoped>

</style>
