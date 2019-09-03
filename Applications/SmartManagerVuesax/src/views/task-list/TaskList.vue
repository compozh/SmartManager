<template>
  <div id="task-app"
       class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <div class="app-fixed-height">
      <!-- SEARCH BAR -->
      <div
        class="flex border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-l-0 items-center app-search-container"
      >
        <vs-input
          icon="icon-search"
          size="large"
          icon-pack="feather"
          :placeholder="$t('search')"
          v-model="searchQuery"
          class="vs-input-no-border vs-input-no-shdow-focus w-full no-icon-border"/>
      </div>

      <!-- EMAILS LIST -->
      <VuePerfectScrollbar
        class="task-content-scroll-area"
        :settings="settings"
        ref="taskListPS"
      >
        <transition-group
          name="list-enter-up"
          class="task__tasks"
          tag="ul"
          appear
        >
          <li
            class="cursor-pointer task__task-item"
            v-for="(task, index) in tasks"
            :key="String(mailFilter) + String(task.id)"
            :style="{transitionDelay: (index * 0.1) + 's'}"
          >
            <task-list-item :task="task"></task-list-item>
          </li>
        </transition-group>
      </VuePerfectScrollbar>
    </div>

  </div>
</template>

<script>
import TaskListItem from './TaskListItem.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    TaskListItem,
    VuePerfectScrollbar
  },
  data: () => ({
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  watch: {
    '$route'(to, from) {
      const current = from.params.code
      const target = to.params.code
      if (current !== target) {
        this.getTasks(target)
      }
    },
    mailFilter() {
      this.selectedMails = []
      this.$refs.taskListPS.$el.scrollTop = 0
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['sm/tasks']
    },
    mailFilter() {
      //return this.$store.state.email.mail_filter
    },
    searchQuery: {
      get() {
        //return this.$store.state.email.mailSearchQuery
      },
      set(val) {
        this.$store.dispatch('email/setMailSearchQuery', val)
      }
    }
  },
  methods: {
    getTasks(folderId) {
      this.$store.commit('sm/setCurrentFolder', folderId)
      const loader = this.tasks ? 'setLinearLoader' : 'setCircularLoader'
      this.$store.dispatch('sm/getTasks', {folderId, loader})
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  created() {
    this.getTasks(this.$route.params.code)
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
  @import '@/assets/scss/vuesax/apps/task.scss';
</style>
