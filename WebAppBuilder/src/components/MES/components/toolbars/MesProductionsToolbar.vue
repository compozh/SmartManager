<template>
    <v-layout row lg12 xs12 md12 sm12 wrap class="toolbar">
    </v-layout>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-production-toolbar"
}
</script>

<style type="text/css" scoped>
  .toolbar {
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 10px;
  }
  .toolbar.row {
    margin: 0;
  }
</style>
