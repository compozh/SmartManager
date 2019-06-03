<template>
  <v-container fluid pa-0>
    <v-layout row align-center>
      <v-flex>
        <h1 class="blue--text text--darken-2 font-weight-thin">
          <router-link
            to="{ name:'SMARTMANAGERTASKS', params:{ foldercode: 'ALL' }}"
          ></router-link>
          Smart Manager
        </h1>
      </v-flex>
      <v-spacer>{{ getCurrentPath }}</v-spacer>
      <v-flex xs4>
        <user-panel></user-panel>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
  export default {
    name: "sm-toolbar",
    computed: {
      getCurrentPath() {
        return this.$route.path
      }
    }
  }
</script>

<style scoped>
  h1 {
    font-size: 30px;
    text-align: left;
    white-space: nowrap;
  }
</style>