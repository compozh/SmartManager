<template>
  <v-dialog v-model="taskDialog"
            persistent
            no-click-animation>

    <!-- Dialog header -->
    <div class="d-flex justify-space-between align-center mb-2">

      <!-- Breadcrumb -->
      <div class="d-flex white px-2"
           style="height: 25px; border-radius: 5px;">

        <!-- App name -->
        <div class="px-3" style="color: #2D469C;">Smart Manager</div>
        <v-img v-if="activeZone.title"
               src="@/assets/icons/chevron.svg" width="10px"/>

        <!-- Zone name -->
        <div v-if="activeZone.title" class="px-3 success--text">
          {{ activeZone.title }}</div>
        <v-img v-if="activeFolder.Name"
               src="@/assets/icons/chevron.svg" width="10px"/>

        <!-- Folder name -->
        <div v-if="activeFolder.Name" class="px-3 primary--text">
          {{ activeFolder.Name }}
        </div>
      </div>

      <!-- Close task details button -->
      <v-btn fab x-small
             depressed
             color="white"
             class="task-close"
             @click="closeTaskDetails">
        <fa-icon icon="times" type="fal"
                 size="2x" color="#979797"/>
      </v-btn>
    </div>

    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white"
           :gutter-size="4"
           :direction="$vuetify.breakpoint.smAndDown ? 'vertical' : 'horizontal'">

      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column" :size="55">

        <!-- LEFT HEADER -->
        <div class="side-header">

          <!-- TASK PERFORMER -->
          <task-performer v-model="taskData.performer"/>

          <!-- TASK DATE PLAN -->
          <task-date-plan v-model="taskData.datePlan"/>

          <v-spacer/>

          <!-- TASK SAVE BUTTON -->
          <save-button v-if="taskChanged && taskEditable"
                         @save="updateTaskData"
                         @cancel="initTaskData"/>

          <!-- ESCALATION BTN/MENU -->

          <!-- TASK MANAGEMENT BUTTONS -->
          <task-controls v-if="!taskChanged || taskEditable"
                         class="py-3"
                         :buttonIsBlocked="buttonIsBlocked"
                         :formVariables="formVariables"
                         @close-task="closeTaskDetails"
                         @get-variables="updateFormVariables"
                         @change-stage="executeTask(changeStage)"
                         @change-status="executeTask(changeStatus)"
                         @execute-external-task="executeTask(executeExternalTask)"/>

          <!-- TASK MENU - MORE BTN -->
          <!-- TODO: need define task menu btn position-->
          <!--          <task-menu @taskDelete="taskDelete"-->
          <!--                     @changeStatus="changeStatus"/>-->
        </div>
        <v-divider/>

        <!-- LEFT SCROLL AREA -->
        <perfect-scrollbar class="pa-5" :options="scrollOptions">
          <div class="d-flex align-baseline">

            <!-- TASK NAME -->
            <editable-text-field v-model="taskData.name"
                                 required flat
                                 :editable="taskEditable"
                                 :changed="taskChanged"
                                 :changeHandler="setTaskChanged"
                                 class="title font-weight-bold"/>

            <!-- TOGGLE PIN TASK BUTTON -->
            <icon-tooltip-btn :btnClass="`${ml}-auto`"
                              :btnColor="task.isFavorite ? 'cyan' : 'grey'"
                              :btnClick="toggleTaskPin"
                              icon="star" iconSize="2x"
                              :iconType="task.isFavorite ? 'far' : 'fal'"
                              tooltipPosition="top">
              {{ task.isFavorite ? $t('buttons.unpin') : $t('buttons.pin') }}
            </icon-tooltip-btn>
          </div>

          <!-- TASK DOC CAPTION -->
          <h3 v-if="task.docCaption && task.docCaption !== task.name"
              class="font-weight-light mb-3">
            {{ task.docCaption }}</h3>

          <!-- FORMIO -->
          <div v-if="Object.keys(form).length" class="w-full">
            <formio-form-component class="formio"
                                   ref="form"
                                   :formCode="form.UNFORMIO"
                                   :formDefinition="formDefinition"/>
          </div>

          <!-- HTML DESCRIPTION-->
          <task-description v-model="taskData.description"
                            :docTextHtml="task.docTextHtml"/>

          <!-- LABELS -->
          <task-labels :task="task"/>

          <v-divider/>

          <!-- TASK PARTICIPANTS -->
            <task-participants v-model="taskData.participants"
                               :readonly="externalTaskCamunda"
                               class="mb-10"/>

          <!-- TASK ATTACHMENTS -->
          <template v-if="externalTaskCamunda">
            <attachments-list v-for="businessObject in businessObjects"
                              :key="businessObject.BusinessObjectKey"
                              :businessObject="businessObject"
                              :attachmentList="attachmentList(businessObject.BusinessObjectKey)"
                              class="mb-10" @selectAttachment="tab = 0"/>
          </template>
          <attachments-list v-else class="mb-10"
                            :attachmentList="attachments"
                            @selectAttachment="tab = 0"/>

          <!-- BASE TASK -->
          <div v-if="baseTask" class="my-5">
            <fa-icon icon="sitemap" :class="`${mr}-3`" size="lg"/>
            <span class="font-weight-light">
              {{ $t('tasks.base').toUpperCase() }}</span>
            <task-list-item :task="baseTask" class="my-2"/>
          </div>

          <!-- PARENT TASKS -->
          <div v-if="task.parentTasks" class="my-5">
            <fa-icon icon="sitemap" :class="`${mr}-3`" size="lg"/>
            <span class="font-weight-light">
              {{ $t('tasks.parentTasks').toUpperCase() }}</span>
            <task-list-item v-for="task in task.parentTasks"
                            :key="task.id"
                            :task="task"
                            class="my-2"/>
          </div>

          <!-- SUB TASKS-->
          <div class="my-5">
            <div class="d-flex align-center font-weight-light">
              <fa-icon icon="folder-tree" :class="`${mr}-3`" size="lg"/>
              <span :class="`${mr}-3`">
                {{ $t('tasks.subTasks').toUpperCase() }}</span>
              <task-form #activator="{ on }">
                <v-btn v-on="on"
                       outlined x-small
                       color="primary"
                       class="add-btn pa-2">
                  {{ $t('buttons.add') }}
                </v-btn>
              </task-form>
            </div>
            <task-list-item v-for="task in childTasks"
                            :key="task.id"
                            :task="task"
                            class="my-2"/>
          </div>
        </perfect-scrollbar>
      </SplitArea>

      <!-- RIGHT CONTENT AREA -->
      <SplitArea class="d-flex flex-column overflow-hidden" :size="45">
        <v-tabs v-model="tab" grow
                height="75px" class="flex-grow-0">
          <v-tab v-for="(tab, idx) in visibleTabs" :key="idx">
            <fa-icon :icon="tab.icon" :class="`${mr}-3`" size="lg"/>
            {{ tab.name }}
            <v-btn v-if="showConvertBtn && tab.component === 'attachments-viewer'"
                   :color="`${showOriginal ? 'red' : 'green'} darken-4`"
                   :class="`${ml}-8`"
                   style="border: 1px dashed;"
                   @click.stop="toggleSwitchFile"
                   text x-small dark depressed>
              {{ $t('versions.showInPDF', {
                   ext: showOriginal ? 'PDF' : showConvertBtn
                 }) }}
            </v-btn>
          </v-tab>
        </v-tabs>
        <v-divider/>
        <v-tabs-items v-model="tab" class="fill-height">
          <v-tab-item v-for="(tab, idx) in visibleTabs"
                      :key="idx" class="fill-height">
            <component :is="tab.component" :show-original="showOriginal"/>
          </v-tab-item>
        </v-tabs-items>
      </SplitArea>
    </Split>

    <!-- Sign attachments dialog -->
    <eds-create v-if="signAttachmentsDialog"
                v-model="signAttachmentsDialog"
                multiple-sign
                :attachments="attachments"
                @sign-done="taskExecuteMethod"/>

  </v-dialog>
