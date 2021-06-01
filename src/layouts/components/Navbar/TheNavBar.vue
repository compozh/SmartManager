<template>
  <v-app-bar app flat dense color="white"
             style="border-bottom: 1px solid #E0E0E0 !important;">

    <side-bar-btn/>

    <breadcrumb/>

    <v-spacer/>

    <user-panel/>

    <lang-switcher/>

    <linear-pre-loader/>

  </v-app-bar>
</template>

<script>
import SideBarBtn from './SideBarBtn'
import Breadcrumb from './Breadcrumb'
import UserPanel from './user-panel/UserPanel'
import LangSwitcher from './LangSwitcher'
import LinearPreLoader from './LinearPreLoader'
import { zones, folders, tasks } from '@/mixins/units'

export default {
  name: 'TheNavBar',
  mixins: [zones, folders, tasks],
  components: {
    SideBarBtn,
    Breadcrumb,
    UserPanel,
    LangSwitcher,
    LinearPreLoader
  }
}
</script>
