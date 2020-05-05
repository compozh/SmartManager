<template>
  <file-upload ref="upload"
               class="upload-action"
               v-model="files"
               :multiple="multiple"
               :drop="true"
               :dropDirectory="true"
               :headers="headers"
               :size="size"
               :chunk-enabled="chunk"
               :chunk="{
                 action,
                 minSize,
                 maxActive,
                 maxRetries,
               }"
               :post-action="action"
               @input-file="inputFile"
               @input-filter="inputFilter">
  </file-upload>
</template>

<script>
import fileUpload from 'vue-upload-with-credential'

export default {
  components: {
    fileUpload
  },
  props: {
    fileList: {
      type: Boolean,
      default: true
    },
    existingFiles: {
      type: Array
    },
    uploading: {
      type: Boolean,
      default: false
    },
    resetBtn: {
      type: Boolean,
      default: false
    },
    uploadBtn: {
      type: Boolean,
      default: false
    },
    uploadAuto: {
      type: Boolean,
      default: false
    },
    uploadErrors: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    files: [],
    attachments: [],
    loading: false,
    // eslint-disable-next-line no-undef
    action: appConfig.GrapgQlUrl + 'upload',
    multiple: true,
    size: 1048576 * 100, // one file size limit - 100 Mb
    chunk: true,
    minSize: 512000,
    maxActive: 1,
    maxRetries: 10,
    headers: { 'Upload-Type': 'single' }
  }),
  computed: {
    fileSize () {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
    },
    tableHeaders () {
      return [
        { text: this.$t('table.name'), value: 'name' },
        { text: this.$t('table.size'), value: 'size', align: 'center' },
        { text: this.$t('table.uploaded'), value: 'upload', align: 'center' },
        { text: '', value: 'delete' }
      ]
    },
    active () {
      return this.$refs.upload ? this.$refs.upload.active : ''
    }
  },
  watch: {
    existingFiles (val) {
      this.files = val
    },
    uploading (val) {
      if (val) {
        const newFiles = this.files.filter(file => !file.existing)
        if (newFiles.length) {
          this.startUpload()
        } else {
          this.$emit('attach', [])
        }
      }
    },
    uploadErrors (errors) {
      errors.forEach(error => {
        const file = this.files.find(file => file.name === error.fileName)
        file.error = error.message
      })
    }
  },
  methods: {
    startUpload () {
      this.$refs.upload.active = this.loading = true
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // В случае если есть файлы с такими же именами то для каждого
        // будет поочередный вывод предупреждений через setTimeout
        let timeOut = 0
        if (this.files.some((file, index) => {
          timeOut = 300 * index
          return file.name === newFile.name
        })) {
          setTimeout(() => {
            this.$vs.notify({
              title: this.$t('notify.attachTitle'),
              text: this.$t('notify.fileAlreadyAdded', { file: newFile.name }),
              color: 'warning'
            })
          }, timeOut)
          return prevent()
        }
        if (this.uploadAuto && !this.$refs.upload.active) {
          this.startUpload()
        }
      }
    },
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // File upload error
        if (newFile.error !== oldFile.error) {
          // notify
          // this.$vs.notify({
          //   title: this.$t('notify.attachTitle'),
          //   text: this.$t('notify.uploadError', { file: newFile.name }),
          //   color: 'danger'
          // })
        }

        // File upload success
        if (newFile && oldFile && newFile.success !== oldFile.success) {
          const fileName = newFile.file.name
          const filePath = newFile.response.fileName
          this.attachments.push({ fileName, filePath })
        }
        // All files uploaded
        if (newFile && oldFile && this.$refs.upload && this.$refs.upload.uploaded) {
          this.$emit('attach', this.attachments)
          this.$refs.upload.active = this.loading = false
        }
      }
    },
    async remove (id, existing) {
      if (existing) {
        await this.$store.dispatch('sm/attachmentDelete', id)
      }
      this.files = this.files.filter(i => i.id !== id)
    }
  }
}
</script>
