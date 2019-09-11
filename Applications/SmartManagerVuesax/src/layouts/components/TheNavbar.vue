<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
========================================================================================== -->

<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <vs-button
          v-if="$route.name === 'task-list'"
          icon="add"
          color="primary"
          type="gradient"
          class="px-3 mr-2"
        >{{ $t('buttons.addTask') }}
        </vs-button>

        <div class="flex" v-if="task.id">
          <vs-button
            v-if="allowedAddSubTask"
            icon="add"
            color="primary"
            type="gradient"
            class="px-3 mr-2"
          >{{ $t('buttons.addSubTask') }}
          </vs-button>

          <div class="flex" v-if="task.isGenerate">
            <div class="flex" v-if="allowedApproveOrReject || task.status !== '+'">
              <vs-button icon="done" color="success" class="px-3 btnx" type="gradient">{{ $t('buttons.approve') }}</vs-button>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button class="btn-drop mr-2" size="default" color="#1CA998" icon="expand_more"></vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item>
                    {{ $t('buttons.approveWithComment') }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>

            <div class="flex" v-if="allowedApproveOrReject || task.status !== '-'">
              <vs-button icon="close" color="danger" class="px-3 btnx" type="gradient">{{ $t('buttons.reject') }}</vs-button>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button class="btn-drop mr-2" size="default" color="#BA365A" icon="expand_more"></vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item>
                    {{ $t('buttons.rejectWithComment') }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
          </div>

          <div class="flex" v-else>
            <vs-button
              v-if="allowedAddSubTask"
              icon="done"
              color="success"
              type="gradient"
              class="px-3 mr-2"
            >{{ $t('buttons.execute') }}
            </vs-button>
            <vs-button
              v-if="task.status === '+'"
              icon="settings_backup_restore"
              color="warning"
              type="gradient"
              class="px-3"
            >{{ $t('buttons.returnToWork') }}
            </vs-button>
          </div>
        </div>
        <vs-spacer></vs-spacer>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <div class="text-right leading-tight hidden sm:block">
            <p class="font-semibold">{{ user_displayName }}</p>
            <small>Available</small>
          </div>
          <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <div class="con-img ml-3">
              <img
                v-if="activeUserImg.startsWith('http')"
                key="onlineImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"/>
              <img
                v-else
                key="localImg"
                :src="require(`@/assets/images/portrait/small/${activeUserImg}`)"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"/>
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem">
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/pages/profile')">
                  <feather-icon icon="UserIcon" svgClasses="w-4 h-4"/>
                  <span class="ml-2">Profile</span>
                </li>
                <vs-divider class="m-1"></vs-divider>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="logout">
                  <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"/>
                  <span class="ml-2">Выход</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <!-- I18N -->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
        <span class="cursor-pointer flex i18n-locale ml-3">
          <flag class="h-6 w-8" size="small" :squared="false" :iso="getCurrentLocaleData.flag"/>
        </span>
          <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
            <vs-dropdown-item :key="lang.code" v-for="lang in localizations"
                              @click="updateLocale(lang.code)">
              <flag class="h-4 w-5" :squared="false" :iso="lang.flag"/> &nbsp;{{lang.name}}
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </vs-navbar>
    </div>
  </div>
</template>

<script>

import templateConfig from '@/templateConfig'

export default {
  name: 'the-navbar',
  props: {
    navbarColor: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      localizations: templateConfig.localizations,
      navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
      showFullSearch: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60,
      },
      autoFocusSearch: false,
      showBookmarkPagesDropdown: false,
    }
  },
  watch: {
    '$route'(to) {
      if (to.name === 'task-view') {
        console.log('', +this.$route.params.id)
      }
    }
  },
  computed: {
    allowedApproveOrReject() {
      return this.task.status === ''
        || this.task.status === '*'
    },
    allowedAddSubTask() {
      return this.$route.name === 'task-view'
        && this.allowedApproveOrReject
    },
    task() {
      const id = +this.$route.params.id
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    status() {
      return this.task.status
        ? this.task.status
        : ''
    },
    unreadNotifications() {
      return this.$store.state.notifications.unreadNotifications
    },
    // HELPER
    sidebarWidth() {
      return this.$store.state.sidebarWidth
    },
    breakpoint() {
      return this.$store.state.breakpoint
    },

    // NAVBAR STYLE
    classObj() {
      if (this.sidebarWidth == 'default') {
        return 'navbar-default'
      } else if (this.sidebarWidth == 'reduced') {
        return 'navbar-reduced'
      } else if (this.sidebarWidth) {
        return 'navbar-full'
      }
      return ''
    },

    // I18N
    getCurrentLocaleData() {
      const locale = this.$i18n.locale
      return this.localizations.find(r => r.code == locale)
    },

    // BOOKMARK & SEARCH
    data() {
      return this.$store.state.navbarSearchAndPinList
    },
    starredPages() {
      return this.$store.state.starredPages
    },
    starredPagesLimited: {
      get() {
        return this.starredPages.slice(0, 10)
      },
      set(list) {
        this.$store.dispatch('arrangeStarredPagesLimited', list)
      }
    },
    starredPagesMore: {
      get() {
        return this.starredPages.slice(10)
      },
      set(list) {
        this.$store.dispatch('arrangeStarredPagesMore', list)
      }
    },

    // PROFILE
    user_displayName() {
      return this.$store.state.auth.currentUser.UserData.CurrentUserData.UserName
    },
    activeUserImg() {
      return this.$store.state.auth.currentUser.UserData.CurrentUserData.UserPhoto || this.$store.state.AppActiveUser.img
    }
  },
  methods: {
    updateLocale(locale) {
      this.$localization.SetLocalization(locale)
    },
    showSidebar() {
      this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
    },
    selected(item) {
      this.$router.push(item.url)
      this.showFullSearch = false
    },

    elapsedTime(startTime) {
      let x = new Date(startTime)
      let now = new Date()
      var timeDiff = now - x
      timeDiff /= 1000

      var seconds = Math.round(timeDiff)
      timeDiff = Math.floor(timeDiff / 60)

      var minutes = Math.round(timeDiff % 60)
      timeDiff = Math.floor(timeDiff / 60)

      var hours = Math.round(timeDiff % 24)
      timeDiff = Math.floor(timeDiff / 24)

      var days = Math.round(timeDiff % 365)
      timeDiff = Math.floor(timeDiff / 365)

      var years = timeDiff

      if (years > 0) {
        return years + (years > 1 ? ' Years ' : ' Year ') + 'ago'
      } else if (days > 0) {
        return days + (days > 1 ? ' Days ' : ' Day ') + 'ago'
      } else if (hours > 0) {
        return hours + (hours > 1 ? ' Hrs ' : ' Hour ') + 'ago'
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'ago'
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? ' sec ago' : 'just now')
      }

      return 'Just Now'
    },
    logout() {
      this.$store.dispatch('auth/logout')

    },
    outside: function () {
      this.showBookmarkPagesDropdown = false
    },

  },
  directives: {
    'click-outside': {
      bind: function (el, binding) {
        const bubble = binding.modifiers.bubble
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e)
          }
        }
        el.__vueClickOutside__ = handler
        document.addEventListener('click', handler)
      },

      unbind: function (el) {
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null

      }
    }
  }
}
</script>

<style scoped>
  .btnx {
    border-radius: 5px 0 0 5px;
    height: 38px;
  }

  .btn-drop {
    border-radius: 0 5px 5px 0;
    border-left: 1px solid rgba(255, 255, 255,.2);
  }

  button:hover > .btn-drop {
    transform: translateY(-2px);
  }

  button:active > .btn-drop {
    transform: translateY(0);
  }
</style>
