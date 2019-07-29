<template>
  <v-container>
    <v-layout xs12 wrap>
      <v-flex xs6>
      <v-card class="suchBlock">as</v-card>
      </v-flex>
      <v-flex xs6>
      <v-card class="suchBlock">as</v-card>
      </v-flex>
      <v-flex xs6>
      <v-card class="suchBlock">as</v-card>
      </v-flex>
      <v-flex xs6>
      <v-card class="suchBlock">as</v-card>
      </v-flex>
      </v-layout>

  </v-container>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  name: "mes-content",


}
</script>
<style type="text/css" scoped>
  .suchBlock{
    height:150px;
    margin: 10px;
  }
</style>
