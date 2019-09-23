<template>
  <v-layout v-if="item" align-center fill-height>
    <v-icon left color="blue">directions</v-icon>
    <span>{{item.name}}</span>
  </v-layout>
</template>

<script>
export default {
  name: 'eam-wr-direction-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
