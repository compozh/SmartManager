<template>
  <div>
    <refresh-loader/>
    <pre-loader/>
    <router-view/>
  </div>
</template>

<script>
import PreLoader from '@/components/PreLoader'
import RefreshLoader from '@/components/RefreshLoader'

export default {
  name: 'App',
  components: {
    RefreshLoader,
    PreLoader
  }
}
</script>

<style>
  html { overflow-y: auto !important; }
</style>