</template>

<script>
import OutlinedBtn from '../../../components/OutlinedBtn'
import { zones, folders, tasks, attachments } from '@/mixins/units'
import { date } from '@/mixins/dateTime'

const IconTooltipBtn = () => import('@/components/IconTooltipBtn')
const SaveButton = () => import('@/components/SaveButton')
const TaskPerformer = () => import('@/views/tasks/task-edit/TaskPerformer')
const TaskDatePlan = () => import('@/views/tasks/task-edit/TaskDatePlan')
const TaskControls = () => import('@/views/tasks/task-details/TaskControls')
const TaskMenu = () => import('@/views/tasks/task-details/TaskMenu')
const EditableTextField = () => import('@/components/EditableTextField')
const TaskDescription = () => import('@/views/tasks/task-edit/TaskDescription')
const TaskLabels = () => import('@/views/tasks/task-details/TaskLabels')
const TaskParticipants = () => import('@/views/tasks/task-edit/TaskParticipants')
const TaskForm = () => import('@/views/tasks/task-create/TaskForm')
const TaskListItem = () => import('@/views/tasks/task-list/TaskListItem.vue')
const AttachmentsList = () => import('@/views/attachments/attachment-list/AttachmentsList')
const AttachmentsViewer = () => import('@/views/attachments/attachment-viewers/AttachmentsViewer')
const Comments = () => import('@/views/comments/Comments')
const Diagram = () => import('@/views/diagram/Diagram')
const EdsCreate = () => import('@/views/attachments/attachment-eds/eds-create/EdsCreate')

