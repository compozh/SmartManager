<template>
  <div>
    <refresh-loader/>
    <pre-loader/>
    <router-view/>
  </div>
</template>

<script>
const PreLoader = () => import('@/components/PreLoader')
const RefreshLoader = () => import('@/components/RefreshLoader')

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
