<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="yellow">flash_on</v-icon>
    <span>{{ item.name }}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-failure-type-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
