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
              v-for="(item, index) in casesToPage"
              :key="String(item.id)"
              :style="{transitionDelay: (index * 0.1) + 's'}"
            >
              <case-list-item :caseItem="item"></case-list-item>
            </li>
          </transition-group>
          <no-data v-if="!this.casesToPage.length">{{ $t('cases.noCases') }}</no-data>
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
import CaseListItem from './CaseListItem.vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import NoData from '@/components/NoData'

export default {
  components: {
    CaseListItem,
    VuePerfectScrollbar,
    NoData
  },
  data: () => ({
    currentPage: 1,
    casePerPage: 20,
    windowWidth: window.innerWidth,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
      scrollYMarginOffset: 100
    }
  }),
  computed: {
    cases() {
      const cases = this.$store.getters['sm/cases']
      return cases.filter(i => i.folderId === +this.$route.params.id)
    },
    pages() {
      return this.cases
        ? Math.ceil(this.cases.length / this.casePerPage)
        : 0
    },
    casesToPage() {
      const pageTo = this.currentPage * this.casePerPage
      const pageFrom = pageTo - this.casePerPage
      if (this.cases) {
        return this.cases
          .filter((item, index) => pageFrom <= index && index < pageTo)
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
    }
  },
  methods: {
    async getCases() {
      const loading = !this.cases
      try {
        await this.$store.dispatch('sm/getCases', {loading})
      } catch (e) {
        console.log(e.message)
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  async mounted() {
    await this.getCases()
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

