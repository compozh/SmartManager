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
      <!-- TASK DETAILS  -->
      <task-details v-if="currentTab === 'details'" :task="task" @open-attachment="openAttachment"></task-details>

      <!-- TASK ATTACHMENTS  -->
      <task-attachments v-if="currentTab === 'attachments'" :task="task" :index="index"></task-attachments>

      <!-- TASK COMMENTS  -->
      <task-comments v-if="currentTab === 'comments'" :task="task"></task-comments>
    </div>
  </div>
</template>

<script>
import TaskSidebar from './TaskSidebar.vue'
import TaskDetails from './task-details/TaskDetails.vue'
import TaskAttachments from './task-attachments/TaskAttachments.vue'
import TaskComments from './task-comments/TaskComments.vue'

export default {
  components: {
    TaskSidebar,
    TaskDetails,
    TaskComments,
    TaskAttachments
  },
  data: () => ({
    currentTab: 'details',
    index: 0,
    reduce: true,
    clickNotClose: true,
    isTaskSidebarActive: true,
    windowWidth: window.innerWidth
  }),
  created() {
    this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
  },
  watch: {
    '$route'(route) {
      if (route.name === 'task-view') {
        this.getTask()
      }
    }
  },
  mounted() {
    this.getTask()
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
    async getTask() {
      const id = +this.$route.params.id
      if (!this.task.id) {
        try {
          await this.$store.dispatch('sm/getTaskInfo', {
            id, loading: true
          })
        } catch (e) {
          console.log(e.message)
        }
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    },
    openAttachment(index) {
      this.currentTab = 'attachments'
      this.index = index
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/task.scss";

  .vs-sidebar.vs-sidebar-reduce {
    max-width: 64px;
  }

  .md-sidebar-spacer {
    width: calc(100% - 64px);
    margin-left: 64px;
  }

  .app-fixed-height {
    height: calc(100vh - 12rem);
  }
</style>
