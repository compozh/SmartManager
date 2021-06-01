<template>
    <v-dialog :value="dialog"
              @input="$emit('input', $event)"
              persistent max-width="400">
      <v-card class="red darken-4">
        <v-card-title class="subtitle-1 white--text py-1">
          <slot name="title"/>
        </v-card-title>
        <v-card-text class="white pt-4">
          <slot name="text"/>
        </v-card-text>
        <v-divider style="background: #e0e0e0"/>
        <v-card-actions class="pa-4 white">
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
