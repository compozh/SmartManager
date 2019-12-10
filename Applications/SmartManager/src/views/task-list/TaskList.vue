<template>
  <div>
    <div id="task-app"
         class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
      <div class="app-fixed-height">
        <!-- SEARCH BAR -->
        <div class="flex border border-solid d-theme-border-grey-light border-r-0
                    border-t-0 border-l-0 items-center app-search-container">
          <vs-input icon="icon-search"
                    size="large"
                    icon-pack="feather"
                    :placeholder="$t('search')"
                    v-model.trim="search"
                    class="vs-input-no-border vs-input-no-shdow-focus w-full no-icon-border"/>
        </div>
        <!-- TASK LIST -->
        <VuePerfectScrollbar class="task-content-scroll-area"
                             id="scrollArea"
                             :settings="settings"
                             ref="taskListPS"
                             @ps-x-reach-end="setScrollPosition">
          <transition-group id="task-list"
                            name="list-enter-up"
                            class="task__tasks"
                            tag="ul"
                            appear>
              <li class="cursor-pointer task__task-item"
                  v-for="(task, index) in tasksToPage"
                  :key="String(task.id)"
                  :style="{transitionDelay: (index * 0.1) + 's'}">
                <task-list-item :task="task"/>
              </li>
          </transition-group>
          <no-data v-if="!this.tasksToPage.length">{{ $t('tasks.noTasks') }}</no-data>
        </VuePerfectScrollbar>
      </div>

    </div>
    <vs-pagination v-if="pages > 1"
                  :total="pages"
                   :max="breakpoint === 'md' ? 5 : 9"
                  v-model="currentPage"
                  class="-mb-10 mt-3"/>
  </div>
</template>

<script>
import TaskListItem from './TaskListItem.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import NoData from '@/components/NoData'

export default {
  name: 'task-list',
  components: {
    TaskListItem,
    VuePerfectScrollbar,
    NoData
  },
  data: () => ({
    currentPage: 1,
    taskPerPage: 20,
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
      scrollYMarginOffset: 100
    }
  }),
  watch: {
    $route(to, from) {
      const currentFolder = from.params.code
      const targetFolder = to.params.code
      if (to.name === 'task-list' && currentFolder !== targetFolder) {
        if (!this.listPosition[targetFolder]) {
          this.$store.commit('sm/setTaskListPosition', {folder: targetFolder})
        }
        this.currentPage = this.listPosition[targetFolder].page
        this.updateScrollPosition()
        this.getTasks(targetFolder)
      }
    },
    currentPage(page) {
      this.updateScrollPosition(1)
      const folder = this.$route.params.code
      if (folder) {
        this.$store.commit('sm/setTaskListPosition', {folder, page})
      }
    },
  },
  computed: {
    breakpoint() {
      return this.$store.state.breakpoint
    },
    tasks() {
      return this.$store.getters['sm/tasks']
    },
    cases() {
      return this.$store.state.sm.cases
    },
    pages() {
      return this.tasks
        ? Math.ceil(this.tasks.length / this.taskPerPage)
        : 0
    },
    tasksToPage() {
      const pageTo = this.currentPage * this.taskPerPage
      const pageFrom = pageTo - this.taskPerPage
      if (this.tasks) {
        return this.tasks
          .filter((task, index) => pageFrom <= index && index < pageTo)
      }
      return []
    },
    search: {
      get() {
        return this.$store.state.sm.search
      },
      set(search) {
        this.currentPage = 1
        this.$store.commit('sm/setSearch', search)
      }
    },
    folderCode() {
      return this.$route.params.code
    },
    listPosition() {
      return this.$store.state.sm.taskListPosition
    }
  },
  mounted() {
    this.getTasks(this.folderCode)
    this.getCases()
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  activated() {
    this.updateScrollPosition()
  },
  methods: {
    setScrollPosition(event) {
      const folder = this.$route.params.code
      if (folder) {
        this.$store.commit('sm/setTaskListPosition', {
          folder, scrollTop: event.target.scrollTop
        })
      }
    },
    updateScrollPosition(pos) {
      const scrollArea = document.querySelector('#scrollArea')
      try {
        scrollArea.scrollTop = pos || this.listPosition[this.folderCode].scrollTop
        // eslint-disable-next-line no-unused-vars, no-empty
      } catch (e) {
        // provides clear console when scrollArea is null
      }
    },
    async getTasks(folderId) {
      this.$store.commit('sm/setCurrentFolder', folderId)
      const loading = !this.tasks
      try {
        await this.$store.dispatch('sm/getTasks', {folderId, loading})
      } catch (e) {
        console.log(e.message)
      }
    },
    async getCases() {
      if (this.cases.length === 0) {
        await this.$store.dispatch('sm/getCases', false)
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  deactivated() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
}
</script>

<style lang="scss">
  @import '@/assets/scss/vuesax/apps/task.scss';
  .-mb-10 {
    margin-bottom: -2.7rem !important;
  }
</style>
