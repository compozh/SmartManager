<template>
  <v-app-bar app flat dense color="white">

    <side-bar-btn/>

    <v-spacer/>

    <search-field/>

    <user-panel/>

    <lang-switcher/>

  </v-app-bar>
</template>

<script>
import SideBarBtn from './SideBarBtn'
import LangSwitcher from './LangSwitcher'
import UserPanel from './UserPanel'
import SearchField from './SearchField'

export default {
  name: 'TheNavBar',
  components: {
    SideBarBtn,
    LangSwitcher,
    UserPanel,
    SearchField
  }
}
</script>
