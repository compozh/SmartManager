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

        <div v-if="$route.name === 'task-add'" class="text-primary truncate">
          <i18n v-if="$route.params.id"
                path="tasks.newSubTask" tag="div" class="truncate">
            <template v-slot:task>
              <span class="text-success">"{{ task.name }}"</span>
            </template>
          </i18n>

          <i18n v-if="$route.params.bindCaseId"
                path="tasks.newTaskForCase" tag="div" class="truncate">
            <template v-slot:case>
              <span class="text-success">"{{ $route.params.bindCaseName }}"</span>
            </template>
          </i18n>

          <span v-if="!$route.params.id && !$route.params.bindCaseId">
              {{ $t('tasks.newTask') }}</span>
        </div>

        <span v-if="/task\/\d+\/edit/.test($route.path)"
              class="text-primary truncate">
            {{ $t('tasks.edit') }}</span>

        <span v-if="$route.name === 'case-add'"
              class="text-primary truncate">
            {{ $t('cases.newCase') }}</span>

        <span v-if="/case\/\d+\/edit/.test($route.path)"
              class="text-primary truncate">
            {{ $t('cases.edit') }}</span>

        <span v-if="$route.name === 'work-flow'"
              class="text-primary truncate">
            {{ $t('workflow.newBusinessProcess') }}</span>

        <VuePerfectScrollbar class=flex :settings="settings">

            <!-- CREATE TASK BUTTON -->
            <vs-button v-if="taskView || taskList"
                       icon="library_add"
                       color="primary"
                       type="flat"
                       class="px-3 mr-2 fit"
                       to="/task-add"
            >{{ $t('buttons.addTask') }} </vs-button>

            <vs-button v-if="taskView && externalTaskCamunda && userIsPerformer"
                       icon="done"
                       color="success"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="changeStatus('+')"
            >{{ task.id ? $t('buttons.execute') : $t('buttons.complete') }}

            </vs-button>
            <!-- CREATE CASE BUTTON -->
            <vs-button v-if="caseView || caseList"
                       icon="library_add"
                       color="primary"
                       type="flat"
                       class="px-3 mr-2 fit"
                       to="/case-add"
            >{{ $t('buttons.addCase') }}
            </vs-button>
            <!-- START BUSINESS PROCESS BUTTON -->
            <vs-button v-if="taskList || caseList"
                       icon="launch"
                       color="success"
                       type="flat"
                       class="px-3 mr-2 fit"
                       to="/work-flow"
            >{{ $t('buttons.startWorkflow') }}
            </vs-button>
            <!-- RETURN TASK/CASE TO WORK BUTTON -->
            <vs-button v-if="taskCompleted || caseStatus === '+'"
                       icon="settings_backup_restore"
                       color="warning"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="changeStatus('')"
            >{{ $t('buttons.returnToWork') }}
            </vs-button>
            <!-- APPROVE/FORVARD DROPDOWN BUTTON -->
            <div class="flex fit" v-if="taskView && agreeTaskInWork">
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="success"
                           class="px-3 btn-drop-approve"
                           type="flat"
                >{{ buttonApprove }}
                </vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="changeStage(1)">
                    {{ buttonApprove }}
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="getPrompt(1)">
                    {{ buttonApprove + $t('buttons.withComment') }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="danger"
                           class="px-3 btn-drop-reject"
                           type="flat"
                >{{ buttonReject }}
                </vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="changeStage(0)">
                    {{ buttonReject }}
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="getPrompt(0)">
                    {{ buttonReject + $t('buttons.withComment')}}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
            <!-- REJECT/BACK DROPDOWN BUTTON -->
            <div class="flex fit" v-if="taskView && workFlowTaskInWork">
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="success"
                           class="px-3 btn-drop-approve"
                           type="flat"
                >{{ buttonForward }}
                </vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="changeStage(1)">
                    {{ buttonForward }}
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="getPrompt(1)">
                    {{ buttonForward + $t('buttons.withComment') }}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="danger"
                           class="px-3 btn-drop-reject"
                           type="flat"
                >{{ buttonBack }}
                </vs-button>
                <vs-dropdown-menu>
                  <vs-dropdown-item @click="changeStage(0)">
                    {{ buttonBack }}
                  </vs-dropdown-item>
                  <vs-dropdown-item @click="getPrompt(0)">
                    {{ buttonBack + $t('buttons.withComment')}}
                  </vs-dropdown-item>
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
            <!-- FINISH TASK/CASE BUTTON -->
            <vs-button v-if="taskOrCaseView && (caseStatus === '' ||
                             (internalTaskInWork && taskType === ''))"
                       icon="done"
                       color="success"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="changeStatus('+')"
            >{{ task.id ? $t('buttons.execute') : $t('buttons.complete') }}
            </vs-button>
            <!-- TASK TO FAVORITE BUTTON -->
            <vs-button v-if="taskOrCaseView && task.id && !task.isFavorite && !taskCompleted"
                       icon="star"
                       color="warning"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="taskPin(true)"
            >{{ $t('buttons.pin') }}
            </vs-button>
            <!-- TASK REMOVE FROM FAVORITE BUTTON -->
            <vs-button v-if="taskOrCaseView && task.isFavorite"
                       icon="star_border"
                       color="danger"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="taskPin(false)"
            >{{ $t('buttons.unpin') }}
            </vs-button>
            <!-- TASK/CASE EDIT BUTTON -->
            <vs-button v-if="taskOrCaseView && allowedTaskEdit || allowedCaseEdit"
                       icon="edit"
                       color="dark"
                       type="flat"
                       class="px-3 mr-2 fit"
                       :to="$route.path + '/edit'"
            >{{ $t('buttons.edit') }}
            </vs-button>
            <!-- TASK DELETE BUTTON -->
            <vs-button v-if="taskOrCaseView && allowedTaskEdit"
                       icon="delete_forever"
                       color="danger"
                       type="flat"
                       class="px-3 mr-2 fit"
                       @click="confirmDelete"
            >{{ $t('buttons.delete') }}
            </vs-button>

        </VuePerfectScrollbar>

        <vs-spacer class="hidden"></vs-spacer>

        <!-- USER PANEL -->
        <div class="the-navbar__user-meta flex items-center">
          <div class="text-right leading-tight
                      xl:block lg:hidden md:hidden sm:hidden xs:hidden">
            <p class="font-semibold">{{ userName }}</p>
          </div>
          <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
            <div class="con-img ml-3">
              <vs-avatar class="rounded-full shadow-md cursor-pointer block m-0 hover:shadow-2xl"
                         :src="userPhoto"
                         size="40px"/>
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown whitespace-no-wrap">
              <div class="ml-3 leading-tight xl:hidden">
                <p class="font-semibold">{{ userName }}</p>
              </div>

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
                              @click="updateLocale(lang.code)"
                              :class="{'font-semibold': lang.code === getCurrentLocaleData.flag}">
              {{lang.flag.toUpperCase()}} ({{lang.name}})
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </vs-navbar>
    </div>
    <vs-prompt :title="$t('comments.addComment')"
               @cancel="comment = ''"
               @accept="changeStage(stage, comment)"
               :active.sync="activePrompt"
               :acceptText="$t('buttons.send')"
               :cancelText="$t('buttons.cancel')">
      <div>
        <span>{{ $t('comments.placeholder') }}</span>
        <vs-input :placeholder="$t('comments.placeholder2')"
                  v-model="comment"
                  class="mt-3 w-full"/>
      </div>
    </vs-prompt>
  </div>
