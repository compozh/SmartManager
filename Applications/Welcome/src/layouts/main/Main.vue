<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="layout--main" :class="[navbarClasses, footerClasses, {'app-page': isAppPage}]">
        <vx-tour :steps="steps" v-if="!disableThemeTour" />
    <doc-title :title="`${appTitle}. ${routeTitle}`"/>

        <!-- БОКОВОЕ МЕНЮ -->
        <vx-sidebar  :sidebarItems="sidebarItems" :logo="require('@/assets/images/logo/nabu.logo.png')" :title="appTitle" parent=".layout--main" />

        <!-- ЗОНА КОНТЕНТА -->
        <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">

            <div id="content-overlay"></div>

            <div class="content-wrapper">

                <the-navbar :navbarColor="navbarColor" :class="[{'text-white': isNavbarDark && !isThemeDark}, {'text-base': !isNavbarDark && isThemeDark}]" />

                <div class="router-view">
                    <div class="router-content" :class="{'mt-0': navbarType == 'hidden'}">
                        <transition :name="routerTransition">
                        <div class="router-header flex flex-wrap items-center mb-6" v-if="$route.meta.breadcrumb || $route.meta.pageTitle">
                            <div class="content-area__heading" :class="{'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light' : $route.meta.breadcrumb}">
                                <h2 class="mb-1">{{ routeTitle }}</h2>
                            </div>

                            <!-- BREADCRUMB -->
                            <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" :route="$route" />

                        </div>
                        </transition>
                        <div class="content-area__content">
                            <back-to-top bottom="5%" visibleoffset="500" v-if="!hideScrollToTop">
                                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg" />
                            </back-to-top>
                            <transition :name="routerTransition" mode="out-in">
                                <router-view @changeRouteTitle="changeRouteTitle"></router-view>
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
//import sidebarItems from '@/sidebarItems.js'
import templateConfig from '@/templateConfig.js'
import BackToTop from 'vue-backtotop'
const VxTour = () => import('@/components/VxTour.vue')

export default {
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
      steps: [],
      templateConfig
    }
  },
  watch: {
    '$route'() {
      this.routeTitle = this.$route.meta.pageTitle
    },
    isThemeDark(val) {
      if (this.navbarColor == '#fff' && val) {
        this.updateNavbarColor('#10163a')
      } else {
        this.updateNavbarColor('#fff')
      }
    },
  },
  computed: {

    appTitle() {
      var title = this.templateConfig.applicationTitle
      if (typeof title == 'object') {
        if (title.resourceKey) {
          return this.$t(title.resourceKey)
        }
      }
      return title
    },
    sidebarItems() {
      if (!this.$store.state.app.applicationDescription) {
        return []
      }

      let routes = [...this.$store.state.app.applicationDescription.Sections[0].Routes]

      return routes.sort((a,b) => a.Sort > b.Sort ? 1 : (a.Sort < b.Sort ? -1 : 0)).map(r => {
        return {
          url: '/' + this.$route.params.applicationId + '/' + r.Path,
          name: r.Name,
          icon: r.Image,
          slug: r.Id
        }
      })

    },

    isAppPage() {
      if (this.$route.path.includes('/apps/')) { return true } else { return false }
    },
    isThemeDark() { return this.$store.state.theme == 'dark' },
    sidebarWidth() {
      return this.$store.state.sidebarWidth
    },
    bodyOverlay() {
      return this.$store.state.bodyOverlay
    },
    contentAreaClass() {
      if (this.sidebarWidth == 'default') {
        return 'content-area-default'
      } else if (this.sidebarWidth == 'reduced') {
        return 'content-area-reduced'
      } else if (this.sidebarWidth) {
        return 'content-area-full'
      }
      return ''
    },
    navbarClasses() {
      return {
        'navbar-hidden': this.navbarType == 'hidden',
        'navbar-sticky': this.navbarType == 'sticky',
        'navbar-static': this.navbarType == 'static',
        'navbar-floating': this.navbarType == 'floating',
      }
    },
    footerClasses() {
      return {
        'footer-hidden': this.footerType == 'hidden',
        'footer-sticky': this.footerType == 'sticky',
        'footer-static': this.footerType == 'static',
      }
    },
  },
  methods: {
    changeRouteTitle(title) {
      this.routeTitle = title
    },
    updateNavbar(val) {
      if (val == 'static') { this.updateNavbarColor('#fff') }
      this.navbarType = val
    },
    updateNavbarColor(val) {
      this.navbarColor = val
      if (val == '#fff') { this.isNavbarDark = false } else { this.isNavbarDark = true }
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
    TheNavbar,
    TheFooter,
    BackToTop,
    VxTour,
    VxSidebar
  },
  created() {
    this.$store.dispatch('app/loadApplicationDescription')
    this.setSidebarWidth()
    if (this.navbarColor == '#fff' && this.isThemeDark) {
      this.updateNavbarColor('#10163a')
    } else {
      this.updateNavbarColor(this.navbarColor)
    }
  }
}
</script>
