<template>
  <v-container pa-0>
    <v-layout row wrap>
      <v-flex xs12>
        <p class="pt-3 grey--text subheading" >Связанные документы отсутствуют</p>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
  export default {
    name: "smTaskTabDocs",
    props: ['task']
  }
</script>

<style scoped>

</style>