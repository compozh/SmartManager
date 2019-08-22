<template>
    <v-layout
      row wrap
      align-content-center
    >
      <v-flex xs12>
        <v-icon
          color="grey lighten-2"
          size="200"
        >error_outline
        </v-icon>
      </v-flex>
      <v-flex xs12 class="file-title">
        <span
          class="headline grey--text text--lighten-2"
        >
          <i18n path="sm.messages.noSupport">
            <b place="ext">{{ ext }}</b>
          </i18n>
        </span>
      </v-flex>
    </v-layout>

</template>

<script>
export default {
  name: 'sm-not-support',
  props: ['url'],
  computed: {
    ext() {
      return this.url.split('.').pop().toUpperCase()
    }
  }
}
</script>

<style scoped>

</style>
