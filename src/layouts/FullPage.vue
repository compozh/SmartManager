<template>
  <v-app>
    <notify/>
    <v-main class="layout--full-page">
      <div class="header--full-page d-flex align-center pa-4"
           style="width: 100%">

        <!-- Master logo -->
        <v-img v-if="iconset === 'Master'"
               src="@/assets/icons/master-logo.svg"
               contain max-width="150"/>

        <!-- It-interprise logo -->
        <v-img v-else
               src="@/assets/images/it-logo.svg"
               contain max-width="150"/>

        <v-spacer/>

        <!-- Lang switcher -->
        <div class="justify-end">
          <lang-switcher/>
        </div>

      </div>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Notify from '@/components/Notify'
import LangSwitcher from '@/layouts/components/Navbar/LangSwitcher'

export default {
  name: 'FullPage',
  components: {
    Notify,
    LangSwitcher
  },
  computed: {
    iconset () {
      return window.appConfig.iconset
    }
  }
}
</script>
