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
        <div class="task__details truncate">
          <h5 class="mb-1" :class="{'font-semibold': !task.isRead}"
          >{{ task.performer | filter_tags }}
          </h5>
          <span>{{ task.descript }}</span>
        </div>

        <div class="task-item__meta flex items-center">
          <span>{{ task.dateAdd }}</span>
        </div>
      </div>
    </div>

    <!-- TASK ROW 2 : MSG & ACTIONS -->
    <div class="flex w-full">
      <div class="task__message truncate ml-3">
        <span>{{ task.name | filter_tags }}</span>
      </div>
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
  methods: {
    taskLink(id) {
      this.$store.dispatch('sm/getTaskInfo', {
        taskId: id,
        loader: 'setCircularLoader'
      })
      this.$router.push({name: 'task-details', params: {id}})
    }
  }
}
</script>
