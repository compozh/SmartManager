<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 p-4"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">

          <!-- TASK META ROW -->
          <div
            class="vx-row border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid flex justify-between flex items-center">
            <div class="vx-col sm:w-4/5 w-full flex flex-wrap items-center mb-2">
              <vs-avatar
                class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                :src="task.performerPhoto"
                size="65px"
              ></vs-avatar>
              <div class="flex flex-col">
                <h5 class="mb-1">{{ task.performer }}</h5>
                <div class="flex items-center">
                  <span class="text-sm truncate"></span>
                </div>
              </div>
            </div>
            <div
              class="vx-col sm:w-1/5 w-full flex sm:flex-col items-center sm:justify-end mb-2">
              <span
                class="flex sm:mr-0 mr-2 self-end whitespace-no-wrap">{{ time(task.dateAdd) }}</span>
              <span
                class="flex self-end sm:mt-2 mt-0 whitespace-no-wrap">{{ date(task.dateAdd) }}</span>
            </div>
          </div>

          <!-- TASK CONTENT -->
          <div class="vx-row">
            <div class="vx-col w-full">
              <div v-if="task.htmlDescript" class="mail__content break-words mt-8 mb-4">
                <iframe
                  seamless
                  scrolling="no"
                  width="100%"
                  :height="iFrameHeight"
                  frameborder="0"
                  :srcdoc="task.htmlDescript"
                  @load="iFrameOnLoad"
                  style="pointer-events: none;"
                >
                </iframe>
              </div>
              <div
                v-if="task.descript"
                class="mail__content break-words mt-8 mb-4"
                v-html="task.descript"></div>
              <div
                v-if="task.docCaption"
                class="mail__content break-words mt-8 mb-4"
                v-html="task.docCaption"></div>
            </div>
          </div>

          <!-- TASK ATTACHMENTS -->
          <div class="vx-row border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex">
            <div class="vx-col flex">
                <feather-icon icon="PaperclipIcon" class="mr-2"/>
                <span class="py-4">{{ $t('tabs.attachments').toUpperCase() }}</span>
            </div>
          </div>
              <div class="vx-row">
                <div
                  class="mail__attachment"
                  v-for="(attachment, index) in task.originals"
                  :key="index"
                  @click="$emit('open-attachment', index)"
                >
                  <vx-tooltip :text="attachment.fileName" color="rgb(98, 98, 98, .95)">
                    <vs-chip
                      class="mr-3 max-w-sm cursor-pointer hover:bg-primary hover:text-white"
                    >
                      <span class="custom-truncate">{{ attachment.fileName }}</span>
                    </vs-chip>
                  </vx-tooltip>
                </div>
              </div>
        </vx-card>
      </div>
    </div>
    <!-- PARENT TASKS -->
    <div
      v-if="parentTasks.length"
      class="vx-row"
      style="margin-top: 2.2rem"
    >
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6">
                <div class="vx-col w-full flex">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span class="py-4">{{ $t('tasks.related').toUpperCase() }}</span>
                </div>
              </div>
              <div class="vx-row w-full">
                <div class="vx-col w-full">
              <transition-group
                name="list-enter-up"
                class="task__tasks  -mx-4"
                tag="ul"
                appear
              >
                <li
                  class="cursor-pointer task__task-item"
                  v-for="parentTask in task.parentTasks"
                  :key="parentTask.id"
                >
                  <task-list-item :task="parentTask"></task-list-item>
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
    <div
      v-if="childTasks.length"
      class="vx-row"
      style="margin-top: 2.2rem"
    >
      <div class="vx-col w-full">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex flex-wrap justify-center">
              <div class="vx-row w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6">
                <div class="vx-col w-full flex">
                  <feather-icon icon="LayersIcon" class="mr-2"/>
                  <span class="py-4">{{ $t('tasks.subTasks').toUpperCase() }}</span>
                </div>
              </div>
              <div class="vx-row w-full">
                <div class="vx-col w-full">
              <transition-group
                name="list-enter-up"
                class="task__tasks -mx-4"
                tag="ul"
                appear
              >
                <li
                  class="cursor-pointer task__task-item"
                  v-for="subTask in task.childTasks"
                  :key="subTask.id"
                >
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
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import TaskListItem from '../../task-list/TaskListItem.vue'

export default {
  props: {
    task: Object
  },
  components: {
    VuePerfectScrollbar,
    TaskListItem
  },
  data: () => ({
    defaultDescHeight: 250,
    iFrameHeight: 250,
    showThread: false,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
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
    parentTasks() {
      return this.task.parentTasks
        ? this.task.parentTasks
        : []
    },
    childTasks() {
      return this.task.childTasks
        ? this.task.childTasks
        : []
    },
  },
  methods: {
    iFrameOnLoad(event) {
      this.iFrameHeight = event.path[0].contentDocument.body.scrollHeight + 5
    }
  }
}
</script>

<style scoped>
  .custom-truncate {
    display: block;
    max-width: 100px;
    margin: 0;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>
