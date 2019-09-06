<template>
  <div
    id="task-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#task-app"
      :reduce="mdAndDown"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      reduce-not-rebound
      v-model="isTaskSidebarActive"
    >
      <task-sidebar
        @changeTab="currentTab = $event"
        :currentTab="currentTab"
        :attachments="attachments"
        :comments="comments"
      ></task-sidebar>
    </vs-sidebar>

    <div
      :class="{'sidebar-spacer': clickNotClose, 'md-sidebar-spacer': mdAndDown}"
      class="md:md-sidebar-spacer app-fixed-height border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0"
    >
      <div
        v-show="loading"
        ref="taskViewLoader"
        class="vs-con-loading__container h-full"
      ></div>
      <!-- TASK DETAILS  -->
      <task-details v-if="currentTab === 'details'" :task="task"></task-details>

      <!-- TASK ATTACHMENTS  -->
      <task-attachments v-if="currentTab === 'attachments'" :attachments="attachments"></task-attachments>

      <!-- TASK DETAILS  -->
      <task-comments v-if="currentTab === 'comments'" :task="task"></task-comments>

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
    loading: false,
    currentTab: 'details',
    reduce: true,
    clickNotClose: true,
    isTaskSidebarActive: true,
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  created() {
    this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
  },
  mounted() {
    const id = +this.$route.params.id
    if (!this.task.id) {
      this.getTask(id)
    }
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  computed: {
    task() {
      const id = +this.$route.params.id
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    attachments() {
      return this.task.originals
        ? this.task.originals
        : []
    },
    comments() {
      return this.task.comments
        ? this.task.comments
        : []
    },
    mdAndDown() {
      return this.windowWidth < 992
    }
  },
  methods: {
    startLoading() {
      this.loading = true
      this.$vs.loading({
        container: this.$refs.taskViewLoader,
        clickEffect: true
      })
    },
    stopLoading() {
      this.loading = false
      this.$vs.loading.close(this.$refs.taskViewLoader)
    },
    async getTask(id) {
      this.startLoading()
      try {
        await this.$store.dispatch('sm/getTaskInfo', {id})
        this.stopLoading()
      } catch (e) {
        this.stopLoading()
        console.log(e.message)
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
    this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/task.scss";
  .vs-sidebar-reduce {
    max-width: 64px;
  }

  .md-sidebar-spacer {
    width: calc(100% - 64px);
    margin-left: 64px;
  }
</style>
