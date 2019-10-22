<template>
  <div
    class="task__task-item sm:px-4 px-2 py-3"
    :class="{'task__opened-task': task.isRead}"
    @click="taskLink(task.id)"
  >
    <!-- TASK ROW 1 : META -->
    <div class="flex w-full items-center">
      <vs-avatar
        class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white"
        :src="task.performerPhoto"
        size="40px"
      ></vs-avatar>

      <div class="flex justify-between items-start" style="width: calc(100% - 58px);">
        <div class="task__details truncate mr-3">
          <h5 class="mb-1" :class="{'font-semibold': !task.isRead}"
          >{{ task.performer }}</h5>
          <h6 class="text-primary">{{ task.name }}</h6>
        </div>

        <div class="task-item__meta flex items-center flex-shrink-0">
          <span v-if="taskInProgress">{{ $t('tasks.deadline') }}: {{ task.dateplan }}</span>
          <span v-if="taskIsDone">{{ $t('tasks.done') }}: {{ task.dateFact }}</span>
        </div>
      </div>
    </div>

    <!-- TASK ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full" style="padding-left: 45px;">
      <div
        v-if="task.isGenerate && task.name !== task.descript"
        class="task__message truncate mx-3">
        <span>{{ task.descript | filter_tags }}</span>
      </div>
      <div v-else class="task__message truncate mx-3">
        <span>{{ $t('tasks.taskFrom') }}: {{ task.addedFio }}</span>
      </div>
      <vs-spacer></vs-spacer>

      <vx-tooltip :text="$t('icons.attachments')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.hasOrig" icon="PaperclipIcon" class="mr-2"/>
      </vx-tooltip>

      <vx-tooltip :text="$t('icons.comment')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.hasComm" icon="MessageSquareIcon" class="mr-2"/>
      </vx-tooltip>

      <vx-tooltip :text="$t('icons.control')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.myControl" icon="InfoIcon" class="mr-2"/>
      </vx-tooltip>

      <vx-tooltip :text="$t('icons.document')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.isGenerate" icon="FileTextIcon" class="mr-2"/>
      </vx-tooltip>

      <vs-chip
        :color="taskStatus().color"
        class="flex-shrink-0"
        style="flex-basis: 80px"
        icon="ActivityIcon"
      >{{ taskStatus().text }}
      </vs-chip>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    }
  },
  computed: {
    comments() {
      return this.task.comments ? this.task.comments.length : 0
    },
    taskStatus() {
      return () => {
        switch (this.task.status) {
          case '':
            return {
              color: 'primary',
              icon: 'loop',
              text: this.$t('statuses.inWork')
            }
          case '*':
            return {
              color: 'primary',
              icon: 'loop',
              text: this.$t('statuses.inWork')
            }
          case '-':
            return {
              color: 'danger',
              icon: 'highlight_off',
              text: this.$t('statuses.rejected')
            }
          case '+':
            return {
              color: 'success',
              icon: 'check_circle_outline',
              text: this.$t('statuses.completed')
            }
          default:
            return {
              color: '',
              icon: '',
              text: ''
            }
        }
      }
    },
    taskInProgress() {
      return this.task.status === ''
        || this.task.status === '*'
    },
    taskIsDone() {
      return this.task.status === '+'
    }
  },
  methods: {
    taskLink(id) {
      this.$router.push({name: 'task-view', params: {id}})
    }
  }
}
</script>
