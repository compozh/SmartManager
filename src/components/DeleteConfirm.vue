<template>
  <v-row justify="center">
    <v-dialog :value="dialog"
              @input="$emit('input', $event)"
              persistent max-width="400">
      <v-card>
        <v-card-title class="subtitle-1 white--text blue-grey py-1 mb-4">
          <slot name="title"/>
        </v-card-title>
        <v-card-text>
          <slot name="text"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <outlined-btn icon="times"
                        color="blue-grey"
                        :handler="closeDialog">
            <span>{{ $t('buttons.cancel') }}</span>
          </outlined-btn>
          <outlined-btn icon="trash"
                        color="red darken-4"
                        :handler="confirm">
            <span>{{ $t('buttons.delete') }}</span>
          </outlined-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import OutlinedBtn from '@/components/OutlinedBtn'

export default {
  name: 'DeleteConfirm',
  model: {
    prop: 'dialog'
  },
  props: {
    dialog: Boolean
  },
  components: {
    OutlinedBtn
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
