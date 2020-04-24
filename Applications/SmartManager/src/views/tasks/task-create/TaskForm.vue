<template>
  <v-form class="pa-10 flex-grow-1 overflow-hidden white"
          style="flex-basis: 0; border-radius: 5px;">
    <v-text-field v-model="name"
                  :label="$t('tasks.taskName')"
                  outlined
                  name="login"
                  type="text"
                  autocomplete="username"
                  class="body-2">
      <template #prepend-inner>
        <fa-icon class="mr-2 primary--text" icon="file-signature" type="fal" size="lg"/>
      </template>
    </v-text-field>

    <task-autocomplete v-model="performer"
                       :items="users"
                       :loading="userListLoading"
                       :label="$t('tasks.performer')"/>

    <span>{{ performer }}</span>

    <v-text-field v-model="description"
                  :label="$t('tasks.description')"
                  outlined
                  name="description"
                  type="text"
                  autocomplete="username"
                  class="body-2">
      <template #prepend-inner>
        <fa-icon class="mr-3 primary--text" icon="user" type="fal" size="lg"/>
      </template>
    </v-text-field>

    <quill-editor v-model="description"
                  :options="editorOption"
                  class="mb-8"/>

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
      <v-btn class="mr-4" @click="() => ({})">{{ $t('buttons.cancel') }}</v-btn>
      <v-btn color="primary" @click="() => ({})">{{ $t('buttons.create') }}</v-btn>
    </div>
  </v-form>
</template>

<script>
import TaskAutocomplete from './TaskAutocomplete'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'TaskForm',
  components: {
    TaskAutocomplete,
    quillEditor
  },
  data () {
    return {
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
        placeholder: this.$t('tasks.description') + '...'
      },
      userListLoading: false
    }
  },
  computed: {
    users () {
      return this.$store.state.app.users || []
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      this.userListLoading = true
      if (!this.users) {
        await this.$store.dispatch('getUsers')
      }
      this.userListLoading = false
    }
  }
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

  .quill-editor {
    border: 1px solid #9e9e9e;
    border-radius: 5px;
  }

  .quill-editor:hover {
    border-color: black;
  }

  .quill-editor >>> .ql-toolbar {
    background: #f5f5f5;
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .quill-editor >>> .ql-container {
    border: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .quill-editor >>> .ql-editor {
    min-height: 100px;
  }

</style>
