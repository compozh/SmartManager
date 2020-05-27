<template>
  <v-menu v-model="form"
          :close-on-content-click="false"
          :close-on-click="false"
          transition="slide-y-reverse-transition">
    <template v-slot:activator="{ on }">
      <v-btn id="addBtn"
             fixed
             width="45"
             height="45"
             dark fab
             bottom right
             color="primary"
             v-on="on">
          <span class="display-1 white--text font-weight-bold">+</span>
      </v-btn>
    </template>

    <v-card tile style="flex-basis: 0;"
            class="flex-grow-1 overflow-hidden">
      <v-form class="pa-2 d-flex flex-column fill-height"
              ref="form"
              v-model="valid"
              @wheel.native.prevent>
        <div class="px-2 pt-2 d-flex">
          <v-text-field id="taskName"
                        v-model="name"
                        autofocus
                        tabindex="1"
                        @focus.once="formFocus"
                        :rules="required"
                        :label="$t('tasks.taskName')"
                        solo flat dense
                        clearable
                        type="text"
                        autocomplete="off"
                        class="black--text">
          </v-text-field>
          <icon-tooltip-btn btnColor="#343434"
                            :btnClick="closeForm"
                            icon="times" iconSize="2x"
                            tooltipPosition="top">
            {{ $t('buttons.close') }}
          </icon-tooltip-btn>
        </div>

        <perfect-scrollbar class="px-5">
          <div class="d-flex align-start">
            <task-autocomplete v-model="performer"
                               @remove="performer = {}"
                               :items="users"
                               :loading="userListLoading"
                               :label="$t('tasks.performer')"
                               icon="user"
                               class="mr-3"
            style="width: 50%">
              <template #icon>
                <v-btn text fab x-small
                       dark depressed
                       color="grey" class="mr-2"
                       style="border: 1px dashed;">
                  <fa-icon icon="user" type="fal" size="lg"/>
                </v-btn>
              </template>
            </task-autocomplete >
            <date-time-pickers class="ml-auto"/>
          </div>

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
            {{ $t('icons.priority') }}
          </icon-tooltip-btn>
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="needApprove ? 'green' : 'grey'"
                            :btnClick="() => needApprove = !needApprove"
                            icon="clipboard-check" iconSize="lg"
                            :iconType="needApprove ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ $t('icons.control') }}
          </icon-tooltip-btn>
          <icon-tooltip-btn btnClass="mr-3"
                            btnStyle="border: 1px dashed;"
                            :btnColor="needComment ? 'blue' : 'grey'"
                            :btnClick="() => needComment = !needComment"
                            icon="comment-alt-lines" iconSize="lg"
                            :iconType="needComment ? 'far' : 'fal'"
                            tooltipPosition="top">
            {{ $t('icons.needComment') }}
          </icon-tooltip-btn>
          <v-spacer></v-spacer>
          <v-btn class="ml-auto"
                 color="primary" small
                 tabindex="6"
                 :disabled="!valid"
                 @click="createTask">
            {{ $t('buttons.create') }}
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-menu>
</template>

<script>
import TaskAutocomplete from './TaskAutocomplete'
import DateTimePickers from './DateTimePickers'
import IconTooltipBtn from '@/components/IconTooltipBtn'
import { date } from '@/mixins/dateTime'
import { users } from '@/mixins/users'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'

export default {
  name: 'TaskForm',
  mixins: [date, users],
  components: {
    TaskAutocomplete,
    DateTimePickers,
    IconTooltipBtn,
    quillEditor
  },
  data () {
    return {
      form: false,
      valid: '',
      name: '',
      planDate: {
        value: ''
      },
      description: '',
      performer: [],
      attachments: [],
      priority: false,
      myControl: false,
      needApprove: false,
      needComment: false
    }
  },
  computed: {
    htmlDescription () {
      const description = this.description
      return description ? `<body>${description}</body>` : ''
    },
    required () {
      return [
        v => !!v || this.$t('validate.required')
      ]
    },
    editorOption () {
      return {
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
      }
    }
  },
  methods: {
    formFocus () {
      const quill = document.querySelector('.ql-editor')
      if (quill) {
        quill.setAttribute('tabindex', 5)
      }
    },
    async createTask () {
      const newTask = {
        name: this.name,
        performerId: this.performer.userId,
        descript: this.htmlDescription,
        needApprove: this.needApprove,
        needComm: this.needComment,
        priority: Number(this.priority),
        attachments: [],
        caseId: 0
      }
      this.closeForm()
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
    },
    closeForm () {
      this.resetForm()
      this.form = false
    },
    validate () {
      this.$refs.form.validate()
    },
    resetForm () {
      this.$refs.form.reset()
      this.description = ''
      this.priority = false
      this.myControl = false
      this.needApprove = false
      this.needComment = false
    }
  }
}
</script>

<style scoped>

  #addBtn {
    background: url(../../../assets/action_btn_bg.png) center/contain no-repeat #7b68ee;
  }

  .v-form {
    font-size: 18px
  }

  .v-menu__content {
    display: flex;
    flex-direction: column;
    top: auto !important;
    left: auto !important;
    bottom: 55px;
    right: 55px;
    height: 450px;
    width: 600px;
  }

  .v-input >>> label[for="taskName"],
  .v-input >>> input {
    color: #9e9e9e !important;
    font-size: 18px;
  }

  .quill-editor {
    border: 1px solid #e2e2e2;
    border-radius: 5px;
  }

  .quill-editor:hover {
    border-color: #cbcbcb;
  }

  .quill-editor >>> .ql-toolbar {
    border: none;
    border-bottom: 1px solid #e2e2e2;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    padding: 2px 0;
    text-align: center;
  }

  .quill-editor >>> .ql-toolbar button {
    height: 20px;
    width: 20px;
    padding: 3px;
  }

  .quill-editor >>> .ql-container .ql-editor::before {
    border: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .quill-editor >>> .ql-container {
    border: none;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-style: normal;
  }

  .quill-editor >>> .ql-editor {
    min-height: 100px;
  }

  .quill-editor >>> .ql-editor::before {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #cccccc;
    letter-spacing: 1px;
  }

  .quill-editor >>> .ql-editor p {
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
  }

</style>
