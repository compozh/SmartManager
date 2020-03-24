<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <v-app-bar-nav-icon class="hidden-sm-and-down" v-on="on"
                          @click="sideBarOpen = !sideBarOpen">
        <fa-icon :icon="['fal', 'bars']" size="lg"/>
      </v-app-bar-nav-icon>
    </template>
    <span>
        {{ sideBarOpen ? $t('navBar.collapseSideBar') : $t('navBar.expandSideBar') }}
      </span>
  </v-tooltip>
</template>

<script>
import { sideBar } from '@/mixins/layout'

export default {
  name: 'SideBarBtn',
  mixins: [sideBar]
}
</script>

<style scoped>

</style>
