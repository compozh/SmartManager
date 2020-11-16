<template>
  <v-dialog :value="value" :width="width"
            @input="$emit('input', $event)"
            @click:outside="persistent ? '' : $emit('close')"
            persistent="persistent">
    <v-card :height="height"
            class="d-flex flex-column flex-grow-1 overflow-hidden blue-grey">
      <v-card-title class="subtitle-1 white--text py-1">
        {{ title || 'Dialog title' }}
        <v-spacer/>
        <v-btn icon small depressed
               class="close mr-n5"
               @click="$emit('close')">
          <fa-icon icon="times" type="fal"
                   size="lg" color="#fff"/>
        </v-btn>
      </v-card-title>
      <v-card-text class="d-flex flex-column flex-grow-1 white">
        <slot name="text">'Dialog title'</slot>
      </v-card-text>
      <v-divider style="background: #e0e0e0"/>
      <v-card-actions class="pa-4 white">
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
    height: String,
    title: String
  }
}
</script>

<style scoped>

  .close:hover {
    transform: rotate(180deg);
  }

</style>
