<template>
  <v-container>
    <v-layout column wrap>
      <v-flex class="button-toolbar">
        <mes-toolbar/>
      </v-flex>
      <v-flex style="max-height: 400px"
      class="scroll-y"
      >
        <mes-element/>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-container",

  methods: {

      // onScroll (e) {
      //   this.offsetTop = e.target.scrollTop
      // }
  },
}
</script>
<style type="text/css" scoped>
  .button-toolbar {
    height: 65px;
  }
</style>