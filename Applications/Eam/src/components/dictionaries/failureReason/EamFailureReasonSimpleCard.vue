<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="green">healing</v-icon>
    {{ item.name }}
  </v-flex>
</template>

<script>
export default {
  name: 'eam-failure-reason-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
