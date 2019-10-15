<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="purple">local_laundry_service</v-icon>
    {{item.name}}
  </v-flex>
</template>

<script>
export default {
  name: 'work-center-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
