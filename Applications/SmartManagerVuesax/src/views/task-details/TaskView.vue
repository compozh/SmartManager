<template>
  <div id="task-app"
       class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">

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
      <task-details v-if="currentTab === 'details'"></task-details>

    <!-- TASK COMMENTS  -->
      <task-attachments v-if="currentTab === 'attachments'"></task-attachments>

    <!-- TASK DETAILS  -->
      <task-comments v-if="currentTab === 'comments'"></task-comments>

    <!-- TASK COMMENTS  -->
      <task-approvals v-if="currentTab === 'approvals'"></task-approvals>
    </div>
  </div>
</template>

<script>
import TaskSidebar from './TaskSidebar.vue'
import TaskDetails from './TaskDetails.vue'
import TaskAttachments from './TaskAttachments.vue'
import TaskComments from './TaskComments.vue'
import TaskApprovals from './TaskApprovals.vue'

export default {
  components: {
    TaskSidebar,
    TaskDetails,
    TaskComments,
    TaskAttachments,
    TaskApprovals
  },
  data: () => ({
    currentTab: 'details',
    clickNotClose: true,
    isEmailSidebarActive: true,
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  methods: {
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/task.scss";
</style>
