<template>
  <v-app>
    <v-content class="layout--full-page">
      <div class="header--full-page d-flex align-center px-5"
           style="width: 100%">
        <v-img src="@/assets/it-logo.svg" contain max-width="120"/>
        <v-spacer/>
        <div class="justify-end">
          <lang-switcher/>
        </div>
      </div>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import LangSwitcher from '@/layouts/components/Navbar/LangSwitcher'
export default {
  name: 'FullPage',
  components: {
    LangSwitcher
  }
}
</script>

<style scoped>
  .layout--full-page {
    background: url(../assets/full-page-bg.svg) center bottom/cover no-repeat;
  }

  .header--full-page {
    position: fixed;
  }
</style>
