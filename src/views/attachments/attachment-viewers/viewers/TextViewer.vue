<template>
  <div class="fill-height d-flex flex-column">
    <perfect-scrollbar class="pa-3 flex-grow-1"
                       style="flex-basis: 0; white-space: pre; background: #fbfbfb">
      {{ sourceText }}
    </perfect-scrollbar>
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
  watch: {
    url (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getText()
      }
    }
  },
  created () {
    this.getText()
  },
  methods: {
    async getText () {
      try {
        const result = await fetch(this.url)
        this.sourceText = await result.text()
      } catch (e) {
        this.$store.commit('SET_NOTIFY', {
          text: 'Error text reading',
          color: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
