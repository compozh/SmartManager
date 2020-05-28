<template>
    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white"
          :gutter-size="4">
      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column" :size="55">
        <!-- LEFT HEADER -->
        <div class="side-header px-5 d-flex flex-wrap">
          <!-- TASK PERFORMER -->
          <task-performer v-model="taskData.performer"/>
          <!-- TASK DATE PLAN -->
          <task-date-plan v-model="taskData.datePlan"/>
          <v-spacer/>
          <!-- TASK SAVE BUTTON -->
          <task-save-btn v-if="taskChanged"
                         @save="updateTaskData"
                         @cancel="initTaskData"/>
          <!-- TASK MANAGEMENT BUTTONS -->
          <task-buttons v-if="!taskChanged"
                        class="py-3"
                        @changeStage="changeStage"
                        @changeStatus="changeStatus"
                        @executeExternalTask="executeExternalTask"/>
          <!-- TASK MENU - MORE BTN -->
          <task-menu @taskDelete="taskDelete"
                     @changeStatus="changeStatus"/>
        </div>
        <v-divider/>
        <!-- LEFT SCROLL AREA -->
        <perfect-scrollbar class="pa-5">
          <div class="d-flex align-baseline">
            <!-- TASK NAME -->
            <task-name v-model="taskData.name"/>

            <!-- TOGGLE PIN TASK BUTTON -->
            <icon-tooltip-btn btnClass="ml-auto"
                              :btnColor="task.isFavorite ? 'cyan' : 'grey'"
                              :btnClick="toggleTaskPin"
                              icon="star" iconSize="2x"
                              :iconType="task.isFavorite ? 'far' : 'fal'"
                              tooltipPosition="top">
              {{ task.isFavorite ? $t('buttons.unpin') : $t('buttons.pin') }}
            </icon-tooltip-btn>
          </div>
          <!-- TASK DOC CAPTION -->
          <h3 v-if="task.name !== task.docCaption"
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
          <div v-if="participants.length"
               class="d-flex justify-space-between mt-5">
            <div v-if="coExecutors.length">
              <fa-icon icon="users" class="mr-3" size="lg"/>
              <span>{{ $t('roles.coExecutors').toUpperCase() }}</span>
              <div class="py-2 d-flex flex-wrap">
                <v-chip v-for="participant in coExecutors"
                        :key="participant.userId"
                        class="my-2 mr-2" small pill>
                  <v-avatar left>
                    <fa-icon icon="user-circle" size="lg"/>
                  </v-avatar>
                  {{ participant.name }}
                </v-chip>
              </div>
            </div>
            <div v-if="observers.length">
              <fa-icon icon="concierge-bell" class="mr-3" size="lg"/>
              <span>{{ $t('roles.notify').toUpperCase() }}</span>
              <div class="py-2 d-flex flex-wrap">
                <v-chip v-for="participant in observers"
                        :key="participant.userId"
                        class="my-2 ml-2" small pill>
                  <v-avatar left>
                    <fa-icon icon="user-circle" size="lg"/>
                  </v-avatar>
                  {{ participant.name }}
                </v-chip>
              </div>
            </div>
          </div>
          <!-- TASK ATTACHMENTS -->
          <attachments-list class="my-5" @input="tab = 0"/>
          <!-- BASE TASK -->
          <div v-if="baseTask" class="my-5">
            <fa-icon icon="tasks-alt" class="mr-3" size="lg"/>
            <span>{{ $t('tasks.base').toUpperCase() }}</span>
            <data-iterator :tasks="[baseTask]" class="mt-3" hide-footer/>
          </div>
          <!-- PARENT TASKS -->
          <div v-if="task.parentTasks" class="my-5">
            <fa-icon icon="tasks-alt" class="mr-3" size="lg"/>
            <span>PARENT TASKS</span>
            <data-iterator :tasks="task.parentTasks" class="mt-3" hide-footer/>
          </div>
          <!-- SUB TASKS-->
          <div v-if="childTasks" class="my-5">
            <fa-icon icon="tasks-alt" class="mr-3" size="lg"/>
            <span>{{ $t('tasks.subTasks').toUpperCase() }}</span>
            <data-iterator :tasks="childTasks" class="mt-3" hide-footer/>
          </div>
        </perfect-scrollbar>
      </SplitArea>
      <!-- RIGHT CONTENT AREA -->
      <SplitArea class="d-flex flex-column" :size="45">
        <v-tabs v-model="tab" grow height="75px" class="flex-grow-0">
          <v-tab v-for="tab in tabItems" :key="tab.name">
            <fa-icon :icon="tab.icon" class="mr-3" size="lg"/>
            {{ tab.name }}
          </v-tab>
        </v-tabs>
        <v-divider/>
        <v-tabs-items v-model="tab" class="fill-height">
          <v-tab-item v-for="tab in tabItems"
                      :key="tab.name"
                      class="fill-height">
            <component :is="tab.component"/>
          </v-tab-item>
        </v-tabs-items>
      </SplitArea>
    </Split>
</template>

