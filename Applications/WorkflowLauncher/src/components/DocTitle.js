export default {
  name: 'doc-title',
  props: ['title'],
  watch: {
    title: {
      immediate: true,
      handler() {
        document.title = this.title
      }
    }
  },
  render () {
  },
}
