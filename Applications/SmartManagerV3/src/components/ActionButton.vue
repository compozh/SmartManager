<template>
  <v-speed-dial
    fixed
    v-model="fab"
    bottom right
    direction="top"
    open-on-hover
    transition="slide-y-reverse-transition">
    <template v-slot:activator>
      <v-btn v-model="fab"
        color="blue darken-2"
        dark fab>
        <fa-icon v-if="fab" icon="times"/>
        <fa-icon v-else icon="plus"/>
      </v-btn>
    </template>
    <v-btn fab dark small color="success">
      <fa-icon icon="pencil"/>
    </v-btn>
    <v-btn fab dark small color="indigo">
      <fa-icon icon="plus"/>
    </v-btn>
    <v-btn fab dark small color="error">
      <fa-icon icon="trash-alt"/>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  name: 'ActionButton',
  data: () => ({
    fab: false
  })
}
</script>

<style scoped>

</style>
