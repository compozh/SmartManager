<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="cyan">center_focus_weak</v-icon>
    <span>{{ item.name }}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-techplace-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
