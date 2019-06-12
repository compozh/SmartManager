<template>
  <v-toolbar flat class="transparent">
    <v-list class="pa-0">
      <v-list-tile avatar>
        <v-list-tile-avatar>
          <v-icon x-large>account_circle</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ currentUser }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple @click="onClick">
            <v-icon color="grey">exit_to_app</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </v-toolbar>
</template>
<script>
export default {
  name: 'user-panel',
  computed: {
    currentUser() {
      return this.$store.state.currentuser
    }
  },
  methods: {
    onClick() {
      this.$store.dispatch('LogOut')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
