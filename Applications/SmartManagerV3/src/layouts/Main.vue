<template>
  <v-content class="grey lighten-3">
    <notify/>
    <the-side-bar/>
    <the-nav-bar/>
    <router-view class="pa-2"/>
  </v-content>
</template>

<script>
import Notify from '@/components/Notify'
import TheNavBar from './components/Navbar/TheNavBar'
import TheSideBar from './components/Sidebar/TheSideBar'
import { userInfo, userMethods } from '@/mixins/user'
import { folders } from '@/mixins/units'

export default {
  name: 'Main',
  mixins: [userInfo, userMethods, folders],
  components: {
    Notify,
    TheNavBar,
    TheSideBar
  },
  data: () => ({
    search: ''
  }),
  created () {
    this.getApplicationParams()
    this.user || this.setUserData()
    this.getFolders()
  },
  methods: {
    getApplicationParams () {
      this.$store.dispatch('getApplicationParams')
    }
  }
}
</script>

<style scoped>

</style>
