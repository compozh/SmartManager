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
                <div class="flex items-center mb-2">
                  <h5 class="mb-2 hover:bg-white hover:border-gray-300">{{ caseItem.name }}</h5>
                </div>
                <div class="flex items-center mb-2">
                  <h3 class="text-primary truncate">{{ caseItem.purpose }}</h3>
                </div>
                <div class="flex items-center mb-2">
                  <span>{{ caseItem.comm }}</span>
                </div>
              </div>
            </div>
            <div class="vx-col sm:w-1/5 w-full flex sm:flex-col
                        items-center sm:justify-end mb-2">
              <span v-if="dateFrom" class="flex p-2 self-end"
              >{{ $t('cases.dateStart') }}: {{ dateFrom }}</span>
              <span v-if="dateTo" class="flex p-2 self-end"
              >{{ $t('cases.dateEnd') }}: {{ dateTo }}</span>
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
    <div class="vx-row"
         style="margin-top: 2.2rem">
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full justify-between border-b border-l-0 border-r-0
                          border-t-0 d-theme-border-grey-light border-solid pb-4">
                <div class="vx-col flex items-center">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span v-if="tasks.length" class="pt-1">{{ $t('tasks.related').toUpperCase() }}</span>
                  <span v-else class="pt-1">{{ $t('tasks.noRelatedTasks').toUpperCase() }}</span>
                </div>
                <div class="flex">
                  <vs-button :to="{name: 'task-add', params: {
                                bindCaseId: caseItem.id,
                                bindCaseName: caseItem.name
                             }}"
                             class="ml-3"
                             color="primary"
                             size="small"
                             type="border"
                             icon="library_add">{{ $t('buttons.addCaseTask') }}</vs-button>
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
import moment from 'moment'
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
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
    filesUploading: false,
  }),
  computed: {
    tasks() {
      return this.caseItem.tasks
        ? this.caseItem.tasks
        : []
    },
    date() {
      return date => {
        const formatDate = moment(date,'DD.MM.YYYY').format('DD.MM.YYYY')
        return formatDate === '01.01.0001' ? '' : formatDate
      }
    },
    dateFrom() {
      return this.date(this.caseItem.dateFrom)
    },
    dateTo() {
      return this.date(this.caseItem.dateTo)
    }
  },
  methods: {
    getAttachment(event) {
      this.attachments = event
      this.addAttachments()
    },
    async addAttachments() {
      const attachments = JSON.stringify(this.attachments)
      const params = {
        id: this.$route.params.id,
        type: 'CASE',
      }
      try {
        await this.$store.dispatch('sm/addAttachments', {attachments, params})
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
