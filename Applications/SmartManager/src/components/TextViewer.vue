<template>
  <VuePerfectScrollbar class="p-4"
                       style="background: #f5f5f5;"
                       :settings="settings">
    <span>{{ sourceText }}</span>
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
  watch: {
    url(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getText()
      }
    }
  },
  created() {
    this.getText()
  },
  methods: {
    async getText() {
      try {
        const result = await fetch(this.url)
        this.sourceText = await result.text()
      } catch (e) {
        this.$vs.notify({
          title: 'Error read text',
          text: e.message,
          color: 'danger'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
