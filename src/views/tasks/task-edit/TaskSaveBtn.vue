<template>
  <div>
    <v-tooltip top>
      <template #activator="{ on }">
        <v-btn v-on="on"
               id="saveBtn" icon
               small depressed
               class="mr-3 green--text">
          <fa-icon icon="save" type="fal" size="2x"/>
        </v-btn>
      </template>
      <span>{{ $t('buttons.save') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TaskSaveBtn'
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

</style>
