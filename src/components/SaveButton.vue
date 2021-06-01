<template>
  <div class="btn-wrapper">
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               id="saveBtn" icon
               small depressed
               :class="`${mr}-3 green--text`"
               @click="$emit('save')">
          <fa-icon icon="save" type="fal" size="2x"/>
        </v-btn>
      </template>
      <span>{{ $t('buttons.save') }}</span>
    </v-tooltip> <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               id="cancelBtn" icon
               small depressed
               :class="`${mr}-3 red--text`"
               @click="$emit('cancel')">
          <fa-icon icon="times" type="fal" size="2x"/>
        </v-btn>
      </template>
      <span>{{ $t('buttons.cancel') }}</span>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  name: 'SaveButton'
}
</script>

<style scoped>

  #saveBtn {
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1)
    }
    50% {
      transform: scale(1.2)
    }
  }

  @media (max-width: 850px) {
    .btn-wrapper {
      padding-right: 2em !important;
    }
  }

</style>
