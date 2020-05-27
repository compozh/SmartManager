<template>
  <div>
    <pre-loader/>
    <router-view/>
  </div>
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
