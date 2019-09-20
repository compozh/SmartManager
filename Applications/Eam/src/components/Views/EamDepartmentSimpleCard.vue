<template>
  <v-layout v-if="item">
    <v-icon class="mr-1" color="teal">domain</v-icon>
    <span wrap class="subheading mr-2">{{ item.name }}</span>
  </v-layout>
</template>

<script>
export default {
  name: 'eam-department-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
