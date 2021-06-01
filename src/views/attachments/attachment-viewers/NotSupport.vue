<template>
  <div class="not-support-container">
    <i18n path="attachments.notSupport"
          tag="span" class="mb-5">
      <template #ext>
        <b>{{ ext }}</b>
      </template>
    </i18n>
    <v-btn :href="url"
           outlined
           color="primary">
      <fa-icon icon="download" size="lg" type="fal" :class="`${mr}-3`"/>
      {{ $t('attachments.downloadFile') }}
    </v-btn>
  </div>
</template>

<script>

export default {
  props: {
    url: String
  },
  data: () => ({
    sourceText: '',
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50
    }
  }),
  computed: {
    ext () {
      return this.url.split('.').pop().toUpperCase()
    }
  }
}
</script>

<style scoped>

  .not-support-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: #dae1e7;
    text-align: center;
    background: #fbfbfb;
  }

</style>
