<template>
  <v-container fluid pa-0>
    <v-layout class="upload-container wrap">
      <v-flex v-if="files.length" xs12 pb-3>
        <v-data-table
          class="file-list elevation-1"
          disable-initial-sort
          :items="files"
          :headers="tableHeaders"
          hide-actions
          sort-icon=""
        >
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center"
                :class="{'red--text text--darken-2' : props.item.size >= size}"
            >{{ (props.item.size / 1024 / 1024).toFixed(2) }} Mb
            </td>
            <td class="text-xs-center"
                :class="{'progress-cell': !loading}"
            >
              <v-icon v-if="props.item.size >= size" size="20" class="red--text text--darken-2">warning</v-icon>
              <span v-else-if="!props.item.success" class="pl-2">{{ parseFloat(props.item.progress).toFixed(2) }} %</span>
              <v-icon
                v-else
                size="20"
                class="green--text text--darken-2"
              >done</v-icon>
            </td>
            <td
              class="remove-btn"
              v-if="$refs.upload && !$refs.upload.uploaded && !loading"
            >
              <v-btn icon small @click="remove(props.item.id)">
                <v-icon size="20" class="grey--text text--darken-1">close</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex>
        <file-upload
          ref="upload"
          class="upload-action"
          v-model="files"
          :extensions="extensions"
          :accept="mimeTypes"
          :multiple="multiple"
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
          <span
            v-if="!loading"
            class="upload-btn grey--text text--darken-1 subheading font-weight-light">
            <v-icon size="30">attach_file</v-icon>
            <span class="hidden-xs-only">Добавить вложение</span>
          </span>
        </file-upload>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import fileUpload from 'vue-upload-with-credential'

export default {
  name: 'file-upload-add-task-form',
  props: ['uploading'],
  components: {
    fileUpload
  },
  data: () => ({
    files: [],
    attachments: [],
    loading: false,
    // eslint-disable-next-line no-undef
    action: myConfig.GrapgQlUrl + 'upload',
    multiple: true,
    mimeTypes: 'image/*, application/pdf, application/msword, application/excel, text/*',
    extensions: 'gif, jpg, jpeg, png, webp, pdf, doc, docx, xls, xlsx, txt, log',
    size: 1048576 * 100, // 100 Mb
    chunk: true,
    minSize: 512000,
    maxActive: 1,
    maxRetries: 10,
    headers: {'Upload-Type': 'single'},
    tableHeaders: [
      {text: 'Название файла', value: 'name'},
      {text: 'Размер', value: 'size', align: 'center'},
      {text: 'Загружено', value: 'upload', align: 'center'}
    ]
  }),
  computed: {
    active() {
      return this.$refs.upload ? this.$refs.upload.active : ''
    }
  },
  watch: {
    uploading(val) {
      if (this.files.length) {
        this.$refs.upload.active = val
        this.loading = true
      } else {
        this.$emit('attach', [])
      }
    }
  },
  methods: {
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && newFile.success !== oldFile.success) {
        const fileName = newFile.file.name
        const filePath = newFile.response.fileName
        this.attachments.push({fileName, filePath})
      }
      if (this.$refs.upload && this.$refs.upload.uploaded) {
        this.$emit('attach', this.attachments)
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
      this.files = this.files.filter(i => i.id !== id)
    }
  }
}
</script>

<style scoped>
  .upload-container {
    position: relative;
  }

  .upload-action {
    display: flex;
    position: absolute;
    left: -8px;
    bottom: -37px;
  }

  .upload-action >>> label {
    cursor: pointer;
  }

  .upload-btn {
    display: flex;
    align-items: center;
  }

  .file-list >>> tr:hover .progress-cell {
    display: none;
  }

  .remove-btn {
    display: none;
  }

  .file-list >>> tr:hover .remove-btn {
    display: table-cell;
  }
</style>