export default {
  name: 'TaskDetails',
  mixins: [zones, folders, tasks, attachments, date],

  components: {
    OutlinedBtn,
    SaveButton,
    IconTooltipBtn,
    TaskPerformer,
    TaskDatePlan,
    TaskControls,
    TaskMenu,
    EditableTextField,
    TaskDescription,
    TaskLabels,
    TaskParticipants,
    TaskForm,
    TaskListItem,
    AttachmentsList,
    AttachmentsViewer,
    Comments,
    Diagram,
    EdsCreate
  },

  data: () => ({
    tab: 0,
    taskData: {
      performer: {},
      datePlan: '',
      name: '',
      description: '',
      participants: []
    },
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    },
    buttonIsBlocked: false,
    showOriginal: true,
    signAttachmentsDialog: false,
    taskExecuteMethod: null,
    formVariables: null
  }),

  computed: {
    form () {
      return this.externalParams && this.externalParams.FORM
        ? this.externalParams.FORM : {}
    },

    baseTask () {
      return this.task.parentTask && this.task.parentTask.id
        ? this.task.parentTask
        : null
    },

    childTasks () {
      return this.task.childTasks && this.task.childTasks.length
        ? this.task.childTasks
        : []
    },

    visibleTabs () {
      return this.tabItems.filter(tab => tab.isVisible)
    },

    tabItems () {
      return [
        {
          name: this.$t('tabs.attachment'),
          component: 'attachments-viewer',
          icon: 'paperclip',
          isVisible: !!this.attachments.length
        },
        {
          name: this.$t('tabs.comments'),
          component: 'comments',
          icon: 'comment-alt-dots',
          isVisible: true
        },
        {
          name: this.$t('tabs.diagram'),
          component: 'diagram',
          icon: 'project-diagram',
          isVisible: this.externalTaskCamunda
        }
      ]
    },

    attachmentList () {
      return key => {
        if (key) {
          return this.attachments.filter(attachment => {
            // Не строгое сравнение необходимо из-за разности типов businessObjectKey
            // в task.originals и task.externalParams.businessObjects
            // eslint-disable-next-line eqeqeq
            return attachment.businessObjectKey == key
          })
        } else {
          return this.attachments
        }
      }
    },

    showConvertBtn () {
      const version = this.currentVersion.Details || {}
      if (version.FileName) {
        const ext = version.FileName.split('.').pop().toLowerCase()
        const matching = ['doc', 'docx', 'rtf'].some(i => i === ext)
        if (matching) return ext.toUpperCase()
      }
      return false
    },

    needAttachmentsSign () {
      return this.task.type === 'DLPSIGNDOC' && this.attachments.length
    }
  },

  watch: {
    '$route' (route) {
      if (route.name === 'task-details') {
        this.openTask()
      }
    }
  },

  async created () {
    await this.openTask()
  },

  methods: {
    async openTask () {
      await this.getTask()
      // Work with attachments must starting after task details info loaded
      if (this.attachments.length && !this.activeAttachment.id) {
        await this.setActiveAttachment(this.attachments[0])
        this.tab = 0
      }
      this.setTaskEditable(!this.externalTaskCamunda)
      this.initTaskData()
      this.tab = this.attachments.length ? 0 : 1
      // Re-reading folders to update counters
      this.getFolders()
      // Always send commit to set task as read
      this.$store.commit('SET_TASK_IS_READ', {
        taskId: this.taskId,
        folderId: this.activeFolderId
      })
    },

    initTaskData () {
      this.taskData.performer = {
        fio: this.task.performer,
        userId: this.task.performerId,
        photo: this.task.performerPhoto
      }
      // Convert dateTime UTC to local
      this.taskData.datePlan = this.toLocalString(this.task.dateplan)
      this.taskData.name = this.task.name
      this.taskData.description = this.task.htmlDescript
      this.taskData.participants = this.task.participants || []
      this.setTaskChanged(false)
    },

    closeTaskDetails () {
      this.showTaskDialog(false)
      this.$router.push('/tasks/' + this.activeFolder.Code)
    },

    async formSubmit () {
      if (this.$refs.form) {
        const form = this.$refs.form
        const taskId = this.taskId
        try {
          this.$store.commit('START_PRELOADER', 'formSubmit')
          const result = await form.submit({ taskId })
          if (result) {
            if (result.success && result.successMessage) {
              this.$store.commit('SET_NOTIFY', {
                text: result.successMessage,
                color: 'success'
              })
            } else if (result.errorMessage) {
              this.$store.commit('SET_NOTIFY', {
                text: result.errorMessage,
                color: 'warning'
              })
            }
            return result
          }
        } catch (e) {
          if (e.length) {
            e.forEach(e => {
              this.$store.commit('SET_NOTIFY', {
                text: e.message || 'Form submit error',
                color: 'warning'
              })
            })
          } else {
            console.error(e)
            this.$store.commit('SET_NOTIFY', {
              text: e.message || 'Form submit error',
              color: 'error'
            })
          }
        } finally {
          this.$store.commit('STOP_PRELOADER', 'formSubmit')
        }
      } else {
        return { success: true }
      }
    },

    executeTask (executor) {
      if (this.needAttachmentsSign) {
        this.taskExecuteMethod = executor
        this.signAttachmentsDialog = true
      } else {
        executor()
      }
    },

    async changeStatus (status, CompleteParams) {
      this.buttonIsBlocked = true
      const statusParams = {
        type: 'TASK',
        id: this.taskId,
        status,
        comment: '',
        CompleteParams
      }
      const success = await this.$store.dispatch('changeTaskStatus', statusParams)
      this.buttonIsBlocked = false
      if (success) {
        await this.$router.push('/')
      }
    },

    async changeStage (moveMode, comment) {
      this.buttonIsBlocked = true
      await this.$store.dispatch('changeStage', {
        id: this.taskId,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy,
        moveMode,
        comment,
        processParams: null
      })
      this.buttonIsBlocked = false
    },

    async executeExternalTask () {
      this.buttonIsBlocked = true
      const status = '+' // Task complete
      const result = await this.formSubmit()
      if (result && result.success) {
        const completeParams = result.submission
          ? JSON.stringify(result.submission) : null
        await this.changeStatus(status, completeParams)
      }
      this.buttonIsBlocked = false
    },

    toggleTaskPin () {
      this.$store.dispatch('taskPin', {
        taskId: this.taskId,
        pin: !this.task.isFavorite
      })
    },

    async taskDelete () {
      const success = await this.$store.dispatch('taskDelete', this.taskId)
      if (success) {
        await this.$router.push('/')
      }
    },

    async updateTaskData () {
      this.setTaskChanged(false)
      const taskData = {
        id: this.taskId,
        name: this.taskData.name,
        performerId: this.taskData.performer.userId,
        dateplan: this.toIsoLocalString(this.taskData.datePlan),
        descript: this.taskData.description,
        participants: this.taskData.participants
      }
      const result = await this.$store.dispatch('updateTask', taskData)
      if (!result.success) {
        this.initTaskData()
      }
    },

    async toggleSwitchFile () {
      if (!this.showOriginal) {
        this.showOriginal = true
      } else if (this.currentVersion.Details.Pdf) {
        this.showOriginal = false
      } else {
        const result = await this.getPdfUrl()
        if (result) {
          this.showOriginal = false
        }
      }
    },

    updateFormVariables () {
      const form = this.$refs.form
      if (form) {
        this.formVariables = form.submission
      }
    }
  },

  beforeDestroy () {
    this.setTaskChanged(false)
    this.resetAttachmentData()
  }
}
</script>

<style scoped>

  .v-dialog__content {
    flex-direction: column;
    padding: 0 2em;
  }

  .v-dialog__content >>> .v-dialog {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 0.5em 0 2em;
    overflow: hidden;
  }

  .v-dialog__content >>> .v-dialog:not(.v-dialog--fullscreen) {
    max-height: 96%;
  }

  .task-close:hover {
    transform: rotate(180deg);
  }

  .side-header {
   position: relative;
   display: flex;
   align-items: center;
   flex-wrap: wrap;
   flex-shrink: 0;
   padding: 0 1.25em;
   min-height: 75px;
 }

  .split >>> .gutter {
    background: #eee;
    transition: background .2s linear .1s;
  }

  .split >>> .gutter:hover {
    background: rgba(123, 104, 238, .3);
  }

 .v-input >>> .v-input__slot,
 .v-input >>> .v-text-field__details {
   padding: 0 !important;
 }

  .add-btn {
    min-height: 25px;
    min-width: 50px;
    font-size: 12px;
  }

  .add-btn >>> span {
    height: 25px;
    width: 100%;
  }

</style>
