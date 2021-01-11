<template>
  <v-app>
    <notify/>
    <v-main class="layout--full-page">
      <div class="header--full-page d-flex align-center pa-4"
           style="width: 100%">
        <v-img src="@/assets/images/it-logo.svg" contain max-width="150"/>
        <v-spacer/>
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
  }
}
</script>

<style scoped>
  .layout--full-page {
    background: url(../assets/images/full-page-bg.svg) center bottom/cover no-repeat;
  }

  .header--full-page {
    position: fixed;
  }
</style>
