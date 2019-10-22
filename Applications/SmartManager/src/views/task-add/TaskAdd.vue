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
                  <vs-input name="taskName"
                            :label-placeholder="$t('tasks.taskName')"
                            v-model="newTask.title"
                            class="w-full mb-6"
                            v-validate="'required'"
                            :danger="errors.has('taskName')"
                            :danger-text="$t('validate.required')"
                            val-icon-danger="clear"
                  />
                  <sm-autocomplete :items="users"
                                   :multiple="false"
                                   :loading="userListLoading"
                                   v-model="newTask.performer"
                                   label="fio"
                                   :placeholder="$t('tasks.performer')"
                                   name="performer"
                                   v-validate="'required'"
                  />
                  <span v-if="errors.has('performer')"
                        class="required-text"
                  >{{ $t('validate.required') }}
                  </span>
                  <div class="mt-3">{{ $t('tasks.deadline') }}:</div>
                  <div class="inline-flex flex-wrap items-center mr-12 mt-3 mb-6">
                    <span class="w-16">{{ $t('pickers.date') }}:</span>
                    <div class="date-wrapper">
                      <flat-pickr
                        :config="configDatePicker"
                        v-model="newTask.planDate"
                        name="date"
                        v-validate="'required'"
                      />
                      <span v-if="errors.has('date')"
                            class="required-text"
                      >{{ $t('validate.required') }}
                      </span>
                    </div>
                  </div>

                  <div class="inline-flex flex-wrap items-center mb-12">
                    <span class="w-16">{{ $t('pickers.time') }}:</span>
                    <div class="time-wrapper">
                      <flat-pickr
                        :config="configTimePicker"
                        v-model="newTask.planTime"
                        name="time"
                        v-validate="'required'"
                      />
                      <span v-if="errors.has('time')"
                            class="required-text"
                      >{{ $t('validate.required') }}
                    </span>
                    </div>
                  </div>
                  <quill-editor v-model="newTask.description"
                                :placeholder="$t('tasks.description')"
                                :options="editorOption"
                                class="mb-6"
                  ></quill-editor>
                  <sm-autocomplete :items="users"
                                   :multiple="true"
                                   :loading="userListLoading"
                                   label="fio"
                                   v-model="newTask.coexecutors"
                                   :placeholder="$t('roles.coExecutors')"
                                   class="my-6"
                  />
                  <sm-autocomplete :items="users"
                                   :multiple="true"
                                   label="fio"
                                   :loading="userListLoading"
                                   v-model="newTask.notify"
                                   :placeholder="$t('roles.notify')"
                  />
                  <files-upload
                    v-on:attach="getAttachment($event)"
                    :uploading="filesUploading"
                    class="mt-3"
                  >
                  </files-upload>
                  <vs-divider></vs-divider>
                  <div class="flex justify-end">
                    <vs-button class="mx-6"
                               color="primary"
                               type="flat"
                               @click="$router.go(-1)"
                    >{{ $t('buttons.cancel') }}
                    </vs-button>
                    <vs-button
                      type="gradient"
                      @click="submitForm"
                    >{{ $t('buttons.create') }}
                    </vs-button>
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
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Autocomplete from '@/components/Autocomplete'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import {Russian} from 'flatpickr/dist/l10n/ru.js'
import {Ukrainian} from 'flatpickr/dist/l10n/uk.js'
import FilesUpload from '@/components/FilesUpload'

export default {
  components: {
    quillEditor,
    VuePerfectScrollbar,
    Autocomplete,
    flatPickr,
    FilesUpload
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
      userListLoading: false,
      filesUploading: false,
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']                                         // remove formatting button
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
    dateplan() {
      const formatDate = moment(this.newTask.planDate, 'DD.MM.YYYY')
        .format('YYYY-MM-DD')
      return `${formatDate} ${this.newTask.planTime}`
    },
    htmlDescription() {
      return `<body>${this.newTask.description}</body>`
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      this.userListLoading = true
      const users = this.$store.state.sm.users
      if (users.length === 0) {
        await this.$store.dispatch('sm/getUsers')
      }
      this.userListLoading = false
    },
    async createTask() {
      const newTask = {
        name: this.newTask.title,
        performerId: this.newTask.performer.userId,
        descript: this.htmlDescription,
        dateplan: this.dateplan,
        participants: this.getParticipants(),
        attachments: this.newTask.attachments,
        needApprove: false,
        needComm: false,
        priority: 0
      }
      if (this.$route.params.id) {
        newTask.parentTaskId = this.$route.params.id
      }
      try {
        const result = await this.$store.dispatch('sm/addNewTask', newTask)
        if (this.parent) {
          await this.$store.dispatch('sm/getTaskInfo', {
            taskId: this.parent,
            loader: false
          })
        }
        if (result.success) {
          await this.$router.push({name: 'task-view', params: {id: result.id}})
        }
      } catch (e) {
        setTimeout(() => this.$router.go(0), 1000)
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
    },
    upload() {
      this.filesUploading = true
    },
    getAttachment(event) {
      this.newTask.attachments = event
      this.createTask()
    },
    async submitForm() {
      const result = await this.$validator.validateAll()
      if (result) {
        this.upload()
      }
    }
  }
}
</script>

<style scoped>

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

  .date-wrapper,
  .time-wrapper {
    position: relative;
  }

  .date-wrapper .required-text,
  .time-wrapper .required-text {
    position: absolute;
    top: 100%;
  }

  .required-text {
    color: rgba(var(--vs-danger),1)!important;
    position: relative;
    font-size: .65rem;
    overflow: hidden;
    transition: all .25s ease;
    padding: 2px 4px 4px 4px;
    display: block;
  }
</style>
