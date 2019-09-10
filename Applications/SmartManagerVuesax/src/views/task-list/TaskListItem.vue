<template>
  <div
    class="task__task-item sm:px-4 px-2 py-6"
    :class="{'task__opened-task': task.isRead}"
    @click="taskLink(task.id)"
  >
    <!-- TASK ROW 1 : META -->
    <div class="flex w-full">
      <vs-avatar
        class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white"
        :src="task.performerPhoto"
        size="40px"
      ></vs-avatar>

      <div class="flex w-full justify-between items-start">
        <div class="task__details truncate mr-3">
          <h5 class="mb-1" :class="{'font-semibold': !task.isRead}"
          >{{ task.performer }}
          </h5>
          <span>{{ task.descript }}</span>
        </div>
        <div class="task__details truncate mr-3">
          <h5 :style="{color: task.isGenerate ? 'blue' : 'black' }">IsGenerate: {{ task.isGenerate }}</h5>
          <h5>ARSO: {{ task.arso }}</h5>
        </div>

        <div class="task-item__meta flex items-center flex-shrink-0">
          <span>{{ task.dateAdd }}</span>
        </div>
      </div>
    </div>

    <!-- TASK ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full">
      <div class="task__message truncate mx-3">
        <span>{{ task.name | filter_tags }}</span>
      </div>
      <vs-spacer></vs-spacer>
      <vs-chip
        :color="taskStatus().color"
        class="flex-shrink-0"
        style="flex-basis: 80px"
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
            color: 'warning',
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
    }
  },
  methods: {
    taskLink(id) {
      this.$router.push({name: 'task-view', params: {id}})
    }
  }
}
</script>
