<template>
  <v-layout v-if="item" align-center fill-height>
    <v-icon left>control_camera</v-icon>
    <span>{{item.name}}</span>
  </v-layout>
</template>

<script>
export default {
  name: "eam-equipment-type-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
