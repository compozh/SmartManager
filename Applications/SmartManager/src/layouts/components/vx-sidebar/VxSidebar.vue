<template>
  <div class="parentx">
    <vs-sidebar
      v-hammer:swipe.left="onSwipeLeft"
      ref="mainSidebar"
      :parent="parent"
      :hiddenBackground="clickNotClose"
      :reduce="reduce"
      default-index="-1"
      class="sidebarx main-menu-sidebar items-no-padding"
      v-model="isSidebarActive"
      :click-not-close="clickNotClose"
      :reduce-not-rebound="reduceNotRebound"
    >
      <div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
        <div class="header-sidebar flex items-end justify-between" slot="header">
          <router-link tag="div" to="/" class="logo flex items-center cursor-pointer">
            <img :src="logo" alt="logo" class="w-10 mr-4" v-if="logo">
            <span class="logo-text" v-if="title && (isMouseEnter || !reduce)">{{ title }}</span>
            <span class="logo-text" v-else>SM</span>
          </router-link>
          <div>
            <template v-if="showCloseButton">
              <feather-icon
                icon="XIcon"
                class="m-0 cursor-pointer"
                @click="$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)"
              >
              </feather-icon>
            </template>
            <template v-else-if="!showCloseButton && !sidebarItemsMin">
              <feather-icon icon="DiscIcon" class="mr-0 cursor-pointer" svg-classes="stroke-current"
                            v-show="!reduce" @click="toggleReduce(true)"></feather-icon>
              <feather-icon icon="CircleIcon" class="mr-0 cursor-pointer"
                            svg-classes="stroke-current" v-show="reduce"
                            @click="toggleReduce(false)"></feather-icon>
            </template>
          </div>
        </div>

        <div class="shadow-bottom" v-show="showShadowBottom"></div>

        <VuePerfectScrollbar
          ref="mainSidebarPs"
          class="scroll-area--main-sidebar pt-2"
          :settings="settings"
          @ps-scroll-y="psSectionScroll"
        >
            <template v-for="(sidebarItem, index) in sidebarItems">
              <template>
                <!-- IF IT'S SINGLE ITEM -->
                <vx-sidebar-item ref="sidebarLink"
                                 :key="`sidebarItem-${index}`"
                                 :index="index"
                                 :to="sidebarItem.slug !== 'external' ? sidebarItem.url : ''"
                                 :href="sidebarItem.slug === 'external' ? sidebarItem.url : ''"
                                 :icon="sidebarItem.icon"
                                 :target="sidebarItem.target"
                                 :isDisabled="sidebarItem.isDisabled"
                                 :slug="sidebarItem.slug"
                                 :style="{order: sidebarItem.code === '' ? -1 : 0}">
                <span v-show="!sidebarItemsMin" class="truncate">{{ sidebarItem.name }}</span>
                  <vs-chip class="ml-auto"
                           :color="sidebarItem.tagColor"
                           v-if="sidebarItem.tag && (isMouseEnter || !reduce)"
                  >{{ sidebarItem.tag }}</vs-chip>
                </vx-sidebar-item>
              </template>
            </template>
          <template v-if="$route.path.includes('/task/')">
            <vs-divider class="px-5"></vs-divider>
            <vx-sidebar-item :to="'/tasks/' + taskCurrentFolder" icon="ArrowLeftIcon">
              <span v-show="!sidebarItemsMin">{{ $t('buttons.toBack') }}</span>
            </vx-sidebar-item>
          </template>
          <template v-if="$route.path.includes('/case/')">
            <vs-divider class="px-5"></vs-divider>
            <vx-sidebar-item :to="'/cases/' + caseCurrentFolder" icon="ArrowLeftIcon">
              <span v-show="!sidebarItemsMin">{{ $t('buttons.toBack') }}</span>
            </vx-sidebar-item>
          </template>
        </VuePerfectScrollbar>
      </div>
    </vs-sidebar>
    <div v-hammer:swipe.right="onSwipeRightSidebarSwipeArea" v-if="!isSidebarActive"
         class="sidebar-swipe-area" id="sidebar-swipe-area"></div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import VxSidebarItem from './VxSidebarItem.vue'

