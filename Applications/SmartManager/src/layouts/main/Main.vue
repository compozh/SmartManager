<template>
  <div
    class="layout--main h-full"
    :class="[navbarClasses, footerClasses, {'app-page': isAppPage}]"
  >
    <!-- БОКОВОЕ МЕНЮ -->
    <vx-sidebar
      :sidebarItems="sidebarItems"
      :title="templateConfig.applicationTitle"
      parent=".layout--main"/>

    <!-- ЗОНА КОНТЕНТА -->
    <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">
      <div id="content-overlay"></div>
      <div class="content-wrapper">
        <the-navbar
          :navbarColor="navbarColor"
          :class="[{'text-white': isNavbarDark && !isThemeDark}, {'text-base': !isNavbarDark && isThemeDark}]"/>

        <div class="router-view pb-0">
          <div class="router-content" :class="{'mt-0': navbarType == 'hidden'}">

            <div class="content-area__content">
              <transition :name="routerTransition" mode="out-in">
                <keep-alive :include="['task-list', 'case-list']">
                  <router-view @changeRouteTitle="changeRouteTitle"></router-view>
                </keep-alive>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <the-footer></the-footer>
    </div>
  </div>
</template>

<script>
import VxSidebar from '@/layouts/components/vx-sidebar/VxSidebar.vue'
import TheNavbar from '../components/TheNavbar.vue'
import TheFooter from '../components/TheFooter.vue'
import themeConfig from '@/../themeConfig.js'
import templateConfig from '@/templateConfig.js'

export default {
  name: 'layout',
  data() {
    return {
      navbarType: themeConfig.navbarType || 'floating',
      navbarColor: themeConfig.navbarColor || '#fff',
      footerType: themeConfig.footerType || 'static',
      routerTransition: themeConfig.routerTransition || 'none',
      isNavbarDark: false,
      routeTitle: this.$route.meta.pageTitle,
      disableCustomizer: themeConfig.disableCustomizer,
      windowWidth: window.innerWidth, //width of windows
      hideScrollToTop: themeConfig.hideScrollToTop,
      disableThemeTour: themeConfig.disableThemeTour,
      templateConfig,
    }
  },
  watch: {
    isThemeDark(val) {
      if (this.navbarColor === '#fff' && val) {
        this.updateNavbarColor('#10163a')
      } else {
        this.updateNavbarColor('#fff')
      }
    }
  },
  computed: {
    sidebarItems() {
      const items = this.$store.state.sm.folders
      if (items) {
        return items.map(i => {
          return {
            url: this.createUrl(i),
            name: i.name,
            slug: i.name,
            tag: i.count,
            tagColor: 'primary',
            icon: this.menuItemIcon(i.code),
            code: i.code
          }
        })
      }
      return []
    },
    createUrl() {
      return item => {
        if (item.code === 'cases') {
          return '/cases/ALL'
        }
        if (item.folderId) {
          return '/cases/' + item.folderId
        }
        return '/tasks/' + (item.code === '' ? 'ALL' : item.code)
      }
    },
    menuItemIcon() {
      return code => {
        switch (code) {
          case '': return 'LayersIcon'
          case 'filter_done': return 'CheckSquareIcon'
          case 'filter_from_me': return 'UserIcon'
          case 'filter_favorite': return 'StarIcon'
          case 'cases': return 'BriefcaseIcon'
          default: return 'FolderIcon'
        }
      }
    },
    isAppPage() {
      return !!this.$route.path.includes('/apps/')
    },
    isThemeDark() {
      return this.$store.state.theme === 'dark'
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay
    },
    contentAreaClass() {
      if (this.sidebarWidth === 'default') {
        return 'content-area-default'
      } else if (this.sidebarWidth === 'reduced') {
        return 'content-area-reduced'
      } else if (this.sidebarWidth) {
        return 'content-area-full'
      }
      return ''
    },
    navbarClasses() {
      return {
        'navbar-hidden': this.navbarType === 'hidden',
        'navbar-sticky': this.navbarType === 'sticky',
        'navbar-static': this.navbarType === 'static',
        'navbar-floating': this.navbarType === 'floating',
      }
    },
    footerClasses() {
      return {
        'footer-hidden': this.footerType === 'hidden',
        'footer-sticky': this.footerType === 'sticky',
        'footer-static': this.footerType === 'static',
      }
    }
  },
  methods: {
    setUserData() {
      this.$store.dispatch('auth/setUserData')
    },
    getFolders() {
      this.$store.dispatch('sm/getFolders', 'loading')
    },
    changeRouteTitle(title) {
      this.routeTitle = title
    },
    updateNavbar(val) {
      if (val === 'static') {
        this.updateNavbarColor('#fff')
      }
      this.navbarType = val
    },
    updateNavbarColor(val) {
      this.navbarColor = val
      this.isNavbarDark = val !== '#fff'
    },
    updateFooter(val) {
      this.footerType = val
    },
    updateRouterTransition(val) {
      this.routerTransition = val
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
      this.setSidebarWidth()
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
        this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
        this.disableThemeTour = true
      } else if (this.windowWidth < 1200) {
        this.$store.dispatch('updateSidebarWidth', 'reduced')
      } else {
        this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
      }
    },
    toggleHideScrollToTop(val) {
      this.hideScrollToTop = val
    }
  },
  components: {
    VxSidebar,
    TheNavbar,
    TheFooter
  },
  created() {
    this.setUserData()
    this.getFolders()
    this.setSidebarWidth()
    if (this.navbarColor === '#fff' && this.isThemeDark) {
      this.updateNavbarColor('#10163a')
    } else {
      this.updateNavbarColor(this.navbarColor)
    }
  }
}
</script>
