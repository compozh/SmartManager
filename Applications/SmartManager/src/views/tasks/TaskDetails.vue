<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">
          <!-- TASK META ROW -->
          <div class="vx-row border-b border-l-0 border-r-0
                         border-t-0 d-theme-border-grey-light
                         border-solid flex justify-between flex items-center">

            <div class="vx-col sm:w-4/5 w-full flex items-center mb-2">
              <vs-avatar class="sender__avatar--single flex-shrink-0
                                  mr-3 border-2 border-solid border-white"
                         :src="task.performerPhoto"
                         size="65px"></vs-avatar>

              <div class="flex flex-col w-9/12">
                <h5 class="mb-1">{{ task.performer }}</h5>
                <div class="flex items-center">
                  <h3 class="text-primary truncate">{{ task.name }}</h3>
                </div>
              </div>
            </div>
            <div class="vx-col xs:w-10/12 lg:w-1/5 w-full flex lg:flex-col
                          items-center xs:justify-start lg:justify-end mb-2">
                <span class="flex lg:mr-0 xs:ml-2 mr-2 self-end whitespace-no-wrap lg:order-first"
                >{{ time(task.dateAdd) }}</span>
              <span class="flex self-end lg:mt-2 mt-0 whitespace-no-wrap xs:order-first"
              >{{ date(task.dateAdd) }}</span>
              <span class="flex self-end lg:mt-2 mt-0 whitespace-no-wrap xs:hidden lg:block"
              >Тип: {{ typeName }}</span>
            </div>
          </div>

          <!-- TASK CONTENT -->
          <div class="vx-row border-b border-l-0 border-r-0
                        border-t-0 d-theme-border-grey-light"
               :class="{'border-solid': htmlDescription || docTextHtml}">
            <div class="vx-col w-full">
              <div v-if="htmlDescription" class="mail__content break-words mt-8 mb-4">
                <iframe seamless
                        scrolling="no"
                        width="100%"
                        :height="iFrameHeight1"
                        frameborder="0"
                        :srcdoc="htmlDescription"
                        @load="iFrameOnLoad(1, $event)"
                        style="pointer-events: none"/>
              </div>
              <div v-if="docTextHtml">
                <iframe seamless
                        scrolling="no"
                        width="100%"
                        :height="iFrameHeight2"
                        frameborder="0"
                        :srcdoc="docTextHtml"
                        @load="iFrameOnLoad(2, $event)"
                        style="pointer-events: none"/>
              </div>
            </div>
          </div>

          <!-- FORMIO -->
          <div v-if="Object.keys(form).length" class="w-full">
            <h5 class="mt-4">{{ form.name }}</h5>

            <formio-form-component class="formio"
                                   ref="form"
                                   :formCode="form.unformio"
                                   :formDefinition="form"
                                   :submission="submission"/>
          </div>
          <!-- TASK ATTACHMENTS -->
          <div class="vx-row border-b border-l-0 border-r-0 border-t-0
                        d-theme-border-grey-light border-solid flex">
            <div class="vx-col flex">
              <feather-icon icon="PaperclipIcon" class="mr-2"/>
              <span class="py-4">{{ $t('tabs.attachments').toUpperCase() }}</span>
            </div>
          </div>
          <div class="vx-row my-3">
            <div class="my-1"
                 v-for="(attachment, index) in task.originals"
                 :key="index"
                 @click="$emit('open-attachment', index)">
              <vx-tooltip :text="attachment.fileName" color="rgb(98, 98, 98, .95)">
                <vs-chip class="mr-3 max-w-sm chips">
                  <span class="icon flex mr-2">
                    <file-icon :extention="attachment.fileExt"></file-icon>
                  </span>
                  <span class="custom-truncate">{{ attachment.fileName }}</span>
                </vs-chip>
              </vx-tooltip>
            </div>
          </div>
          <div class="vx-row">
            <files-upload class="w-full"
                          @attach="getAttachment($event)"
                          :uploadErrors="uploadErrors"
                          uploadAuto/>
          </div>
        </vx-card>
      </div>
    </div>
    <!-- PARENT TASKS -->
    <div v-if="parentTask"
         class="vx-row"
         style="margin-top: 2.2rem">
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full border-b border-l-0 border-r-0
                            border-t-0 d-theme-border-grey-light border-solid mb-6">
                <div class="vx-col w-full flex pb-4">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span class="self-end">{{ $t('tasks.base').toUpperCase() }}</span>
                </div>
              </div>
              <div class="vx-row w-full">
                <div class="vx-col w-full">
                  <transition-group name="list-enter-up"
                                    class="task__tasks  -mx-4"
                                    tag="ul"
                                    appear>
                    <li class="cursor-pointer task__task-item" :key="parentTask.id">
                      <task-list-item :task="parentTask"/>
                    </li>
                  </transition-group>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <!-- SUB TASKS -->
    <div class="vx-row"
         style="margin-top: 2.2rem">
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full justify-between border-b border-l-0 border-r-0
                            border-t-0 d-theme-border-grey-light border-solid">
                <div class="vx-col flex items-center pb-4">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span v-if="childTasks.length" class="pt-1">{{ $t('tasks.subTasks').toUpperCase() }}</span>
                  <span v-else class="pt-1">{{ $t('tasks.noSubTasks').toUpperCase() }}</span>
                </div>
                <div class="flex pb-4">
                  <vs-button :to="{name: 'task-add', params: {taskId: task.id}}"
                             class="ml-3"
                             color="primary"
                             size="small"
                             type="border"
                             icon="library_add">{{ $t('buttons.addSubTask') }}</vs-button>
                </div>
              </div>
              <div class="vx-row w-full">
                <div class="vx-col w-full">
                  <transition-group name="list-enter-up"
                                    class="task__tasks -mx-4"
                                    tag="ul"
                                    appear>
                    <li class="cursor-pointer task__task-item"
                        v-for="subTask in task.childTasks"
                        :key="subTask.id">
                      <task-list-item :task="subTask"></task-list-item>
                    </li>
                  </transition-group>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import TaskListItem from '@/views/tasks/task-list/TaskListItem.vue'
