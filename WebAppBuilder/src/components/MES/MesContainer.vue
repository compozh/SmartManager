<template>
  <v-container>
    <v-layout row wrap >
      <v-flex xs4>
        <v-card>
          <mes-spans/>
        </v-card>
      </v-flex>
      <v-flex xs8>
        <v-card>
          <v-layout column wrap>
            <v-flex class="button-toolbar">
              <mes-toolbar/>
            </v-flex>
            <v-flex>
              <mes-content/>
            </v-flex>
          </v-layout>
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