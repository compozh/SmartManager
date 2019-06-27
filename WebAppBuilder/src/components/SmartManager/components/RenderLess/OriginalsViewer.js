/* Renderless компонент без отрисовки */
export default {
  name: 'originals-viewer',
  props: ['originals'],
  data() {
    return {
      file: {
        name: '',
        url: '',
        id: ''
      }
    }
  },
  methods: {
    selectDocument(fileName, fileUrl, fileId) {
      this.file.name = fileName
      this.file.url = fileUrl
      this.file.id = fileId
    },
  },
  mounted() {
    // Сразу отображаем документ первого original
    if (!this.originals || !this.originals.length || this.file.name || this.file.url) {
      return
    }
    this.file.name = !this.file.name ? this.originals[0].fileName : this.file.name
    this.file.url = !this.file.url ? this.originals[0].fileUrl : this.file.url
    this.file.id = !this.file.id ? this.originals[0].id : this.file.id
  },
  render() {
    return this.$scopedSlots.default({
      originals: this.originals,
      file: this.file,
      params: {
        selectDocument: this.selectDocument
      }
    })
  }
}