export default {
  name: 'vx-sidebar',
  props: {
    sidebarItems: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
    },
    logo: {
      type: String
    },
    parent: {
      type: String
    },
    openGroupHover: {
      type: Boolean,
      default: false
    },
    reduceNotRebound: {
      type: Boolean,
      default: true,
    }
  },
  components: {
    VxSidebarItem,
    VuePerfectScrollbar
  },
  data: () => ({
    clickNotClose: false, // disable close sidebar on outside click
    reduce: false, // determines if sidebar is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    isMouseEnter: false,
    settings: { // perfectscrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    windowWidth: window.innerWidth, //width of windows
    showShadowBottom: false
  }),
  computed: {
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive
      },
      set(val) {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', val)
      }
    },
    reduceSidebar() {
      return Boolean(this.reduce && this.reduceButton)
    },
    reduceButton: {
      get() {
        return this.$store.state.reduceButton
      },
      set(val) {
        this.$store.commit('TOGGLE_REDUCE_BUTTON', val)
      }
    },
    sidebarItemsMin() {
      return this.$store.state.sidebarItemsMin
    },
    folders() {
      return this.$store.state.sm.folders
    },
    folderCode() {
      const folderCode = this.$store.state.sm.currentFolder
      if (folderCode === 'active') {
        return '' // conversion for all tasks
      }
      if (folderCode === 'all') {
        return 0 // conversion for all cases
      }
      return folderCode
    },
    taskCurrentFolder() {
      const folderId = this.folders
        ? this.folders.find(folder => folder.code === this.folderCode).code
        : 'active'
      return folderId || 'active'
    },
    caseCurrentFolder() {
      const folderId = this.folders
        ? this.folders.find(folder => folder.folderId === +this.folderCode).folderId
        : 'all'
      return folderId || 'all'
    }
  },
  watch: {
    reduce(val) {
      if (val === true) {
        this.$store.dispatch('updateSidebarWidth', 'reduced')
      } else {
        this.$store.dispatch('updateSidebarWidth', 'default')
      }
      setTimeout(() => window.dispatchEvent(new Event('resize')), 100)
    },
    reduceButton() {
      this.setSidebarWidth()
    },
    '$route'() {
      if (this.isSidebarActive && this.showCloseButton) {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
      }
    },
  },
  methods: {
    sidebarMouseEntered() {
      if (this.reduce) {
        this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
      }
      this.isMouseEnter = true
    },
    sidebarMouseLeave() {
      if (this.reduce) {
        this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true)
      }
      this.isMouseEnter = false
    },
    toggleReduce(val) {
      this.reduceButton = val
      this.setSidebarWidth()
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
      this.setSidebarWidth()
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        if (this.windowWidth < 992) {
          this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'md')
        } else {
          this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'lg')
        }

        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
        if (this.reduceButton) {
          this.reduce = false
        }
        // this.reduceButton = false;
        this.showCloseButton = true
        this.clickNotClose = false
        this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
        this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
      } else {
        this.$store.commit('UPDATE_WINDOW_BREAKPOINT', 'xl')
        if (this.reduceButton) {
          this.reduce = true
        } else {
          this.reduce = false
        }

        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
        if (this.reduceButton && !this.isMouseEnter) {
          this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', true)
        } else {
          this.$store.commit('UPDATE_SIDEBAR_ITEMS_MIN', false)
        }

        this.clickNotClose = true
        this.showCloseButton = false
        if (this.reduceSidebar) {
          this.$store.dispatch('updateSidebarWidth', 'reduced')
        } else {
          this.$store.dispatch('updateSidebarWidth', 'default')
        }
      }
    },
    psSectionScroll() {
      if (this.$refs.mainSidebarPs.$el.scrollTop > 0) {
        this.showShadowBottom = true
      } else {
        this.showShadowBottom = false
      }
    },
    onSwipeLeft() {
      if (this.isSidebarActive && this.showCloseButton) {
        this.isSidebarActive = false
      }
    },
    onSwipeRightSidebarSwipeArea() {
      if (!this.isSidebarActive && this.showCloseButton) {
        this.isSidebarActive = true
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
    this.setSidebarWidth()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/components/vxSidebar.scss"
</style>
