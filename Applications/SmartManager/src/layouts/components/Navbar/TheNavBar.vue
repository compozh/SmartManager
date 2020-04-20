<template>
  <v-app-bar app flat dense color="white">

    <side-bar-btn/>

    <breadcrumb/>

    <v-spacer/>

    <user-panel/>

    <lang-switcher/>

  </v-app-bar>
</template>

<script>
import SideBarBtn from './SideBarBtn'
import Breadcrumb from './Breadcrumb'
import LangSwitcher from './LangSwitcher'
import UserPanel from './UserPanel'
import { zones, folders, tasks } from '@/mixins/units'

export default {
  name: 'TheNavBar',
  mixins: [zones, folders, tasks],
  components: {
    SideBarBtn,
    Breadcrumb,
    LangSwitcher,
    UserPanel
  }
}
</script>
