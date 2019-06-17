<template>
  <div>
    <h3>Учет заказов: {{ currentPage }}</h3>
  </div>
</template>
<script>
export default {
  name: 'test-toolbar',
  computed: {
    currentPage() {
      return this.$store.state.WebApps.appData.currentPage
    }
  }
}
</script>
