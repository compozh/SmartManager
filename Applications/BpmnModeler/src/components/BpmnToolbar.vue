<template>
  <v-container fluid pa-0>
    <v-layout row align-center justify-space-between>
      <v-flex>
        <h1 class="text-left blue--text text--darken-2">Bpmn Modeler</h1>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex shrink class="icon-container">
        <user-panel mini="true"></user-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'bpmn-toolbar'
};
</script>
<style scoped>
.text-left {
  text-align: left;
}
</style>
