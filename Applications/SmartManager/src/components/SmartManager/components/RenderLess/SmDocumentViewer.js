export default {
  name: 'sm-document-viewer-rl',
  data: () => ({
      file: {
        name: '',
        url: '',
        ext: '',
        id: ''
      }
  }),
  created() {
    if (this.originals.length) {
      this.selectDoc(this.originals[0])
    }
  },
  computed: {
    originals() {
      const task = this.$store.state.sm.taskInfo
      return task ? task.originals : []
    },
    component() {
      const ext = this.file.url.split('.').pop()
      switch (true) {
        case ext === '': return
        case ext === 'pdf': return 'sm-pdf-viewer'
        case this.isText(ext): return 'sm-txt-viewer'
        case this.isImage(ext): return 'sm-image-viewer'
        default: return 'sm-not-support'
      }
    }
  },
  methods: {
    selectDoc(doc) {
      this.file.name = doc.fileName
      this.file.url = doc.fileUrl
      this.file.ext = doc.fileExt
      this.file.id = doc.id
    },
    isImage(ext) {
      const types = ['png', 'jpeg', 'jpg', 'bmp']
      return types.some(i => i === ext)
    },
    isText(ext) {
      const types = ['txt', 'log']
      return types.some(i => i === ext)
    },
    isWord(ext) {
      const types = ['doc', 'docx', 'rtf']
      return types.some(i => i === ext)
    },
    isExcel(ext) {
      const types = ['xls', 'xlsx']
      return types.some(i => i === ext)
    },
    getIconColor(ext) {
      switch (true) {
        case ext === 'pdf': return '#BF360C'
        case this.isImage(ext): return '#7B1FA2'
        case this.isText(ext): return '#455A64'
        case this.isWord(ext): return '#1976D2'
        case this.isExcel(ext): return '#1B5E20'
      }
    }
  },
  render() {
    return this.$scopedSlots.default({
      originals: this.originals,
      file: this.file,
      select: this.selectDoc,
      component: this.component,
      params: {
        iconColor: this.getIconColor
      }
    })
  }
}