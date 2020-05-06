<template>
  <v-app>

    <notify/>
    <pre-loader/>
    <the-side-bar/>
    <the-nav-bar/>

    <v-content class="grey lighten-3">
      <v-container fluid style="height: 100%"
                   class="d-flex flex-column pa-2">
        <router-view/>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
import Notify from '@/components/Notify'
import PreLoader from '@/components/PreLoader'
import TheNavBar from './components/Navbar/TheNavBar'
import TheSideBar from './components/Sidebar/TheSideBar'
import { userInfo, userMethods } from '@/mixins/user'
import { folders } from '@/mixins/units'

export default {
  name: 'Main',
  mixins: [userInfo, userMethods, folders],
  components: {
    Notify,
    PreLoader,
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
