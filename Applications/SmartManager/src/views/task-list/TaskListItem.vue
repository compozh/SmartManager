<template>
  <router-link :to="{name: 'task-view', params: {id: task.id}}"
               class="task__task-item block sm:px-4 px-2 py-3"
               :class="{'task__opened-task': task.isRead}">
    <!-- TASK ROW 1 : META -->
    <div class="flex w-full items-center">
      <vs-avatar class="sender__avatar flex-shrink-0 m-0 border-2 border-solid border-white"
                 :src="task.addedPhoto"
                 size="40px"/>
      <div class="flex justify-between ml-3" style="width: calc(100% - 58px);">
        <div class="task__details truncate">
          <span class="text-primary truncate" :class="{'font-semibold': !task.isRead}"
          >{{ task.docCaption }}</span>
          <h6 class="truncate mt-1" >{{ task.addedFio }}</h6>
        </div>

        <div class="task-item__meta flex items-start flex-shrink-0">
          <span v-if="taskInProgress">{{ $t('tasks.deadline') }}: {{ task.dateplan }}</span>
          <span v-if="taskIsDone">{{ $t('tasks.done') }}: {{ task.dateFact }}</span>
        </div>
      </div>
    </div>

    <!-- TASK ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full items-end sm:pl-12"
         :class="{ 'mt-2': (task.descript || task.name) && task.docCaption !== task.descript }">
      <div class="task__message truncate sm:pl-2">
        <h6 v-if="task.name !== task.descript"
            class="text-primary truncate mb-2">{{ task.name }}</h6>
        <span v-if="task.docCaption !== task.descript"
              style="color: #9c9c9c;">{{ task.descript | filter_tags }}</span>
      </div>
      <vs-spacer></vs-spacer>

      <vx-tooltip :text="$t('icons.favorite')" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.isFavorite" icon="StarIcon" class="mr-2"/>
      </vx-tooltip>

      <vx-tooltip :text="caseItem.name" color="rgb(98, 98, 98, .95)">
        <feather-icon v-if="task.caseId" icon="BriefcaseIcon" class="mr-2"/>
      </vx-tooltip>

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

      <vs-chip :color="taskStatus().color"
               class="flex-shrink-0"
               style="flex-basis: 80px"
               icon="ActivityIcon"
      >{{ taskStatus().text }}</vs-chip>

    </div>
  </router-link>
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
    cases() {
      return this.$store.state.sm.cases
    },
    caseItem() {
      return this.cases
        .find(caseItem => caseItem.id === this.task.caseId) || {}
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
              text: this.$t('statuses.done')
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
