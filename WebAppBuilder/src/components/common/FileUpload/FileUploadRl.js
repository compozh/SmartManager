export default {
  name: 'file-upload-rl',
  data: () => ({
    files: {
      value: []
    },
    options: {
      action: myConfig.GrapgQlUrl + 'upload',
      multiple: true,
      mimeTypes: 'image/*, application/pdf, application/msword, application/excel, text/*',
      extensions: "gif, jpg, jpeg, png, webp, pdf, doc, docx, xls, xlsx, txt, log",
      size: 1048576 * 100, // 100 Mb
      chunk: true,
      chunkMinSize: 512000,
      chunkMaxActive: 1,
      chunkMaxRetries: 10,
      headers: {'Upload-Type': 'single'}
    }
  }),
  methods: {
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        if (newFile.xhr) {
          //  Get the response status code
          // console.log('status', newFile.xhr.status)
        }
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter
        if (!/\.(jpeg|jpe|jpg|gif|png|pdf|doc|docx|xls|xlsx|txt|log)$/i.test(newFile.name)) {
          return prevent()
        }
      }
      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    },
    remove(id) {
      this.files.value = this.files.value.filter(i => i.id !== id)
    }
  },
  computed: {},
  render() {
    return this.$scopedSlots.default({
      files: this.files,
      options: this.options,
      events: {
        inputFile: this.inputFile,
        inputFilter: this.inputFilter,
        remove: this.remove,
      }
    })
  }
}