<script>
import { date } from '@/mixins/dateTime'
import { folders, tasks, attachments } from '@/mixins/units'
import TaskPerformer from '@/views/tasks/task-edit/TaskPerformer'
import TaskDatePlan from '@/views/tasks/task-edit/TaskDatePlan'
import TaskSaveBtn from '@/views/tasks/task-edit/TaskSaveBtn'
import TaskButtons from '@/views/tasks/task-details/TaskButtons'
import TaskMenu from '@/views/tasks/task-details/TaskMenu'
import TaskName from '@/views/tasks/task-edit/TaskName'
import TaskDescription from '@/views/tasks/task-edit/TaskDescription'
import TaskLabels from '@/views/tasks/task-details/TaskLabels'
import DataIterator from '@/views/tasks/task-list/DataIterator'
import AttachmentsList from '@/views/attachments/attachments-list/AttachmentsList'
import AttachmentsViewer from '@/views/attachments/attachments-viewers/AttachmentsViewer'
import Comments from '@/views/comments/Comments'
import Diagram from '@/views/diagram/Diagram'
import IconTooltipBtn from '@/components/IconTooltipBtn'

export default {
  name: 'TaskDetails',
  components: {
    TaskPerformer,
    TaskDatePlan,
    TaskSaveBtn,
    TaskButtons,
    TaskMenu,
    TaskName,
    TaskDescription,
    TaskLabels,
    DataIterator,
    AttachmentsList,
    AttachmentsViewer,
    Comments,
    Diagram,
    IconTooltipBtn
  },
  mixins: [folders, tasks, attachments, date],
  data: () => ({
    tab: 0,
    taskData: {
      performer: {},
      datePlan: '',
      name: '',
      description: ''
    }
  }),
  computed: {
    form () {
      return this.externalParams && this.externalParams.FORM
        ? this.externalParams.FORM : {}
    },
    formDefinition () {
      return {
        components: this.form.COMPONENTS,
        submission: this.form.SUBMISSION,
        display: this.form.DISPLAY,
        settings: this.form.SETTINGS,
        properties: this.form.PROPERTIES,
        isSystem: this.form.ISSYSTEM,
        name: this.form.NAME
      }
    },
    baseTask () {
      return this.task.parentTask && this.task.parentTask.id
        ? this.task.parentTask
        : null
    },
    childTasks () {
      return this.task.childTasks && this.task.childTasks.length
        ? this.task.childTasks
        : null
    },
    tabItems () {
      const tabs = [
        { name: this.$t('tabs.attachment'), component: 'attachments-viewer', icon: 'paperclip' },
        { name: this.$t('tabs.comments'), component: 'comments', icon: 'comment-alt-dots' }
      ]
      if (this.externalTaskCamunda) {
        tabs.push({ name: this.$t('tabs.diagram'), component: 'diagram', icon: 'project-diagram' })
      }
      return tabs
    },
    participants () {
      return this.task.participants || []
    },
    coExecutors () {
      return this.participants.filter(i => i.role === 'COEXECUTOR')
    },
    observers () {
      return this.participants.filter(i => i.role === 'OBSERVER')
    }
  },
  watch: {
    '$route' (route) {
      if (route.name === 'task-details') {
        this.getTask()
      }
    }
  },
  async created () {
    await this.getTask()
    this.initTaskData()
    this.tab = this.attachments.length ? 0 : 1
    this.task.isRead || this.getFolders()
  },
  methods: {
    initTaskData () {
      this.taskData.performer = {
        fio: this.task.performer,
        userId: this.task.performerId,
        photo: this.task.performerPhoto
      }
      this.taskData.datePlan = this.task.dateplan
      this.taskData.name = this.task.name
      this.taskData.description = this.task.htmlDescript
      this.setTaskChanged(false)
    },
    async formSubmit () {
      if (this.$refs.form) {
        const form = this.$refs.form
        const taskId = this.taskId
        try {
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
        }
      } else {
        return true
      }
    },
    async changeStatus (status, CompleteParams) {
      const statusParams = {
        type: 'TASK',
        id: this.taskId,
        status,
        comment: '',
        CompleteParams
      }
      const success = await this.$store.dispatch('changeTaskStatus', statusParams)
      if (success) {
        await this.$router.push('/')
      }
    },
    changeStage (moveMode, comment) {
      this.$store.dispatch('changeStage', {
        id: this.taskId,
        arso: this.task.arso,
        keyValue: this.task.keyValue,
        kidCopy: this.task.kidCopy,
        moveMode,
        comment,
        processParams: null
      })
    },
    async executeExternalTask () {
      const status = '+' // Task complete
      const result = await this.formSubmit()
      if (result) {
        const completeParams = result.submission
          ? JSON.stringify(result.submission) : null
        this.changeStatus(status, completeParams)
      }
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
        dateplan: this.formatDateTime(this.taskData.datePlan),
        descript: this.taskData.description
      }

      await this.$store.dispatch('updateTask', taskData)
    }
  },
  beforeDestroy () {
    this.setTaskChanged(false)
    this.resetAttachmentData()
  }
}
</script>

<style scoped>

 .side-header {
   position: relative;
   display: flex;
   align-items: center;
   min-height: 75px;
 }

  @media (min-width: 850px) {
    .side-header {
      padding-right: 3.5em !important;
    }
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

</style>
