<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="cyan">line_style</v-icon>
    <span>{{ item.name }}</span>
  </v-layout>
</template>

<script>
export default {
  name: 'eam-techplace-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
