<template>
  <v-flex v-if="item" shrink>
    <v-icon class="mr-1" color="lightgreen">reorder</v-icon>
    <router-link :to="{ name: 'EAMEQUIPMENTINFO', params: { id: item.id }}">
      <a>{{item.fullName ? item.fullName : item.name}}</a>
    </router-link>
  </v-flex>
</template>

<script>
export default {
  name: 'eam-equipment-simple-card',
  props: {
    item: Object
  }
}
</script>

<style>
</style>
