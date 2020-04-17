<template>
  <div id="task-app" class="border border-solid d-theme-border-grey-light rounded relative">
    <div
      :class="{'sidebar-spacer': clickNotClose, 'md-sidebar-spacer': mdAndDown}"
      class="md:md-sidebar-spacer app-fixed-height border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0"
    >
      <!-- CASE DETAILS  -->
      <case-details v-if="currentTab === 'details'" :caseItem="caseItem" @open-attachment="openAttachment"></case-details>

      <!-- CASE ATTACHMENTS  -->
      <attachments v-if="currentTab === 'attachments'" :task="caseItem" :index="index"></attachments>

      <!-- CASE COMMENTS  -->
      <comments v-if="currentTab === 'comments'" :task="caseItem"></comments>
    </div>
  </div>
</template>

<script>
const CaseDetails = () => import('./CaseDetails.vue')
import Attachments from '@/views/attachments/Attachments.vue'
import Comments from '@/views/comments/Comments.vue'

export default {
  components: {
    CaseDetails,
    Comments,
    Attachments
  },
  data: () => ({
    currentTab: 'details',
    index: 0,
    reduce: true,
    clickNotClose: true,
    isCaseSidebarActive: true,
    windowWidth: window.innerWidth
  }),
  watch: {
    '$route'(route) {
      if (route.name === 'case-view') {
        this.getCase()
      }
    }
  },
  mounted() {
    this.getCase()
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  computed: {
    caseItem() {
      const id = +this.$route.params.caseId
      const caseItem = this.$store.state.sm.caseDetails[id]
      return caseItem ? caseItem : {}
    },
    attachments() {
      return this.caseItem.originals
        ? this.caseItem.originals
        : []
    },
    comments() {
      return this.caseItem.comments
        ? this.caseItem.comments
        : []
    },
    mdAndDown() {
      return this.windowWidth < 992
    }
  },
  methods: {
    async getCase() {
      const caseId = +this.$route.params.caseId
      if (!this.caseItem.id) {
        try {
          await this.$store.dispatch('sm/getCaseDetails', {
            caseId, loading: true
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
    height: calc(100vh - 11rem);
  }

  @media (max-width: 768px) {
    .vs-sidebar.vs-sidebar-reduce {
      max-width: 38px;
    }

    .md-sidebar-spacer {
      width: calc(100% - 38px);
      margin-left: 38px;
    }
  }
</style>