</template>

<script>

import templateConfig from '@/templateConfig'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import 'swiper/dist/css/swiper.min.css'
import {eventBus} from '@/main'
import {mapGetters} from 'vuex'

export default {
  name: 'the-navbar',
  components: {
    VuePerfectScrollbar
  },
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
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20
      }
    }
  },
  computed: {
    // PROFILE
    ...mapGetters('auth', [
      'userId',
      'userName',
      'userPhoto',
      'delegatedRights'
    ]),
    task() {
      const id = +this.$route.params.id
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    caseItem() {
      const id = +this.$route.params.id
      const caseItem = this.$store.state.sm.caseDetails[id]
      return caseItem ? caseItem : {}
    },
    caseStatus() {
      return this.caseItem.status
    },
    taskStatus() {
      return this.task.status || ''
    },
    taskType() {
      return this.task.taskType
    },
    taskInWork() {
      return this.taskStatus === ''
          || this.taskStatus === '*'
    },
    internalTask() {
      return this.taskType === ''
          || this.taskType === 'AGREE'
          || this.taskType === 'WORKFLOW'
    },
    // ROUTES CONDITIONS
    taskList() {
      return this.$route.name === 'task-list'
    },
    taskView() {
      return this.$route.name === 'task-view'
    },
    caseList() {
      return this.$route.name === 'case-list'
    },
    caseView() {
      return this.$route.name === 'case-view'
    },
    taskOrCaseView() {
      return this.taskView || this.caseView
    },
    // CONDITIONS FOR BUTTONS
    internalTaskInWork() {
      return this.internalTask && this.taskInWork
    },
    taskCompleted() {
      return this.taskType === '' && this.taskStatus === '+'
    },
    agreeTaskInWork() {
      return this.taskType === 'AGREE' && this.taskInWork
    },
    workFlowTaskInWork() {
      return this.taskType === 'WORKFLOW' && this.taskInWork
    },
    externalTaskCamunda() {
      if (!this.task.externalParams) {
        return
      }
      const externalParams = JSON.parse(this.task.externalParams)
      return this.taskType === 'EXTERNAL'
        && externalParams.EXTERNALSOURCE === 'C'
    },
    userIsPerformer() {
      return this.userId === this.task.performerId
    },
    allowedCaseEdit() {
      return this.$route.name === 'case-view'
          && this.caseStatus === ''
          && this.userId === this.caseItem.userAdd
    },
    allowedTaskEdit() {
      return this.$route.name === 'task-view'
          && this.internalTaskInWork
          && this.userId === this.task.declarerId
    },
    // BUTTONS FROM BACKEND FOR TASK TYPE "AGREE" and "WF"
    buttonBack() {
      return this.task.previousButtonText
          || this.$t('buttons.back')
    },
    buttonForward() {
      return this.task.nextButtonText
          || this.$t('buttons.forward')
    },
    buttonReject() {
      return this.task.previousButtonText
          || this.$t('buttons.reject')
    },
    buttonApprove() {
      return this.task.nextButtonText
          || this.$t('buttons.approve')
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
    }
  },
  beforeRouteEnter(to, from, next) {
    to.params.routeToBack = from.path
    next()
  },
  methods: {
    getPrompt(stage) {
      this.stage = stage
      this.activePrompt = true
    },
    taskPin(pin) {
      this.$store.dispatch('sm/taskPin', {
        taskId: this.task.id,
        pin
      })
    },
    confirmDelete() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('tasks.delConfirmTitle'),
        text: this.$t('tasks.delConfirmText'),
        acceptText: this.$t('buttons.delete'),
        cancelText: this.$t('buttons.cancel'),
        accept: this.taskDelete
      })
    },
    async taskDelete() {
      const success = await this.$store.dispatch('sm/taskDelete', this.task.id)
      if (success) {
        await this.$router.push('/')
      }
    },
    changeStage(moveMode, comment) {
      this.$store.dispatch('sm/changeStage', {
        id: this.task.id,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy,
        moveMode,
        comment,
        processParams: null
      })
    },
    async changeStatus(status) {
      if (this.$route.name === 'task-view') {
        eventBus.$emit('changeStatus', {
          type: 'TASK',
          id: this.task.id,
          status,
          comment: ''
        })
      } else if (this.$route.name === 'case-view') {
        await this.$store.dispatch('sm/changeStatus', {
          type: 'CASE',
          id: this.caseItem.id,
          status,
        })
      }
    },
    updateLocale(locale) {
      this.$localization.SetLocalization(locale)
      // Перечитка папок для обновления локализации
      this.$store.dispatch('sm/getFolders', true)
    },
    showSidebar() {
      this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
    },
    logout() {
      this.$store.dispatch('auth/logout')
    },
    applyDelegatedRights(userId) {
      this.$store.dispatch('auth/applyDelegatedRights', userId)
    },
    setDelegation() {
      console.log('Делегировать права',)
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

  .fit {
    min-width: max-content;
  }

  button:hover > .btn-drop-approve {
    background: rgba(var(--vs-success), .08) !important;;
  }

  button:hover > .btn-drop-reject {
    background: rgba(var(--vs-danger), .08) !important;;
  }

</style>
