<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar class="vx-navbar navbar-custom flex flex-col"
                 :color="navbarColor"
                 :class="classObj">
        <div class="flex w-full h-8 justify-between items-center">
          <!-- SM - OPEN SIDEBAR BUTTON -->
          <feather-icon
            class="sm:inline-flex xl:hidden cursor-pointer mr-4"
            icon="MenuIcon"
            @click.stop="showSidebar"
          ></feather-icon>

          <span v-if="$route.name === 'task-add'
                      && !$route.params.taskId
                      && !$route.params.bindCaseId"
                class="text-primary truncate">
              {{ $t('tasks.newTask') }}</span>

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

          <!-- BREADCRUMB -->
          <vx-breadcrumb v-if="$route.meta.breadcrumb"/>
          <vs-spacer class="hidden"></vs-spacer>

          <!-- USER PANEL -->
            <div class="the-navbar__user-meta flex items-center ">
              <div class="text-right leading-tight
                      xl:block lg:hidden md:hidden sm:hidden xs:hidden">
                <p class="text-sm font-semibold">{{ userName }}</p>
              </div>
              <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
                <div class="con-img ml-3">
                  <vs-avatar class="rounded-full cursor-pointer block m-0"
                             :src="userPhoto"
                             size="30px"/>
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
        </div>
        <vs-divider></vs-divider>

        <div class="flex w-full h-8">
          <div v-if="$route.name === 'task-add'" class="text-primary truncate -ml-4">
            <i18n v-if="$route.params.taskId"
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
          </div>

          <span v-if="/task\/\d+\/edit/.test($route.path)"
                class="text-primary text-sm truncate">
            {{ task.name }}</span>

          <span v-if="/case\/\d+\/edit/.test($route.path)"
                class="text-primary text-sm truncate">
            {{ caseItem.name }}</span>

            <!-- CREATE TASK BUTTON -->
            <vs-button v-if="taskDetails || taskList"
                       icon="library_add"
                       color="primary"
                       type="flat"
                       class="px-2 py-0 mr-2 fit -ml-2"
                       to="/task-add"
            >{{ $t('buttons.addTask') }} </vs-button>

            <vs-button v-if="taskDetails && externalTaskCamunda && userIsPerformer"
                       icon="done"
                       color="success"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       @click="changeStatus('+')"
            >{{ task.id ? $t('buttons.execute') : $t('buttons.complete') }}
            </vs-button>

            <!-- CREATE CASE BUTTON -->
            <vs-button v-if="caseView || caseList"
                       icon="library_add"
                       color="primary"
                       type="flat"
                       class="px-2 py-0 mr-2 fit -ml-2"
                       to="/case-add"
            >{{ $t('buttons.addCase') }}</vs-button>
            <!-- START BUSINESS PROCESS BUTTON -->
            <vs-button v-if="taskList || caseList"
                       icon="launch"
                       color="success"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       to="/work-flow"
            >{{ $t('buttons.startWorkflow') }}</vs-button>
            <!-- RETURN TASK/CASE TO WORK BUTTON -->
            <vs-button v-if="taskCompleted || caseStatus === '+'"
                       icon="settings_backup_restore"
                       color="warning"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       @click="changeStatus('')"
            >{{ $t('buttons.returnToWork') }}</vs-button>
            <!-- APPROVE/FORVARD DROPDOWN BUTTON -->
            <div class="flex fit" v-if="taskDetails && agreeTaskInWork">
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="success"
                           class="px-2 py-0 btn-drop-approve"
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
                           class="px-2 py-0 btn-drop-reject"
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
            <div class="flex fit" v-if="taskDetails && workFlowTaskInWork">
              <vs-dropdown vs-trigger-click class="cursor-pointer">
                <vs-button icon="expand_more"
                           color="success"
                           class="px-2 py-0 btn-drop-approve"
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
                           class="px-2 py-0 btn-drop-reject"
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
                       class="px-2 py-0 mr-2 fit"
                       @click="changeStatus('+')"
            >{{ task.id ? $t('buttons.execute') : $t('buttons.complete') }}
            </vs-button>
            <!-- TASK TO FAVORITE BUTTON -->
            <vs-button v-if="taskOrCaseView && task.id && !task.isFavorite && !taskCompleted"
                       icon="star"
                       color="warning"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       @click="taskPin(true)"
            >{{ $t('buttons.pin') }}
            </vs-button>
            <!-- TASK REMOVE FROM FAVORITE BUTTON -->
            <vs-button v-if="taskOrCaseView && task.isFavorite"
                       icon="star_border"
                       color="danger"
                       type="flat"
                       class="px-2 py-0 py-0 mr-2 fit"
                       @click="taskPin(false)"
            >{{ $t('buttons.unpin') }}
            </vs-button>
            <!-- TASK/CASE EDIT BUTTON -->
            <vs-button v-if="taskOrCaseView && allowedTaskEdit || allowedCaseEdit"
                       icon="edit"
                       color="dark"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       :to="$route.path + '/edit'"
            >{{ $t('buttons.edit') }}
            </vs-button>
            <!-- TASK DELETE BUTTON -->
            <vs-button v-if="taskOrCaseView && allowedTaskEdit"
                       icon="delete_forever"
                       color="danger"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       @click="confirmTaskDelete"
            >{{ $t('buttons.delete') }}
            </vs-button>

          <!-- ATTACHMENT BUTTONS -->
          <div class="flex -ml-2" v-if="attachmentView">

            <!-- ADD ATTACHMENT BUTTON -->
            <vs-button v-if="attachmentTypes.length > 1"
                       icon="library_add"
                       color="primary"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       @click="$store.commit('sm/TOGGLE_TYPES_DIALOG', true)"
            >{{ $t('buttons.addAttachment') }} </vs-button>

            <label v-else
                   id="addLabel" for="file"
                   class="cursor-pointer text-primary">
              <vs-icon style="margin: 0 5px 1px 0;">library_add</vs-icon>
              {{ $t('buttons.addAttachment') }}
            </label>

           <vs-button icon="delete"
                       color="danger"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       :disabled="!currentAttachment.access"
                       @click="confirmAttachmentDelete"
            >{{ $t('buttons.deleteAttachment') }} </vs-button>

            <vs-button icon="cloud_download"
                       color="success"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       :disabled="!currentAttachment.access"
                       :href="currentAttachment.srcUrl"
            >{{ $t('buttons.downloadAttachment') }} </vs-button>

            <vs-button icon="library_books"
                       color="warning"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       :disabled="!currentAttachment.access"
                       :to="{name: 'versions'}"
            >{{ $t('buttons.attachmentVersions') }} </vs-button>

            <vs-button icon="assignment"
                       color="dark"
                       type="flat"
                       class="px-2 py-0 mr-2 fit"
                       :disabled="!currentAttachment.access"
                       @click="$store.commit('sm/TOGGLE_EDS_POPUP', true)"
            >{{ $t('buttons.attachmentEds') }} </vs-button>

          </div>

          <vs-spacer></vs-spacer>

          <div v-if="existHelper && taskList" class="flex items-center mr-3">
            <label for="helperExec" class="pr-4">{{ $t('tasks.handled') }}</label>
            <vs-switch id="helperExec" v-model="helperExec"/>
          </div>

          <vs-button type="flat" class="flex items-center p-0">
            <vs-icon size="small" icon="more_vert" class="p-0"></vs-icon>
          </vs-button>
        </div>

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
import 'swiper/dist/css/swiper.min.css'
import {eventBus} from '@/main'
import {mapGetters} from 'vuex'
import {tasks} from '@/mixins/tasks'

