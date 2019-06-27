<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="green">healing</v-icon>
    <span>{{ item.name }}</span>
  </v-layout>
</template>

<script>
export default {
  name: "eam-failure-reason-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
