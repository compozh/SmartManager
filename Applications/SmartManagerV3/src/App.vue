<template>
  <v-app>
    <pre-loader/>
    <router-view/>
  </v-app>
</template>

<script>
import PreLoader from '@/components/PreLoader'

export default {
  name: 'App',
  components: {
    PreLoader
  }
}
</script>

<style>
  html { overflow-y: auto !important; }
</style>
