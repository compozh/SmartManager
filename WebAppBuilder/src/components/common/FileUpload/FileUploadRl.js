export default {
  name: 'file-upload-rl',
  data: () => ({
    files: {
      value: []
    },
    options: {
      action: 'http://localhost:3000/upload',
      multiple: true,
      mimeTypes: 'image/png, image/gif, image/jpeg, image/webp, application/pdf',
      extensions: "gif, jpg, jpeg, png, webp, pdf, exe",
      size: 1048576,
      chunk: false,
      chunkMinSize: 0,
      chunkMaxActive: 3,
      chunkMaxRetries: 5
    }
  }),
  methods: {
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          console.log('status', newFile.xhr.status)
        }
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|pdf)$/i.test(newFile.name)) {
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
