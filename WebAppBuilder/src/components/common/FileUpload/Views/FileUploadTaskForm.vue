<template>
  <file-upload-rl v-slot="{files, options, events}">
    <v-container fluid pa-0>
      <v-layout class="upload-container wrap">
        <v-flex v-if="files.value.length" xs12 pb-3>
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
        </v-flex>
        <v-flex>
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
            @input-file="events.inputFile"
            @input-filter="events.inputFilter"
          >
           <span
             class="upload-btn grey--text text--darken-1 subheading font-weight-light">
             <v-icon size="30">attach_file</v-icon>
             <span class="hidden-xs-only">Добавить вложение</span>
           </span>
          </file-upload>
        </v-flex>
      </v-layout>
    </v-container>
  </file-upload-rl>
</template>

<script>
  import fileUpload from 'vue-upload-component'

  export default {
    name: "file-upload-task-form",
    data: () => ({
      headers: [
        {text: 'Название файла', value: 'name'},
        {text: 'Размер', value: 'size', align: 'center'},
        {text: 'Загружено', value: 'upload', align: 'center'},
        {text: 'Действия', value: 'actions', align: 'center'}
      ]
    }),
    components: {
      fileUpload
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
</style>