export default {
  name: 'the-navbar',
  mixins: [tasks],
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
      const id = +this.$route.params.taskId
      const task = this.$store.state.sm.taskInfo[id]
      return task ? task : {}
    },
    existHelper() {
      return this.$store.getters['sm/appParams'].EXISTSHELPER
    },
    helperExec: {
      get() {
        return this.$store.state.sm.helperExec
      },
      set (val) {
        this.$store.commit('sm/setHelperExec', val)
      }
    },
    caseItem() {
      const id = +this.$route.params.caseId
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
    attachmentTypes() {
      return this.$store.state.sm.attachments.attachmentTypes || []
    },
    currentAttachment() {
      return this.$store.state.sm.attachments.currentAttachment || {}
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
    taskDetails() {
      return this.$route.name === 'task-details'
    },
    caseList() {
      return this.$route.name === 'case-list'
    },
    caseView() {
      return this.$route.name === 'case-view'
    },
    taskOrCaseView() {
      return this.taskDetails || this.caseView
    },
    attachmentView() {
      return this.$route.path.includes('attachment')
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
      return this.$route.name === 'task-details'
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
  watch: {
    helperExec() {
      const folderCode = this.$store.state.sm.currentFolder
      this.getTasks(folderCode, true)
    }
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
    confirmTaskDelete() {
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
      if (this.$route.name === 'task-details') {
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
    },
    confirmAttachmentDelete() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: this.$t('attachments.delConfirmTitle'),
        text: this.$t('attachments.delConfirmText'),
        cancelText: this.$t('buttons.cancel'),
        acceptText: this.$t('buttons.delete'),
        accept: this.removeAttachment
      })
    },
    async removeAttachment() {
      const result = await this.$store.dispatch('sm/attachmentDelete', {
        fileId: this.currentAttachment.id,
        taskId: +this.$route.params.taskId,
        caseId: +this.$route.params.caseId
      })
      if (result.success) {
        await this.$router.push({name: 'task-attachments'})
      }
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

  .vs-navbar {

  }

  .vs-navbar >>> .vs-con-items {
    flex-direction: column;
  }

  .vs-divider {
    margin: .25em 0;
  }

  .fit {
    min-width: max-content;
  }

  .vs-button >>> .vs-button-text {
    display: flex !important;
  }

  button:hover > .btn-drop-approve {
    background: rgba(var(--vs-success), .08) !important;
  }

  button:hover > .btn-drop-reject {
    background: rgba(var(--vs-danger), .08) !important;
  }

  #addLabel {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 62px;
    min-height: 28px;
    padding: 1px 5px 0;
    border-radius: 0.375rem;
  }

  #addLabel:hover {
    background: rgba(var(--vs-primary),.08)!important;
  }

</style>
