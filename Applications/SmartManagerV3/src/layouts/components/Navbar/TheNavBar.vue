<template>
  <v-app-bar app flat dense color="white">

    <side-bar-btn/>

    <bread-crumb/>

    <v-spacer/>

    <search-field/>

    <user-panel/>

    <lang-switcher/>

  </v-app-bar>
</template>

<script>
import SideBarBtn from './SideBarBtn'
import BreadCrumb from './BreadCrumb'
import LangSwitcher from './LangSwitcher'
import UserPanel from './UserPanel'
import SearchField from './SearchField'

export default {
  name: 'TheNavBar',
  components: {
    SideBarBtn,
    BreadCrumb,
    LangSwitcher,
    UserPanel,
    SearchField
  }
}
</script>

<style scoped>

</style>
