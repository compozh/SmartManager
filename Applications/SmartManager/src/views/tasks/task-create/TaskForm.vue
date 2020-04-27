<template>
  <v-menu v-model="form"
          :close-on-content-click="false"
          max-width="800"
          min-height="800"
          max-height="800"
          :nudge-right="100"
          offset-x offset-y
          transition="scroll-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn fixed
             dark fab
             bottom right
             color="primary"
             v-on="on">
        <fa-icon icon="plus"/>
      </v-btn>
    </template>

    <v-card tile class="pa-3">
      <perfect-scrollbar>
        <v-form>
          <v-text-field v-model="name"
                        :label="$t('tasks.taskName')"
                        solo flat dense
                        name="login"
                        type="text"
                        autocomplete="username"
                        class="caption font-weight-bold">
            <template #prepend-inner>
              <fa-icon class="mr-2 primary--text"
                       icon="file-signature"
                       type="fal" size="lg"/>
            </template>
          </v-text-field>

          <task-autocomplete v-model="performer"
                             :items="users"
                             :loading="userListLoading"
                             :label="$t('tasks.performer')"/>

          <quill-editor v-model="description"
                        :options="editorOption"
                        class="mb-8"/>

          <v-btn class="ml-auto" color="primary"
                 @click="() => ({})">{{ $t('buttons.create') }}</v-btn>
        </v-form>
      </perfect-scrollbar>
    </v-card>
  </v-menu>
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
      form: false,
      name: '',
      description: '',
      performer: [],
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
      return this.$store.state.app.users
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
