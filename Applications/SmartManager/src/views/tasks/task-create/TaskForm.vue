<template>
  <v-menu v-model="form"
          :close-on-content-click="false"
          transition="slide-y-reverse-transition">
    <template v-slot:activator="{ on }">
      <v-btn id="addBtn"
             fixed
             width="50"
             height="50"
             dark fab
             bottom right
             color="primary"
             v-on="on">
          <span class="display-1">+</span>
      </v-btn>
    </template>

    <v-card tile style="flex-basis: 0;"
            class="flex-grow-1 overflow-hidden">
      <v-form class="pa-2 d-flex flex-column fill-height"
              @wheel.native.prevent>
        <div class="pa-2 d-flex">
          <v-text-field v-model="name"
                        :label="$t('tasks.taskName')"
                        solo flat dense
                        clearable
                        hide-details
                        name="login"
                        type="text"
                        autocomplete="off"
                        class="font-weight-bold red--text">
            <template #prepend-inner>
              <fa-icon class="mr-2 primary--text"
                       icon="file-signature"/>
            </template>
          </v-text-field>
          <icon-tooltip-btn btnColor="#343434"
                            :btnClick="() => form = false "
                            icon="times" iconSize="2x"
                            tooltipPosition="top">
            {{ $t('buttons.close') }}
          </icon-tooltip-btn>
        </div>

        <perfect-scrollbar class="px-5">
          <task-autocomplete v-model="performer"
                             :items="users"
                             :loading="userListLoading"
                             :label="$t('tasks.performer')"
                             icon="user"/>

          <date-time-pickers/>

          <quill-editor v-model="description"
                        :options="editorOption"
                        class="mb-8"/>

        </perfect-scrollbar>
        <v-spacer></v-spacer>
        <div class="pa-5 d-flex align-center">
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="priority ? 'warning' : 'grey'"
                            :btnClick="() => priority = !priority"
                            icon="flag" iconSize="lg"
                            :iconType="priority ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ 'Priority' /* Add resources */ }}
          </icon-tooltip-btn>
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="myControl ? 'red' : 'grey'"
                            :btnClick="() => myControl = !myControl"
                            icon="exclamation" iconSize="lg"
                            :iconType="myControl ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ 'Control' /* Add resources */ }}
          </icon-tooltip-btn>
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="needApprove ? 'green' : 'grey'"
                            :btnClick="() => needApprove = !needApprove"
                            icon="clipboard-check" iconSize="lg"
                            :iconType="needApprove ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ 'Approve' /* Add resources */ }}
          </icon-tooltip-btn>
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="needComment ? 'blue' : 'grey'"
                            :btnClick="() => needComment = !needComment"
                            icon="comment-alt-lines" iconSize="lg"
                            :iconType="needComment ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ 'Comment' /* Add resources */ }}
          </icon-tooltip-btn>
          <v-spacer></v-spacer>
          <v-btn class="ml-auto" color="primary" small
                 @click="createTask">{{ $t('buttons.create') }}</v-btn>
        </div>
      </v-form>
    </v-card>
  </v-menu>
</template>

<script>
import TaskAutocomplete from './TaskAutocomplete'
import DateTimePickers from './DateTimePickers'
import IconTooltipBtn from '@/components/IconTooltipBtn'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'TaskForm',
  components: {
    TaskAutocomplete,
    DateTimePickers,
    IconTooltipBtn,
    quillEditor
  },
  data () {
    return {
      form: false,
      name: '',
      description: '',
      performer: [],
      priority: false,
      myControl: false,
      needApprove: false,
      needComment: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
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
    },
    async createTask () {
      const newTask = {
        name: this.name,
        performerId: this.performer.userId,
        needApprove: this.needApprove,
        needComm: this.needComment,
        priority: Number(this.priority),
        caseId: 0
      }
      if (this.$route.params.taskId) {
        newTask.parentTaskId = this.$route.params.taskId
      }
      try {
        const result = await this.$store.dispatch('createTask', newTask)
        if (result.success) {
          await this.$router.push({
            name: 'task-details',
            params: { taskId: result.id }
          })
        }
      } catch (e) {
        // Задержка нужна чтобы показать сообщение об ошибке
        setTimeout(() => this.$router.go(0), 1000)
      }
    }
  }
}
</script>

<style scoped>

  #addBtn {
    background: url(../../../assets/action_btn_bg.png) center/contain no-repeat #7b68ee;
  }

  .v-menu__content {
    display: flex;
    flex-direction: column;
    top: auto !important;
    left: auto !important;
    bottom: 60px;
    right: 60px;
    height: 450px;
    width: 600px;
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

  .quill-editor >>> .ql-toolbar button {
    height: 20px;
    width: 20px;
    padding: 3px;
  }

  .quill-editor >>> .ql-container {
    border: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .quill-editor >>> .ql-editor {
    min-height: 100px;
  }

  .circle-border {
    border: 1px dashed grey;
  }

</style>
