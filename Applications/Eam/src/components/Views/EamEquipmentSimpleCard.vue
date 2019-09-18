<template>
  <v-layout align-center class="subheading font-weight-light" v-if="item">
    <v-icon class="mr-1" color="lightgreen">reorder</v-icon>
    <router-link :to="{ name: 'EAMEQUIPMENTINFO', params: { id: item.id }}">
      <a>{{item.id}}</a>
    </router-link>
  </v-layout>
</template>

<script>
export default {
  name: "eam-equipment-simple-card",
  props: {
    item: Object
  }
};
</script>

<style>
</style>
