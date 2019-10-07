<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="blue">directions</v-icon>
    <span>{{item.name}}</span>
  </v-flex>
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
