<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" :color="color">{{icon}}</v-icon>
    <span>{{ item.fullName }}</span>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-employee-simple-card',
  props: {
    item: Object,
    color: {
      type: String,
      default: 'orange'
    },
    icon: {
      type: String,
      default: 'person'
    }
  }
}
</script>

<style>
</style>
