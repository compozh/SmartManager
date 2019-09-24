<template>
  <div
    class="app-fixed-height border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <VuePerfectScrollbar
      class="scroll-area"
      :settings="settings"
    >
      <div class="vx-row form-container">
        <div class="vx-col w-full h-full">
          <vx-card>
            <!-- TASK APPROVALS -->
            <div class="vx-row">
              <div class="vx-col w-full">
                <!-- add task -->
                <form @submit.prevent>
                  <vs-input
                    v-validate="'required'"
                    name="taskName"
                    :label-placeholder="$t('tasks.taskName')"
                    v-model="newTask.title"
                    class="w-full mb-6"
                    :danger="errors.has('taskName')"
                    :danger-text="$t('validate.required')"
                    val-icon-danger="clear"
                    :success="validateForm && !!newTask.title"
                    val-icon-success="done"
                    :color="validateForm ? 'success' : 'danger'"
                  />

                  <task-add-select
                    :users="users"
                    :multiple="false"
                    :loading="isLoading"
                    v-model="newTask.performer"
                    :placeholder="$t('tasks.performer')"
                    class="mb-6"
                  />

                  <div>{{ $t('tasks.deadline') }}:</div>
                  <div class="inline-flex flex-wrap items-center mr-12 my-6">
                    <span class="w-16">{{ $t('pickers.date') }}:</span>
                    <flat-pickr
                      :config="configDatePicker"
                      v-model="newTask.planDate"
                    />
                  </div>

                  <div class="inline-flex flex-wrap items-center mb-6">
                    <span class="w-16">{{ $t('pickers.time') }}:</span>
                    <flat-pickr
                      :config="configTimePicker"
                      v-model="newTask.planTime"
                    />
                  </div>

                  <quill-editor
                    v-model="newTask.description"
                    :placeholder="$t('tasks.description')"
                    :options="editorOption"
                    class="mb-6"
                  ></quill-editor>

                  <task-add-select
                    :users="users"
                    :multiple="true"
                    :loading="isLoading"
                    v-model="newTask.coexecutors"
                    :placeholder="$t('roles.coExecutors')"
                    class="my-6"
                  />

                  <task-add-select
                    :users="users"
                    :multiple="true"
                    :loading="isLoading"
                    v-model="newTask.notify"
                    :placeholder="$t('roles.notify')"
                  />

                  <vs-upload
                    multiple
                    :text="$t('buttons.addAttachment')"
                    :show-upload-button="false"
                    class="vs-upload"
                  />
                  <vs-divider></vs-divider>
                  <div class="flex justify-end">
                    <vs-button
                      class="mx-6"
                      color="primary"
                      type="flat"
                    >{{ $t('buttons.cancel') }}</vs-button>
                    <vs-button
                      type="gradient"
                      @click="createTask()"
                    >{{ $t('buttons.create') }}</vs-button>
                  </div>
                </form>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </VuePerfectScrollbar>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import {quillEditor} from 'vue-quill-editor'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import TaskAddSelect from './TaskAddSelect'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { Ukrainian } from 'flatpickr/dist/l10n/uk.js'

export default {
  components: {
    quillEditor,
    VuePerfectScrollbar,
    TaskAddSelect,
    flatPickr
  },
  props: {
    parent: Number
  },
  data() {
    return {
      newTask: {
        title: '',
        performer: null,
        planDate: moment().add(1, 'days').format('DD.MM.YYYY'),
        planTime: '12:00',
        description: '',
        coexecutors: [],
        notify: [],
        attachments: []
      },
      configDatePicker: {
        locale: this.$i18n.locale,
        dateFormat: 'd.m.Y',
        minDate: new Date(),
        allowInput: true
      },
      configTimePicker: {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        allowInput: true
      },
      isLoading: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'code-block'],
            [{'header': 1}, {'header': 2}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'font': []}],
          ],
        },
        placeholder: this.$t('tasks.description')
      },
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.30,
      }
    }
  },
  computed: {
    users() {
      return this.$store.state.sm.users
    },
    validateForm() {
      return !this.errors.any() && !!this.taskName
    },
    dateplan() {
      const formatDate = moment(this.newTask.planDate, 'DD.MM.YYYY')
        .format('YYYY-MM-DD')
      return `${formatDate} ${this.newTask.planTime}`
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      this.isLoading = true
      const users = this.$store.state.sm.users
      if (users.length === 0) {
        await this.$store.dispatch('sm/getUsers')
      }
      this.isLoading = false
    },
    async createTask() {
      const newTask = {
        name: this.newTask.title,
        performerId: this.newTask.performer.userId,
        descript: this.newTask.description,
        dateplan: this.dateplan,
        participants: this.getParticipants(),
        attachments: this.newTask.attachments,
        needApprove: false,
        needComm: false,
        priority: 0
      }
      if (this.parent) {
        newTask.parentTaskId = this.parent
      }
      await this.$store.dispatch('sm/addNewTask', newTask)
      if (this.parent) {
        await this.$store.dispatch('sm/getTaskInfo', {
          taskId: this.parent,
          loader: false
        })
      }
    },
    getParticipants() {
      const executor = [{userId: this.newTask.performer.userId, role: ''}]
      const coexecutors = this.newTask.coexecutors.map(i => {
        return {userId: i.userId, role: 'COEXECUTOR'}
      })
      const observers = this.newTask.notify.map(i => {
        return {userId: i.userId, role: 'OBSERVER'}
      })
      return [
        ...executor,
        ...coexecutors,
        ...observers
      ]
    }
  }
}
</script>

<style scoped>

  .vs-sidebar.vs-sidebar-reduce {
    max-width: 64px;
  }

  .form-container {
    margin: 15px 0;
  }

  .vs-upload >>> .con-img-upload {
    margin: 0;
    padding: 0;
  }
  .vs-upload >>> .con-input-upload {
    width: 99%;
    height: 2.5rem;
    margin: 1.1rem auto 0 auto;
    float: none;
  }
</style>
