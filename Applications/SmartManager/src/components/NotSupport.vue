<template>
  <VuePerfectScrollbar
    class="md:px-8 p-4 flex-1 border d-theme-border-grey-light border-solid p-6 m-6 mt-0"
    style="background: #f5f5f5;"
    :settings="settings"
  >
    <div class="not-support-container">
      <i18n path="messages.notSupport">
        <b place="ext">{{ ext }}</b>
      </i18n>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    VuePerfectScrollbar
  },
  props: {
    url: String
  },
  data: () => ({
    sourceText: '',
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    }
  }),
  computed: {
    ext() {
      return this.url.split('.').pop().toUpperCase()
    }
  }
}
</script>

<style scoped>

  .not-support-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 2.25rem;
    color: #dae1e7;
    text-align: center;
  }

</style>
