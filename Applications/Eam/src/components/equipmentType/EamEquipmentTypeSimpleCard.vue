<template>
  <v-flex v-if="item" shrink>
    <v-icon left>control_camera</v-icon>
    <span>{{item.name}}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-equipment-type-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