import FilesUpload from '@/components/FilesUpload'
import FileIcon from '@/components/FileIcon'
import {eventBus} from '@/main'

export default {
  components: {
    TaskListItem,
    FilesUpload,
    FileIcon
  },
  data: () => ({
    defaultDescHeight: 250,
    iFrameHeight1: 250,
    iFrameHeight2: 250,
    showThread: false,
    options: {noAlerts: true},
    attachments: [],
    filesUploading: false,
    uploadErrors: [],
    caseListLoading: false,
    caseList: false,
    caseForBind: null
  }),
  computed: {
    task() {
      const id = +this.$route.params.taskId
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    externalParams() {
      if (this.task.externalParams) {
        return JSON.parse(this.task.externalParams) || {}
      }
      return {}
    },
    form() {
      if (this.externalParams.FORM) {
        return JSON.parse(this.externalParams.FORM) || {}
      }
      return {}
    },
    submission() {
      const vars = {}
      if (this.externalParams.VARIABLES) {
        this.externalParams.VARIABLES
          .forEach(variable => vars[variable['Key']] = variable.Value.value)
      }
      return vars
    },
    time() {
      return dateTime => dateTime
        ? dateTime.split(' ').pop()
        : ''
    },
    date() {
      return dateTime => dateTime
        ? dateTime.split(' ').shift()
        : ''
    },
    docTextHtml() {
      return this.parseDescription(this.task.docTextHtml)
    },
    htmlDescription() {
      return this.parseDescription(this.task.htmlDescript)
    },
    parseDescription() {
      return description => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(description, 'text/html')
        const body = doc.body.innerHTML.trim()
        return body ? description : body
      }
    },
    parentTask() {
      return this.task.parentTask && this.task.parentTask.id
        ? this.task.parentTask
        : null
    },
    childTasks() {
      return this.task.childTasks
        ? this.task.childTasks
        : []
    },
    taskType() {
      return this.task ? this.task.taskType : null
    },
    typeName() {
      switch (this.taskType) {
        case '': return 'обычная задача/документ'
        case 'AGREE': return 'согласование'
        case 'WORKFLOW': return 'выполнение БП'
        case 'EXTERNAL': return 'внешняя задача'
        default: return 'unknown type'
      }
    },
  },
  watch: {
    '$route'(route) {
      if (route.name === 'task-details') {
        this.getTask()
      }
    }
  },
  created() {
    // подписка на событие смены статуса задачи
    eventBus.$on('changeStatus', async data => {
      await this.onChangeStatus(data)
    })
    this.getTask()
  },
  methods: {
    async getTask() {
      const taskId = +this.$route.params.taskId
      if (!this.task.id) {
        try {
          await this.$store.dispatch('sm/getTaskInfo', {
            taskId, loading: true
          })
        } catch (e) {
          console.log(e.message)
        }
      }
    },
    submit() {
      console.log('submit', )
    },
    iFrameOnLoad(frame, event) {
      const iFrameBody = event.path[0].contentDocument.body
      this['iFrameHeight' + frame] = iFrameBody.scrollHeight * 1.2
      iFrameBody.style.fontFamily = 'Helvetica, sans-serif'
    },
    // обработка смены статуса задачи
    async onChangeStatus(data) {
      if (this.$refs.form) {
        const form = this.$refs.form.$refs.formioComponent.formio
        try {
          const result = await form.submit()
          const success = await this.$store.dispatch('sm/changeStatus', {
            ...data,
            CompleteParams: JSON.stringify(result.data)
          })
          if (data.status === '+' && success) {
            await this.$router.push('/')
          }
        } catch (errors) {
          if (errors.length) {
            errors.forEach(e => {
              this.$vs.notify({
                title: this.$t('notify.bpTitle'),
                text: e.message,
                color: 'danger'
              })
            })
          } else {
            console.log(errors)
          }
        }
      }
    },
    getAttachment(event) {
      this.attachments = event
      this.addAttachments()
    },
    async addAttachments() {
      const attachments = JSON.stringify(this.attachments)
      const params = {
        id: this.task.id || this.$route.params.taskId,
        type: this.task.isGenerate ? 'DOCUMENT' : 'TASK',
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy
      }
      // Returns results list
      const results = await this.$store.dispatch('sm/addAttachments', {attachments, params})
      results.forEach(result => {
        if (!result.success) {
          this.uploadErrors.push({
            fileName: result.name,
            message: result.errorMessage
          })
        }
      })
      this.attachments.length = 0
    },
    async changeBinding(bind) {
      try {
        await this.$store.dispatch('sm/changeBinding', {
          caseId: bind ? this.caseForBind.id : this.task.caseId,
          taskId: this.task.id,
          bind
        })
        this.caseList = this.caseForBind = null
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>

<style scoped lang="scss">

  .chips {
    cursor: pointer;

    span {
      .icon {
        color: #7367F0;
      }
    }

    &:hover {
      background: #7367F0;

      span {
        color: white;

        .icon {
          color: white;
        }
      }
    }
  }

  button:hover {
    -webkit-transform: translateY(-2px);
    transform: translateY(-2px);
  }

</style>
