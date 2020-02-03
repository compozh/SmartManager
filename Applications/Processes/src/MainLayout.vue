<template>
  <div id="app">

    <router-view></router-view>

    <v-snackbar
      v-if="snackbar.visible"
      :top="false"
      style="max-height: 100px; overflow: auto"
      :multi-line="true"
      :timeout="5000"
      :color=snackbar.type
      @input="closeSnackbar"
      :value="true"
    >
      {{ snackbar.message }}
      <v-btn @click.native="closeSnackbar" text color="white">
        {{this.$t('processes.buttons.Close')}}
      </v-btn>
    </v-snackbar>

    <div v-if="error" style="font-size: 40px;" justify="center" class="py-10">
      <p>{{error}}</p>
    </div>

  </div>
</template>

<script>

export default {
  computed: {
    error () {
      return this.$store.getters['error']
    }
  }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

</style>
