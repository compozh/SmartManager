<template>
    <pre>{{ sourceText }}</pre>
</template>

<script>
  export default {
    name: "sm-txt-viewer",
    props: ['url'],
    data: () => ({
      sourceText: ''
    }),
    created() {
      fetch(this.url)
        .then(res => res.text())
        .then(text => this.sourceText = text)
        .catch(e => this.$store.commit('sm/setError', e.message))
    }
  }
</script>

<style scoped>

  pre {
    height: inherit;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    display: none;
  }

</style>