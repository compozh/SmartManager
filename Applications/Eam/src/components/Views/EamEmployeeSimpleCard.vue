<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="orange">person</v-icon>
    <span>{{ item.fullName }}</span>
  </v-layout>
</template>

<script>
export default {
  name: "eam-employee-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
