<template>
  <v-app-bar app flat dense color="white">

    <v-app-bar-nav-icon class="hidden-sm-and-down"
        @click="sideBarOpen = !sideBarOpen">
      <v-icon small>fas fa-bars</v-icon>
    </v-app-bar-nav-icon>

    <v-breadcrumbs :items="items" class="hidden-md-and-down">
      <template v-slot:divider>
        <v-icon x-small>fas fa-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>

    <v-spacer></v-spacer>

    <search-field/>

    <v-btn icon>
      <v-icon small>fas fa-lock</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon small>fas fa-list</v-icon>
    </v-btn>

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
