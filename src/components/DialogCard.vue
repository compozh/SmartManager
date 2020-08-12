<template>
  <v-dialog :value="value" :width="width"
            @input="$emit('input', $event)"
            @click:outside="persistent ? '' : $emit('close')"
            persistent="persistent">
    <v-card class="d-flex flex-column flex-grow-1 overflow-hidden">
      <v-card-title class="subtitle-1 white--text blue-grey py-1">
        {{ title || 'Dialog title' }}
        <v-spacer/>
        <v-btn icon small depressed
               class="close mr-n5"
               @click="$emit('close')">
          <fa-icon icon="times" type="fal"
                   size="lg" color="#fff"/>
        </v-btn>
      </v-card-title>
      <v-card-text class="d-flex flex-column flex-grow-1">
        <slot name="text">'Dialog title'</slot>
      </v-card-text>
      <v-divider/>
      <v-card-actions class="pa-4">
        <slot name="actions">Dialog actions</slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogCard',
  props: {
    value: Boolean,
    persistent: Boolean,
    width: String,
    title: String
  }
}
</script>

<style scoped>

  .close:hover {
    transform: rotate(180deg);
  }

</style>
