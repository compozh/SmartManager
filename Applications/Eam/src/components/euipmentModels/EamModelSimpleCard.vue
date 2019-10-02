<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="lightgreen">aspect_ratio</v-icon>
    <span>{{`${item.name} (${item.id})`}}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-model-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
