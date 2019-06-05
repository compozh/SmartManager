/* Renderless компонент без отрисовки */
export default {
  name: 'originals-viewer',
  props: ['originals'],
  data() {
    return {
      fileName: '',
      fileUrl: '',
      fileId: ''
    }
  },
  methods: {
    selectDocument(fileName, fileUrl, fileId) {
      this.fileName = fileName;
      this.fileUrl = fileUrl;
      this.fileId = fileId
      this.$emit('inputName', fileName);
      this.$emit('inputUrl', fileUrl);
    },
  },
  beforeUpdate() {
    // Сразу отображаем документ первого original
    if (!this.originals || !this.originals.length || this.fileName || this.fileUrl) {
      return
    }
    this.fileName = !this.fileName ? this.originals[0].fileName : this.fileName;
    this.fileUrl = !this.fileUrl ? this.originals[0].file : this.fileUrl;
    this.fileId = !this.fileId ? this.originals[0].id : this.fileId;
  },
  render() {
    return this.$scopedSlots.default({
      originals: this.originals,
      file: {
        name: this.fileName,
        url: this.fileUrl,
        id: this.fileId,
      },
      params: {
        selectDocument: this.selectDocument
      }
    })
  }
}