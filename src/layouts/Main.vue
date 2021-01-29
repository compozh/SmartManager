<template>
  <v-app>
    <notify/>
    <the-side-bar/>
    <the-nav-bar/>

    <!-- Main app container -->
    <v-main class="grey lighten-3">
      <v-container fluid style="height: 100%"
                   class="d-flex flex-column pa-2 pb-0">
        <router-view/>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import Notify from '@/components/Notify'
import TheNavBar from './components/Navbar/TheNavBar'
import TheSideBar from './components/Sidebar/TheSideBar'
import { userInfo, userMethods } from '@/mixins/users'
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
