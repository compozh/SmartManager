<template>
  <v-dialog :value="value" :width="width"
            @input="$emit('input', $event)"
            @click:outside="persistent || $emit('input', false)"
            :persistent="persistent">

    <v-card :min-height="minHeight"
            :loading="loading"
            class="d-flex flex-column flex-grow-1 overflow-hidden blue-grey">

      <v-card-title class="subtitle-1 white--text py-1">
        {{ title || 'Dialog title' }}

        <v-spacer/>

        <!-- Close button-->
        <v-btn icon small depressed
               :class="`close ${mr}-n5`"
               @click="loading || $emit('input', false)">
          <fa-icon icon="times" type="fal"
                   size="lg" color="#fff"/>
        </v-btn>

      </v-card-title>

      <!-- Main dialog content -->
      <v-card-text class="d-flex flex-column flex-grow-1 white">
        <slot name="text">Dialog content</slot>
      </v-card-text>

      <v-divider v-if="!noActions" style="background: #e0e0e0"/>

      <!-- Dialog actions -->
      <v-card-actions v-if="!noActions" class="pa-4 white">
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
    title: String,
    loading: Boolean,
    noActions: Boolean,
    minHeight: {
      type: String,
      default: '400px'
    }
  }
}
</script>

<style scoped>

  .close:hover {
    transform: rotate(180deg);
  }

</style>
