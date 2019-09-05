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
      <!-- TASK LIST -->
      <VuePerfectScrollbar
        class="task-content-scroll-area"
        :settings="settings"
        ref="taskListPS"
      >
        <div
          v-show="loading"
          ref="loader"
          id="task-list-loading"
          class="vs-con-loading__container h-full"
        ></div>
        <transition-group
          v-if="!loading"
          id="task-list"
          name="list-enter-up"
          class="task__tasks"
          tag="ul"
          appear
        >
          <li
            class="cursor-pointer task__task-item"
            v-for="(task, index) in tasks"
            :key="String(task.id)"
            :style="{transitionDelay: (index * 0.1) + 's'}"
          >
            <task-list-item :task="task"></task-list-item>
          </li>
        </transition-group>
        <div v-if="!hasTasks" class="h-full flex justify-center items-center text-4xl">{{ $t('messages.noData') }}</div>
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
    VuePerfectScrollbar,
  },
  data: () => ({
    loading: false,
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
    hasTasks() {
      return this.tasks ? this.tasks.length : 0
    },
  },
  methods: {
    startLoading() {
      this.loading = true
      this.$vs.loading({
        container: this.$refs.loader,
        clickEffect: true
      })
    },
    stopLoading() {
      this.loading = false
      this.$vs.loading.close(this.$refs.loader)
    },
    async getTasks(folderId) {
      this.$store.commit('sm/setCurrentFolder', folderId)
      if (!this.tasks) {
        this.startLoading()
      }
      try {
        await this.$store.dispatch('sm/getTasks', {folderId})
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
</style>
