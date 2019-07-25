<template>
  <file-upload-rl v-slot="{files, options, events}">
    <v-container fluid pa-0>
      <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <v-data-table
          class="elevation-1"
          disable-initial-sort
          :items="files.value"
          :headers="headers"
          hide-actions
          sort-icon=""
        >
          <template v-slot:items="props">
            <td class="text-xs-left">{{ props.item.name }}</td>
            <td class="text-xs-center"
                :class="{'red--text text--darken-2' : props.item.size >= options.size}"
            >{{ (props.item.size / 1024 / 1024).toFixed(2) }} Mb
            </td>
            <td class="text-xs-center">{{ props.item.progress }} %</td>
            <td>
              <v-btn v-if="props.item.size >= options.size" icon>
                <v-icon size="20" class="red--text text--darken-2">warning</v-icon>
              </v-btn>
              <v-btn v-else icon @click.prevent="$refs.upload.active = true">
                <v-icon size="20" class="grey--text text--darken-1">cloud_upload</v-icon>
              </v-btn>
              <v-btn icon @click="events.remove(props.item.id)">
                <v-icon size="20" class="grey--text text--darken-1">close</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
      </v-dialog>
      <file-upload
        ref="upload"
        class="upload-action"
        v-model="files.value"
        :extensions="options.extensions"
        :accept="options.mimeTypes"
        :multiple="options.multiple"
        :size="options.size"
        :chunk-enabled="options.chunk"
        :chunk="{
            action: options.actions,
            minSize: options.chunkMinSize,
            maxActive: options.chunkMaxActive,
            maxRetries: options.chunkMaxRetries,
          }"
        :post-action="options.action"
        @input="getFiles"
        @input-file="events.inputFile"
        @input-filter="events.inputFilter"
      >
        <v-icon size="50">note_add</v-icon>
        <span>Добавить</span>
      </file-upload>
    </v-container>
  </file-upload-rl>
</template>

<script>
  import fileUpload from 'vue-upload-component'

  export default {
    name: "file-upload-document-viewer",
    data: () => ({
      dialog: false,
      headers: [
        {text: 'Название файла', value: 'name'},
        {text: 'Размер', value: 'size', align: 'center'},
        {text: 'Загружено', value: 'upload', align: 'center'},
        {text: 'Действия', value: 'actions', align: 'center'}
      ]
    }),
    components: {
      fileUpload
    },
    methods: {
      getFiles(files) {
        if (files.length) {
          this.dialog = true
        }
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

</style>