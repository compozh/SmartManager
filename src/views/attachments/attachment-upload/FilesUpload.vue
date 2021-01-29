<template>
  <perfect-scrollbar :options="scrollOptions">
    <file-upload ref="upload"
                 :inputId="String(inputId)"
                 class="upload-action"
                 v-model="files"
                 :multiple="isMultiple"
                 drop
                 dropDirectory
                 :headers="headers"
                 :size="size"
                 :extensions="fileExtensions"
                 :accept="fileExtensions"
                 :chunk-enabled="true"
                 :chunk="chunk"
                 :post-action="chunk.action"
                 @input-file="inputFile"
                 @input-filter="inputFilter">
    </file-upload>
    <slot :files="files"/>
  </perfect-scrollbar>
</template>

<script>
import { common, tasks, attachments } from '@/mixins/units'

const fileUpload = () => import('vue-upload-with-credential')

export default {
  name: 'FilesUpload',
  components: {
    fileUpload
  },
  mixins: [common, tasks, attachments],
  props: {
    inputId: [String, Number],
    uploadType: {
      type: String,
      default: 'attachment'
    },
    uploadHandler: {
      type: Function,
      default: () => this.addAttachments
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
    }
  },
  data: () => ({
    files: [],
    loading: false,
    size: 1048576 * 100, // one file size limit - 100 Mb
    headers: { 'Upload-Type': 'single' },
    chunk: {
      action: window.appConfig.GqlUrl + 'upload',
      minSize: 512000,
      maxActive: 1,
      maxRetries: 10
    },
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    }
  }),
  computed: {
    isMultiple () {
      return this.uploadType !== 'version'
    },
    fileSize () {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
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
          this.$emit('update:attachments', [])
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
          timeOut = 1000 * index
          return file.name === newFile.name
        })) {
          setTimeout(() => {
            this.$store.commit('SET_NOTIFY', {
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
          this.files = []
          this.$store.commit('SET_NOTIFY', {
            text: this.$t('notify.uploadError', { file: newFile.name }),
            color: 'error'
          })
        }
        // File upload success
        if (newFile && oldFile && newFile.success !== oldFile.success) {
          const fileName = newFile.file.name
          const filePath = newFile.response.fileName
          this.uploadHandler({ fileName, filePath })
          this.files.shift()
        }
        // All files uploaded
        if (newFile && oldFile && this.$refs.upload && this.$refs.upload.uploaded) {
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
