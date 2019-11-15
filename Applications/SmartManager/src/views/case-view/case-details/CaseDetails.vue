<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 p-4"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">

          <!-- CASE META ROW -->
          <div class="vx-row border-b border-l-0 border-r-0
                       border-t-0 d-theme-border-grey-light
                       border-solid flex justify-between flex items-center">

            <div class="vx-col sm:w-4/5 w-full flex items-center mb-2">
              <div class="flex flex-col w-11/12">
                <h5 class="mb-1">{{ caseItem.name }}</h5>
                <div class="flex items-center">
                  <h3 class="text-primary truncate">{{ caseItem.purpose }}</h3>
                </div>
              </div>
            </div>
            <div class="vx-col sm:w-1/5 w-full flex sm:flex-col
                        items-center sm:justify-end mb-2">
              <span class="flex sm:mr-0 mr-2 self-end whitespace-no-wrap"
              >{{ time(caseItem.dateAdd) }}</span>
              <span class="flex self-end sm:mt-2 mt-0 whitespace-no-wrap"
              >{{ date(caseItem.dateAdd) }}</span>
              <span class="flex self-end sm:mt-2 mt-0 whitespace-no-wrap"
                    v-if="caseItem.comm"
              >{{ $t('cases.comm') }}: {{ caseItem.comm }}</span>
            </div>
          </div>

          <!-- CASE MEMBERS -->
          <div class="vx-row border-b border-l-0 border-r-0 border-t-0
                      d-theme-border-grey-light border-solid flex">
            <div class="vx-col flex">
              <feather-icon icon="UsersIcon" class="mr-2"/>
              <span class="py-4">{{ $t('cases.members').toUpperCase() }}</span>
            </div>
          </div>
          <div class="vx-row my-3">
            <div class="my-1"
                 v-for="(participant, index) in caseItem.participants"
                 :key="index">
              <vs-chip class="mr-3 max-w-sm">
                <vs-avatar/>
                {{ participant.name }}
              </vs-chip>
            </div>
          </div>

          <!-- CASE ATTACHMENTS -->
          <div class="vx-row border-b border-l-0 border-r-0 border-t-0
                      d-theme-border-grey-light border-solid flex">
            <div class="vx-col flex">
              <feather-icon icon="PaperclipIcon" class="mr-2"/>
              <span class="py-4">{{ $t('tabs.attachments').toUpperCase() }}</span>
            </div>
          </div>
          <div class="vx-row my-3">
            <div class="my-1"
                 v-for="(attachment, index) in caseItem.originals"
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
            <files-upload @attach="getAttachment($event)"
                          resetBtn
                          uploadBtn
                          class="w-full"
            ></files-upload>
          </div>
        </vx-card>
      </div>
    </div>
    <!-- TASKS -->
    <div v-if="tasks.length"
         class="vx-row"
         style="margin-top: 2.2rem">
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full border-b border-l-0 border-r-0
                          border-t-0 d-theme-border-grey-light border-solid mb-6">
                <div class="vx-col w-full flex">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span class="py-4">{{ $t('tasks.related').toUpperCase() }}</span>
                </div>
              </div>
              <div class="vx-row w-full">
                <div class="vx-col w-full">
                  <transition-group name="list-enter-up"
                                    class="task__tasks  -mx-4"
                                    tag="ul"
                                    appear>
                    <li class="cursor-pointer task__task-item"
                        v-for="task in caseItem.tasks"
                        :key="task.id">
                      <task-list-item :task="task"></task-list-item>
                    </li>
                  </transition-group>
                </div>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import TaskListItem from '@/views/task-list/TaskListItem.vue'
import FilesUpload from '@/components/FilesUpload'
import FileIcon from '@/components/FileIcon'

export default {
  props: {
    caseItem: Object
  },
  components: {
    VuePerfectScrollbar,
    TaskListItem,
    FilesUpload,
    FileIcon
  },
  data: () => ({
    defaultDescHeight: 250,
    iFrameHeight: 250,
    showThread: false,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
    options: {noAlerts: true},
    submission: {},
    attachments: [],
    filesUploading: false,
  }),
  computed: {
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
    tasks() {
      return this.caseItem.tasks
        ? this.caseItem.tasks
        : []
    }
  },
  methods: {
    iFrameOnLoad(event) {
      this.iFrameHeight = event.path[0].contentDocument.body.scrollHeight * 1.2
    },
    // обработка смены статуса задачи
    async onChangeStatus(data) {
      const form = this.$refs.form.formio
      try {
        const result = await form.submit()
        await this.$store.dispatch('sm/changeStatus', {
          ...data,
          CompleteParams: JSON.stringify(result.data)
        })
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
          console.log(errors.message)
        }
      }
    },
    getAttachment(event) {
      this.attachments = event
      this.addAttachments()
    },
    async addAttachments() {
      const id = this.$route.params.id
      const attachments = JSON.stringify(this.attachments)
      try {
        await this.$store.dispatch('sm/addAttachments', {id, type: 'CASE', attachments})
        this.attachments.length = 0
      } catch (e) {
        console.log('', e.message)
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

</style>
