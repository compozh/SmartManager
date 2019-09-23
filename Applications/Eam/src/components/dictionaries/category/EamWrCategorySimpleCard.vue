<template>
  <v-flex v-if="item" shrink>
    <v-icon left color="purple">category</v-icon>
    <span>{{item.name}}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-wr-category-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
