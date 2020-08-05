<template>
  <v-tooltip right>
    <template #activator="{ on }">
      <v-app-bar-nav-icon v-on="on" small
                          :disabled="activeZoneId === 2"
                          @click="toggleSideBar">
        <fa-icon icon="bars" size="lg"/>
      </v-app-bar-nav-icon>
    </template>
    <span>
      {{ miniVariant ? $t('navBar.expandSideBar') : $t('navBar.collapseSideBar') }}
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
