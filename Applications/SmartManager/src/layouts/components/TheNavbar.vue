<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-4"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>
        <div class="flex" v-if="$route.name === 'task-list'">
          <vs-button
            icon="add"
            color="primary"
            type="gradient"
            class="px-3 mr-2"
            @click="$router.push('/task-add')"
          >{{ $t('buttons.addTask') }}
          </vs-button>

          <vs-button
            icon="get_app"
            color="success"
            type="gradient"
            class="px-3 mr-2"
            @click="$router.push('/work-flow')"
          >{{ $t('buttons.startWorkflow') }}
          </vs-button>
        </div>

        <div class="flex" v-if="task.id">
          <vs-button
            v-if="allowedAddSubTask"
            icon="add"
            color="primary"
            type="gradient"
            class="px-3 mr-2"
            @click="$router.push('/task-add/' + task.id)"
          >{{ $t('buttons.addSubTask') }}
          </vs-button>

          <div class="flex" v-if="task.isGenerate">
            <div class="flex" v-if="allowedApproveOrReject || status !== '+'">
              <vs-button
                icon="done"
                color="success"
                class="px-3 btnx"
                type="gradient"
                @click="changeStage(1)"
              >{{ $t('buttons.approve') }}
              </vs-button>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button
                  class="btn-drop mr-2"
                  size="default"
                  color="#1CA998"
                  icon="expand_more"
                ></vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="getPrompt(1)">
                    {{ $t('buttons.approveWithComment') }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
            <div class="flex" v-if="allowedApproveOrReject || status !== '-'">
              <vs-button
                icon="close"
                color="danger"
                class="px-3 btnx"
                type="gradient"
                @click="changeStage(0)"
              >{{ $t('buttons.reject') }}
              </vs-button>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button
                  class="btn-drop mr-2"
                  size="default"
                  color="#BA365A"
                  icon="expand_more"
                ></vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="getPrompt(0)">
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
              class="px-3 mr-2 vs-con-loading__container"
              @click="changeStatus('+')"
            >{{ $t('buttons.execute') }}
            </vs-button>

            <vs-button
              v-if="status === '+'"
              icon="settings_backup_restore"
              color="warning"
              type="gradient"
              class="px-3"
              @click="changeStatus('*')"
            >{{ $t('buttons.returnToWork') }}
            </vs-button>
          </div>
        </div>
        <vs-spacer></vs-spacer>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center">
          <div class="text-right leading-tight sm:block">
            <p class="font-semibold">{{ user_displayName }}</p>
          </div>
          <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <div class="con-img ml-3">
              <img
                v-if="activeUserImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"/>
              <vs-avatar
                v-else
                class="rounded-full shadow-md cursor-pointer block"
                size="40px"
              ></vs-avatar>
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown whitespace-no-wrap">

              <vs-dropdown-group vs-collapse
                                 vs-label="Делегированные права"
                                 vs-icon="expand_more">
                <vs-dropdown-item v-for="rights in delegatedRights"
                                  :key="rights.ID"
                                  @click="applyDelegatedRights(rights.USERID)">
                  <span :class="{'font-semibold': rights.IsActive}">{{ rights.USERNAME }}</span>
                </vs-dropdown-item>
                <vs-dropdown-item divider @click="setDelegation">
                  Делегировать права
                </vs-dropdown-item>

              </vs-dropdown-group>

              <vs-dropdown-item divider @click="logout">
                <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"/>
                {{ $t('buttons.logout') }}
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
        <!-- I18N -->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
        <span class="cursor-pointer flex i18n-locale ml-3">
         {{ getCurrentLocaleData.flag.toUpperCase() }}
        </span>
          <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
            <vs-dropdown-item v-for="lang in localizations"
                              :key="lang.code"
                              @click="updateLocale(lang.code)">
              {{lang.flag.toUpperCase()}}   ({{lang.name}})
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </vs-navbar>
    </div>
    <vs-prompt
      :title="$t('comments.addComment')"
      @cancel="comment=''"
      @accept="changeStage(stage, comment)"
      :active.sync="activePrompt"
      :acceptText="$t('buttons.send')"
      :cancelText="$t('buttons.cancel')"
    >
      <div>
        <span>{{ $t('comments.placeholder') }}</span>
        <vs-input
          :placeholder="$t('comments.placeholder2')"
          v-model="comment"
          class="mt-3 w-full"
        />
      </div>

    </vs-prompt>
  </div>
</template>

<script>

import templateConfig from '@/templateConfig'
import auth from '@/api/auth/auth'
import {eventBus} from '@/main'

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
      activePrompt: false,
      stage: null,
      comment: '',
      buttonCancel: 'Отмена',
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60,
      }
    }
  },
  computed: {
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
    allowedApproveOrReject() {
      return this.status === ''
          || this.status === '*'
    },
    allowedAddSubTask() {
      return this.$route.name === 'task-view'
          && this.allowedApproveOrReject
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
      if (this.sidebarWidth === 'default') {
        return 'navbar-default'
      } else if (this.sidebarWidth === 'reduced') {
        return 'navbar-reduced'
      } else if (this.sidebarWidth) {
        return 'navbar-full'
      }
      return ''
    },
    // I18N
    getCurrentLocaleData() {
      const locale = this.$i18n.locale
      return this.localizations.find(r => r.code === locale)
    },
    // PROFILE
    currentUser() {
      const currentUser = this.$store.state.auth.currentUser
      return currentUser ? currentUser.UserData : {}
    },
    user_displayName() {
      const userData = this.currentUser.CurrentUserData
      return userData ? userData.UserName : ''
    },
    delegatedRights() {
      return this.currentUser.DelegatedRights || []
    },
    activeUserImg() {
      const userData = this.currentUser.CurrentUserData
      return userData ? userData.UserPhoto : ''
    }
  },
  methods: {
    getPrompt(stage) {
      this.stage = stage
      this.activePrompt = true
    },
    async changeStage(moveMode, comment) {
      try {
        await this.$store.dispatch('sm/changeStage', {
          id: this.task.id,
          arso: this.task.arso,
          keyValue: this.task.keyValue,
          kidCopy: this.task.kidCopy,
          moveMode,
          comment,
          processParams: null
        })
      } catch (e) {
        console.log(e.message)
      }
    },
    async changeStatus(status) {
      eventBus.$emit('changeStatus', {
        id: this.task.id,
        status: status,
        comment: ''
      })
    },
    updateLocale(locale) {
      this.$localization.SetLocalization(locale)
    },
    showSidebar() {
      this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
    },
    logout() {
      this.$store.dispatch('auth/logout')
    },
    async applyDelegatedRights(userId) {
      try {
        const result = await auth.applyDelegatedRights(userId)
        if (result) {
          this.$vs.notify({
            title: this.$t('notify.applyRightsTittle'),
            text: this.$t('notify.applyRightsSuccess'),
            color: 'success'
          })
          window.location.reload()
        }
        this.$vs.notify({
          title: this.$t('notify.applyRightsTittle'),
          text: this.$t('notify.applyRightsFail'),
          color: 'warning'
        })
      } catch (e) {
        this.$vs.notify({
          title: this.$t('notify.applyRightsTittle'),
          text: this.$t('notify.applyRightsError'),
          color: 'danger'
        })
      }
    },
    setDelegation() {
      console.log('Делегировать права', )
    }
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
    border-left: 1px solid rgba(255, 255, 255, .2);
  }

  button:hover > .btn-drop {
    transform: translateY(-2px);
  }

  button:active > .btn-drop {
    transform: translateY(0);
  }
</style>
