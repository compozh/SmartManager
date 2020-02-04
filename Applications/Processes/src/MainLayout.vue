<template>
  <v-app>

    <v-snackbar
      v-if="snackbar.visible"
      :top="true"
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

    <v-content>
        <router-view/>
    </v-content>

  </v-app>
</template>

<script>
export default {
  name: 'main-processes',
  computed: {
    snackbar () {
      return this.$store.getters['snackbar']
    }
  },
  methods: {
    closeSnackbar () {
      this.$store.commit('closeSnackbar')
    }
  }
}
</script>

<style lang="scss">

</style>
