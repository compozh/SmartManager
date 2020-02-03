<template>
  <v-app>

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

    <v-content>
        <router-view/>
    </v-content>

  </v-app>
</template>

<script>

export default {
  name: 'main-processes',
  computed: {
    error () {
      return this.$store.getters['error']
    },
    snackbar () {
      return this.$store.getters['snackbar']
    }
  }
}
</script>

<style lang="scss">

</style>
