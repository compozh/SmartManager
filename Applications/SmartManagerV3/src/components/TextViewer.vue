<template>
  <div class="pa-3 fill-height d-flex flex-column">
    <perfect-scrollbar class="border-light pa-3 flex-grow-1"
         style="flex-basis: 0; background: #f9f9f9">
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
        // this.$vs.notify({
        //   title: 'Error read text',
        //   text: e.message,
        //   color: 'danger'
        // })
      }
    }
  }
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

</style>
