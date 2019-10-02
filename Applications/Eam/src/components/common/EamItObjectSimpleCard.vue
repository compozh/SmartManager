<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="blue">home</v-icon>
    <span class="subheading mr-2">{{ item.name }}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-itobject-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
