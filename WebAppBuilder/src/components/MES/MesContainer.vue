<template>
  <v-container>
    <v-layout row wrap xs4>
      <v-flex>
        <v-card>
          <mes-spans/>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card class="button-toolbar">
          <mes-toolbar/>
          <mes-content/>
        </v-card>
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