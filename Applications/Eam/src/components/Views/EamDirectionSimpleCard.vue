<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="cyan">directions</v-icon>
    <span>{{ item.name }}</span>
  </v-layout>
</template>

<script>
export default {
  name: "eam-direction-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
