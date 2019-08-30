<template>
  <div
    id="task-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#task-app"

      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isEmailSidebarActive"
    >
      <task-sidebar @changeTab="currentTab = $event"></task-sidebar>
    </vs-sidebar>

    <div
      :class="{'sidebar-spacer': clickNotClose}"
      class="app-fixed-height border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0"
    >

      <!-- TASK DETAILS  -->
      <task-details v-if="currentTab === 'details'" :task="task"></task-details>

      <!-- TASK ATTACHMENTS  -->
      <task-attachments v-if="currentTab === 'attachments'" :attachments="attachments"></task-attachments>

      <!-- TASK DETAILS  -->
      <task-comments v-if="currentTab === 'comments'" :comments="comments"></task-comments>

      <!-- TASK COMMENTS  -->
      <task-approvals v-if="currentTab === 'approvals'"></task-approvals>

    </div>
  </div>
</template>

<script>
import TaskSidebar from './TaskSidebar.vue'
import TaskDetails from './task-details/TaskDetails.vue'
import TaskAttachments from './task-attachments/TaskAttachments.vue'
import TaskComments from './task-comments/TaskComments.vue'
import TaskApprovals from './task-approvals/TaskApprovals.vue'

export default {
  components: {
    TaskSidebar,
    TaskDetails,
    TaskComments,
    TaskAttachments,
    TaskApprovals
  },
  data: () => ({
    loding: true,
    currentTab: 'details',
    clickNotClose: true,
    isEmailSidebarActive: true,
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  created() {
    const id = +this.$route.params.id
    const task = this.task
    if (task === null || task.id !== id) {
      this.$store.dispatch('sm/getTaskInfo', {
        taskId: id,
        loader: 'setCircularLoader'
      })
    }
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    },
    attachments() {
      return this.task ? this.task.originals : []
    },
    comments() {
      return this.task ? this.task.comments : []
    }
  },
  methods: {
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/task.scss";
</style>
