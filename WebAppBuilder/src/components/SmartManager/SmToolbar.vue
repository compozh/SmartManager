<template>
  <v-container fluid pa-0>
    <v-layout row align-center>
      <v-flex>
        <h1 class="blue--text text--darken-2 font-weight-thin">
          Smart Manager
        </h1>
      </v-flex>
      <v-spacer ></v-spacer>
      <v-flex xs4>
        <user-panel></user-panel>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    name: "sm-toolbar",
  }
</script>

<style scoped>
  h1 {
    font-size: 30px;
    text-align: left;
    white-space: nowrap;
  }
</style>