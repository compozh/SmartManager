<template>
  <v-form class="pa-3 flex-grow-1 overflow-hidden white"
          style="flex-basis: 0; border-radius: 5px;">
    <v-text-field v-model="name"
                  :label="$t('task.name')"
                  outlined
                  name="login"
                  type="text"
                  autocomplete="username"
                  class="body-2">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-user</v-icon>
      </template>
    </v-text-field>
    <v-text-field v-model="description"
                  :label="$t('task.description')"
                  outlined
                  name="description"
                  type="text"
                  autocomplete="username"
                  class="body-2">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-user</v-icon>
      </template>
    </v-text-field>

    <quill-editor v-model="description"
                  :placeholder="$t('tasks.description')"
                  :options="editorOption"
                  class="mb-6"/>

    <v-text-field v-model="performer"
                  :label="$t('task.performer')"
                  outlined
                  name="login"
                  type="text"
                  autocomplete="username"
                  class="body-2">
      <template #prepend-inner>
        <v-icon small class="pt-1 pr-2">fas fa-user</v-icon>
      </template>
    </v-text-field>
    <div>
      <v-btn class="mr-4" @click="submit">submit</v-btn>
      <v-btn @click="clear">clear</v-btn>
    </div>
  </v-form>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'TaskForm',
  components: {
    quillEditor
  },
  data: () => ({
    name: '',
    description: '',
    performer: '',
    editorOption: {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'] // remove formatting button
        ]
      },
      placeholder: this.$t('tasks.description')
    }
  })
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

</style>
