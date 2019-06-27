<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="lightgreen">reorder</v-icon>
    <span>{{ item.name }}</span>
  </v-layout>
</template>

<script>
export default {
  name: "eam-equipment-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
