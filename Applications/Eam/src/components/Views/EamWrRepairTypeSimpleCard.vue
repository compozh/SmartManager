<template>
  <v-layout v-if="item" align-center fill-height>
    <v-icon left color="purple">category</v-icon>
    <span>{{item.name}}</span>
  </v-layout>
</template>

<script>
export default {
  name: 'eam-wr-repair-type-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
