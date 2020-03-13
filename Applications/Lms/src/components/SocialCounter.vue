<template>
  <v-layout nowrap px-2 py-2>
    <v-flex shrink>
      <v-icon @click="$emit('socialchange')" :color="iconColor">{{icon}}</v-icon>
    </v-flex>
    <v-flex shrink pl-2>
      <span :class="voutsColor">{{vouts}}</span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'social-counter',
  props: {
    icon: {
      type: String,
      default: 'comment'
    },
    vouts: {
      type: Number,
      default: 0
    },
    iconColor: {
      type: String,
      default: 'info'
    },
    voutsColor: {
      type: String,
      default: 'blue--text text-darken-1'
    }
  }
}
</script>

<style>

</style>
