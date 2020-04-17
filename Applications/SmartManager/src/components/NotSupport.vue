<template>
  <div class="not-support-container">
    <i18n path="messages.notSupport" tag="div" class="mb-6 text-4xl">
      <template v-slot:ext>
        <b>{{ ext }}</b>
      </template>
    </i18n>
    <v-btn :href="url"
               color="primary"
               type="border"
               icon-pack="feather"
               icon="icon-download">{{ $t('attachments.downloadFile') }}
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
    font-size: 2.25rem;
    color: #dae1e7;
    text-align: center;
  }

</style>
