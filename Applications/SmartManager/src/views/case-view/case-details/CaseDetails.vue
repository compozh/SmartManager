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
                  <h5 id="name"
                      class="editable mb-2 hover:bg-white hover:border-gray-300"
                  >{{ caseItem.name }}</h5>
                  <span class="save-btn" @click="saveChanges">{{ $t('buttons.save') }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <h3 id="purpose" class="editable text-primary truncate"
                  >{{ caseItem.purpose }}</h3>
                  <span class="save-btn" @click="saveChanges">{{ $t('buttons.save') }}</span>
                </div>
                <div class="flex items-center mb-2">
                  <span id="comm" class="editable"
                  >{{ caseItem.comm }}</span>
                  <span class="save-btn" @click="saveChanges">{{ $t('buttons.save') }}</span>
                </div>
              </div>
            </div>
            <div class="vx-col sm:w-1/5 w-full flex sm:flex-col
                        items-center sm:justify-end mb-2">
              <span class="flex p-2 self-end cursor-pointer rounded
                           hover:text-primary hover:bg-grey-light"
                    @click="changeDate('from')"
              >Начало: {{ date(caseItem.dateFrom) }} в {{ time(caseItem.dateFrom) }}</span>
              <span class="flex p-2 self-end cursor-pointer rounded
                           hover:text-primary hover:bg-grey-light"
                    @click="changeDate('to')"
              >Завершение: {{ date(caseItem.dateTo) }} в {{ time(caseItem.dateTo) }}</span>
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
    },
    dateTime() {
      return dateTime => {
        const date = this.date(dateTime)
        const time = this.time(dateTime)
        const formatDate = moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD')
        return `${formatDate} ${time}`
      }
    }
  },
  mounted() {
    this.makeEditableTextField()
  },
  methods: {
    makeEditableTextField() {
      const fields = document.querySelectorAll('.editable')
      for (let i = 0; i < fields.length; i++) {
        fields[i].setAttribute('contenteditable', 'true')
        fields[i].addEventListener('input', this.changedField)
        fields[i].addEventListener('blur', this.restoreField)
      }
    },
    changeDate(flag) {
      console.log('changeDate', flag)
    },
    changedField(event) {
      const elem = event.target
      if (!elem.changed) {
        elem.changed = true
        elem.saved = false
        elem.nextElementSibling.style.display = 'flex'
      }
    },
    restoreField(event) {
      const elem = event.target
      if (elem.changed) {
        setTimeout(() => {
          if (!elem.saved) {
            console.log('restoreField', )
            const field = elem.id
            elem.innerHTML = this.caseItem[field]
            elem.changed = false
            elem.nextElementSibling.style.display = 'none'
          }
        }, 500)
      }
    },
    async saveChanges(event) {
      const elem = event.target.previousElementSibling
      elem.saved = true
      const field = elem.id
      const newValue = elem.innerHTML
      const dateFrom = this.caseItem.dateFrom
      const dateTo = this.caseItem.dateTo
      const caseData = {
        id: this.$route.params.id,
        name: this.caseItem.name,
        purpose: this.caseItem.purpose,
        dateFrom: this.dateTime(dateFrom),
        dateTo: this.dateTime(dateTo),
        comm: this.caseItem.comm
      }
      caseData[field] = newValue
      try {
        await this.$store.dispatch('sm/caseUpdate', caseData)
        elem.nextElementSibling.style.display = 'none'
      } catch (e) {
        console.log('', e)
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

  .editable {
    position: relative;
    margin: 0 !important;
    &:focus {
      overflow: visible !important;
      cursor: text;
      &:before {
        content: "";
        position: absolute;
        top: -0.25rem;
        left: -0.25rem;
        width: calc(100% + 0.5rem);
        height: calc(100% + 0.35rem);
        border-radius: 0.5rem;
        transition: all 0.25s ease;
        border: 1px dashed rgba(0, 0, 0, 0.1);
      }
    }
  }

  .save-btn {
    display: none;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    color: #7367F0;
    cursor: pointer;
    padding: 0 0.25rem;
    margin-left: 1rem;
    border-radius: 0.25rem;
    border: 1px solid #7367F0;
    animation: scale 1s linear infinite;
  }

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

  @keyframes scale {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

</style>
