<template>
  <v-app-bar app flat dense color="white">

    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-app-bar-nav-icon class="hidden-sm-and-down" v-on="on"
                            @click="sideBarOpen = !sideBarOpen">
          <v-icon small>fas fa-bars</v-icon>
        </v-app-bar-nav-icon>
      </template>
      <span>
        {{ sideBarOpen ? $t('navBar.collapseSideBar') : $t('navBar.expandSideBar') }}
      </span>
    </v-tooltip>

    <v-breadcrumbs :items="items" class="hidden-md-and-down">
      <template v-slot:divider>
        <v-icon x-small>fas fa-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-spacer></v-spacer>

    <search-field/>

    <v-menu close-on-click
            close-on-content-click
            offset-y
            transition="scroll-y-transition">

      <template v-slot:activator="{ on }">
        <v-avatar v-on="on" color="primary" class="ml-4" size="35px">
          <v-icon dark>fas fa-user-tie</v-icon>
        </v-avatar>
      </template>

      <v-list dense nav>
        <v-list-item v-for="item in 5" :key="item">
          <v-list-item-title>Menu item {{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <lang-switcher/>

  </v-app-bar>
</template>

<script>
import LangSwitcher from './LangSwitcher'
import SearchField from './SearchField'
import { sideBar } from '@/mixins/layout'

export default {
  name: 'TheNavBar',
  mixins: [sideBar],
  components: {
    LangSwitcher,
    SearchField
  },
  data: () => ({
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        href: 'breadcrumbs_dashboard'
      },
      {
        text: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1'
      },
      {
        text: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2'
      }
    ]
  })
}
</script>

<style scoped>

</style>
