<template>
  <v-container fluid pa-0>
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
      @input="getFiles"
      @input-file="inputFile"
      @input-filter="inputFilter"
    >
      <v-icon size="50">note_add</v-icon>
      <span>Добавить</span>
    </file-upload>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600"
    >
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
      <v-divider style="background: #e3e3e3"></v-divider>
      <v-layout white justify-space-between>
        <v-flex
          shrink
          v-if="$refs.upload && !$refs.upload.uploaded"
        >
          <input
            type="file"
            id="addFile"
            :multiple="multiple"
            style="display: none"
            @input="addFile"
          >
            <v-btn
              width="28px"
              small depressed
              :disabled="loading"
              color="blue-grey"
              class="add-file"
            ><label for="addFile" class="add-file"></label>
              <v-icon size="18">add</v-icon>
            </v-btn>
        </v-flex>
        <v-flex
          mr-3
          text-xs-right
        >
          <v-btn
            v-if="$refs.upload && !$refs.upload.uploaded"
            small depressed
            :loading="loading"
            :disabled="loading"
            color="blue-grey"
            class="white--text"
            @click="upload"
          >
            <v-icon mr-2 size="20" dark>cloud_upload</v-icon>
            <span class="caption pl-2">Загрузить</span>
          </v-btn>
          <v-btn
            v-if="$refs.upload && !$refs.upload.uploaded"
            :disabled="loading"
            color="error"
            small depressed
            @click="dialog = false"
          >
            <span class="caption">Отменить</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-dialog>
  </v-container>
</template>

<script>
import fileUpload from 'vue-upload-with-credential'

export default {
  name: 'file-upload-document-viewer',
  components: {
    fileUpload
  },
  data: () => ({
    dialog: false,
    loading: false,
    files: [],
    attachments: [],
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
  watch: {
    dialog(newValue) {
      if (!newValue) {
        this.files.length = 0
      }
    },
    files(files) {
      if (!files.length) {
        this.dialog = false
      }
    }
  },
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    }
  },
  methods: {
    addFile(event) {
      this.$refs.upload.addInputFile(event.target)
    },
    upload() {
      this.$refs.upload.active = true
      this.loading = true
    },
    attach() {
      this.loading = false
      this.dialog = false
      this.$store.dispatch('sm/addAttachments', this.attachments)
      this.attachments.length = 0
    },
    getFiles(files) {
      if (files.length) {
        this.dialog = true
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && oldFile && newFile.success !== oldFile.success) {
        const fileName = newFile.file.name
        const filePath = newFile.response.fileName
        this.attachments.push({fileName, filePath})
      }
      if (this.$refs.upload && this.$refs.upload.uploaded) {
        this.attach()
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
    height: 100%;
  }

  .upload-action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .upload-action >>> label {
    cursor: pointer;
  }

  button.add-file {
    min-width: 24px;
    margin-left: 23px;
    padding: 0 5px;
    color: white;
  }

  label.add-file {
    position: absolute;
    height: 100%;
    width: 100%;
    cursor: pointer;
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
