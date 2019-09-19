<template>
  <div>
    <div
      id="task-app"
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
            v-model.trim="search"
            class="vs-input-no-border vs-input-no-shdow-focus w-full no-icon-border"/>
        </div>
        <!-- TASK LIST -->
        <VuePerfectScrollbar
          class="task-content-scroll-area"
          :settings="settings"
          ref="taskListPS"
        >
          <transition-group
            id="task-list"
            name="list-enter-up"
            class="task__tasks"
            tag="ul"
            appear
          >
            <li
              class="cursor-pointer task__task-item"
              v-for="(task, index) in tasksToPage"
              :key="String(task.id)"
              :style="{transitionDelay: (index * 0.1) + 's'}"
            >
              <task-list-item :task="task"></task-list-item>
            </li>
          </transition-group>
        </VuePerfectScrollbar>
      </div>

    </div>
    <vs-pagination
      v-if="pages > 1"
      :total="pages"
      v-model="currentPage"
      class="-mb-10 mt-3 "
    ></vs-pagination>
  </div>
</template>

<script>
import TaskListItem from './TaskListItem.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  components: {
    TaskListItem,
    VuePerfectScrollbar,
  },
  data: () => ({
    currentPage: 1,
    taskPerPage: 20,
    searchQuery: '',
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  watch: {
    '$route'(to, from) {
      const currentFolder = from.params.code
      const targetFolder = to.params.code
      if (currentFolder !== targetFolder) {
        this.getTasks(targetFolder)
      }
    }
  },
  computed: {
    tasks() {
      return this.$store.getters['sm/tasks']
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
    },
    search: {
      get() {
        return this.$store.state.sm.search
      },
      set(search) {
        this.$store.commit('sm/setSearch', search)
      }
    }
  },
  methods: {
    async getTasks(folderId) {
      this.$store.commit('sm/setCurrentFolder', folderId)
      const loading = !this.tasks
      try {
        await this.$store.dispatch('sm/getTasks', {folderId, loading})
      } catch (e) {
        console.log(e.message)
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  mounted() {
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
  .-mb-10 {
    margin-bottom: -2.7rem !important;
  }
</style>
