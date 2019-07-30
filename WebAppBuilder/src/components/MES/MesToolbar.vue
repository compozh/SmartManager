<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-beetwen>
      <v-flex>
        <router-link tag="h1" :to="{ name:'MESROOT'}">
          <a>MES</a>
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
  name: "mes-toolbar"
};
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