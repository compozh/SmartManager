<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen>
      <v-flex>
        <router-link
          tag="h1"
          class="blue--text text--darken-2 font-weight-thin"
          :to="{ name:'SMARTMANAGERTASKS', params:{ foldercode: 'ALL' }}"
        ><a>Smart Manager</a>
        </router-link>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex class="grow-0">
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'sm-toolbar'
}
</script>

<style scoped>
  h1 {
    font-size: 30px;
    text-align: left;
    white-space: nowrap;
  }

  a {
    text-decoration: none;
  }

  .grow-0 {
    flex-grow: 0 !important;
  }
</style>
