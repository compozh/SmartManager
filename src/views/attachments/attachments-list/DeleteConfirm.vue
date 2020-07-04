<template>
  <v-row justify="center">
    <v-dialog :value="dialog"
              @input="$emit('input', $event)"
              persistent max-width="400">
      <v-card>
        <v-card-title class="headline">
          <slot name="title"/>
        </v-card-title>
        <v-card-text>
          <slot name="text"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-4" text @click="closeDialog">
            {{ $t('buttons.cancel') }}
          </v-btn>
          <v-btn color="red darken-4" text @click="confirm">
            {{ $t('buttons.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: 'DeleteConfirm',
  model: {
    prop: 'dialog'
  },
  props: {
    dialog: Boolean
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
    },
    confirm () {
      this.$emit('confirm')
      this.closeDialog()
    }
  }
}
</script>

<style scoped>

</style>
