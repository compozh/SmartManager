<template>
  <div>
    <vs-table v-if="files.length" stripe :data="files" class="mb-4 attachments-table">
      <template slot="thead">
        <vs-th v-for="(header, index) in tableHeaders"
               :key="index"
        >{{ header.text }}
        </vs-th>
      </template>

      <template v-slot="{data}">
        <vs-tr v-for="(item, index) in data"
               :key="index"
               :state="item.size >= size || item.error ? 'danger' : null">
          <vs-td class="w-1/2">{{item.name}}</vs-td>
          <vs-td class="text-center"
          >{{ fileSize(item.size) }}</vs-td>
          <vs-td  class="text-center cursor-default">
            <vx-tooltip v-if="item.size >= size || item.error"
                        :text="item.error" color="danger">
              <vs-icon icon="warning"
                       size="small"
                       color="danger"
                       class="cursor-pointer"/>
            </vx-tooltip>
            <span v-else-if="!item.success"
            >{{ parseFloat(item.progress).toFixed(2) }} %</span>
            <vs-icon v-else
                     icon="done"
                     size="small"
                     color="success"/>
          </vs-td>
          <vs-td class="text-center">
            <vs-button v-if="$refs.upload && !$refs.upload.uploaded && !loading || item.existing"
                       radius
                       class="text-center"
                       color="#626262"
                       type="flat"
                       icon="close"
                       @click="remove(item.id, item.existing)"/>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <div class="flex justify-center">
      <vs-button v-if="uploadBtn && files.length"
                 @click="startUpload"
                 class="mb-4 w-1/2"
                 color="primary"
                 size="small"
                 type="border"
                 icon-pack="feather"
                 icon="icon-upload">{{ $t('buttons.upload') }}</vs-button>
      <vs-button v-if="resetBtn && files.length"
                 @click="files = []"
                 class="mb-4 ml-3 "
                 color="danger"
                 size="small"
                 type="border"
                 icon-pack="feather"
                 icon="icon-trash-2">{{ $t('buttons.cancel') }}</vs-button>
    </div>
    <file-upload
      ref="upload"
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
      @input-filter="inputFilter"
    >
      {{ breakpoint === 'md' ? $t('buttons.addAttachShot') : $t('buttons.addAttachLong') }}
    </file-upload>
  </div>
</template>

<script>
import fileUpload from 'vue-upload-with-credential'

export default {
  components: {
    fileUpload
  },
  props: {
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
    headers: {'Upload-Type': 'single'}
  }),
  computed: {
    breakpoint() {
      return this.$store.state.breakpoint
    },
    fileSize() {
      return size => {
        switch (true) {
          case size < 1024: return `${size} Byte`
          case size < 1024000: return `${(size / 1024).toFixed(1)} Kb`
          default: return `${(size / 1024 / 1024).toFixed(2)} Mb`
        }
      }
    },
    tableHeaders() {
      return [
        {text: this.$t('table.name'), value: 'name'},
        {text: this.$t('table.size'), value: 'size', align: 'center'},
        {text: this.$t('table.uploaded'), value: 'upload', align: 'center'},
        {text: '', value: 'delete'}
      ]
    },
    active() {
      return this.$refs.upload ? this.$refs.upload.active : ''
    }
  },
  watch: {
    existingFiles(val) {
      this.files = val
    },
    uploading(val) {
      if (val) {
        const newFiles = this.files.filter(file => !file.existing)
        if (newFiles.length) {
          this.startUpload()
        } else {
          this.$emit('attach', [])
        }
      }
    },
    uploadErrors(errors) {
      errors.forEach(error => {
        const file = this.files.find(file => file.name === error.fileName)
        file.error = error.message
      })
    }
  },
  methods: {
    startUpload() {
      this.$refs.upload.active = this.loading = true
    },
    inputFilter(newFile, oldFile, prevent) {
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
    inputFile(newFile, oldFile) {
      if (newFile && oldFile) {
        // File upload error
        if (newFile.error !== oldFile.error) {
          this.$vs.notify({
            title: this.$t('notify.attachTitle'),
            text: this.$t('notify.uploadError', {file: newFile.name}),
            color: 'danger'
          })
        }

        // File upload success
        if (newFile && oldFile && newFile.success !== oldFile.success) {
          const fileName = newFile.file.name
          const filePath = newFile.response.fileName
          this.attachments.push({fileName, filePath})
        }
        // All files uploaded
        if (newFile && oldFile && this.$refs.upload && this.$refs.upload.uploaded) {
          this.$emit('attach', this.attachments)
          this.$refs.upload.active = this.loading = false
        }
      }
    },
    async remove(id, existing) {
      if (existing) {
        await this.$store.dispatch('sm/attachmentDelete', id)
      }
      this.files = this.files.filter(i => i.id !== id)
    }
  }
}
</script>

<style scoped>

  .upload-action {
    background: #f5f5f5;
    box-sizing: border-box;
    border-radius: 8px;
    transition: all .25s ease;
    border: 1px dashed rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0;
  }

  .upload-action:hover {
    border: 1px dashed rgba(var(--vs-primary),.5);
  }

  .attachments-table >>> .vs-table--tbody {
    z-index: 0 !important;
  }

  th >>> .vs-table-text {
    justify-content: center !important;
  }

  td {
    padding: 7px 10px !important;
  }

  .upload-action >>> label {
    cursor: pointer;
  }

</style>
