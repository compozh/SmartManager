<template>
    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white">
      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column" :size="55">
        <!-- LEFT HEADER -->
        <div class="side-header px-5 d-flex flex-wrap">
          <div v-show="task.performer"
               class="d-flex align-center py-3">
            <v-avatar color="grey lighten-1"
                      class="mr-3" size="40px">
              <fa-icon v-if="!task.performerPhoto" icon="user" inverse/>
              <v-img v-else :src="task.performerPhoto"/>
            </v-avatar>
            <div class="d-flex flex-column">
              <span class="overline">{{ $t('tasks.performer') }}:</span>
              <span class="body-2 indigo--text" style="flex: 0;">{{ task.performer }}</span>
            </div>
          </div>

          <div class="d-flex align-center mx-5 py-3">
            <v-divider vertical class="mr-5"></v-divider>
            <div class="d-flex flex-column"
                 style="white-space: nowrap">
              <div class="overline">
                <fa-icon icon="clock"
                         class="text--secondary mr-1" size="lg"/>
                {{ $t('tasks.deadline') }}:</div>
              <div class="caption red--text text--darken-4">{{ task.dateplan }}</div>
            </div>
          </div>

          <v-spacer></v-spacer>
          <!-- TASK MENU - MORE BTN -->
          <task-menu @taskDelete="taskDelete"/>
          <!-- TASK MANAGEMENT BUTTONS -->
          <task-buttons class="py-3"
                        @changeStage="changeStage"
                        @changeStatus="changeStatus"
                        @executeExternalTask="executeExternalTask"/>
        </div>
        <!-- LEFT SCROLL AREA -->
        <perfect-scrollbar class="pa-5">
          <div class="d-flex align-baseline">
            <h3 v-if="task.name" class="mb-3">
              {{ task.name }}
            </h3>
            <!-- TOGGLE PIN TASK BUTTON -->
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on"
                       class="ml-auto"
                       :color="task.isFavorite ? 'cyan' : 'grey'"
                       text fab small dark depressed
                       @click="toggleTaskPin">
                  <fa-icon icon="star" :type="task.isFavorite ? 'far' : 'fal'" size="2x"/>
                </v-btn>
              </template>
              <span>
                {{ task.isFavorite ? $t('buttons.unpin') : $t('buttons.pin') }}
              </span>
            </v-tooltip>
          </div>
          <h3 v-if="task.name !== task.docCaption" class="font-weight-light mb-3">
            {{ task.docCaption }}
          </h3>
          <div class="d-flex mb-3">
            <div v-if="task.priority" class="deep-orange--text">
              <fa-icon icon="exclamation-square" class="mr-2"/>
              <span class="caption">{{ $t('icons.priority') }}</span>
            </div>
            <v-divider v-if="task.priority" vertical class="mx-2"/>
            <div v-if="task.myControl" class="red--text text--darken-4">
              <fa-icon icon="eye" class="mr-2"/>
              <span class="caption">{{ $t('icons.control') }}</span>
            </div>
          </div>

          <!-- FORMIO -->
          <div v-if="Object.keys(form).length" class="w-full">
            <h3 v-if="form.NAME" class="font-weight-light mt-4">{{ form.NAME }}</h3>

            <formio-form-component class="formio"
                                   ref="form"
                                   :formCode="form.FORMCODE"
                                   :formDefinition="formDefinition"/>
          </div>

          <!-- HTML DESCRIPTION-->
          <div v-if="htmlDescription" class="border-light mb-5">
            <iframe seamless
                    scrolling="no"
                    width="100%"
                    :height="iFrameHeight1"
                    frameborder="0"
                    :srcdoc="htmlDescription"
                    @load="iFrameOnLoad(1, $event)"
                    style="pointer-events: none"/>
          </div>
          <div v-if="docTextHtml" class="border-light mb-5">
            <iframe seamless
                    scrolling="no"
                    width="100%"
                    :height="iFrameHeight2"
                    frameborder="0"
                    :srcdoc="docTextHtml"
                    @load="iFrameOnLoad(2, $event)"
                    style="pointer-events: none"/>
          </div>
          <p v-if="task.name !== task.descript" class="mb-5">{{ task.descript }}</p>
          <!-- PROGRESS-->
          <div class="d-flex mb-5 align-center">
            <v-chip small color="blue-grey"
                    label text-color="white">
              <fa-icon icon="hurricane" class="mr-3"/>
              {{ typeName }}
            </v-chip>
            <v-divider vertical class="mx-2"></v-divider>
            <v-chip small :color="taskStatus().color"
                    label text-color="white">
              <fa-icon :icon="taskStatus().icon" class="mr-3"/>
              {{ taskStatus().text }}
            </v-chip>
          </div>
          <v-divider></v-divider>
          <!-- TASK PARTICIPANTS -->
          <div v-if="participants.length" class="d-flex justify-space-between my-5">
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
          <div class="my-5">
            <fa-icon icon="paperclip" class="mr-3" size="lg"/>
            <span>{{ $t('tabs.attachments').toUpperCase() }}</span>
            <div class="py-2 d-flex flex-wrap">
              <v-chip v-for="item in task.originals"
                      :key="item.id" small
                      class="my-2 mr-2 text-truncate"
                      :class="{ warning: item.id === activeAttachment.id }"
                      style="min-width: 100px; max-width: 200px; flex: 1 1 20%"
                      @click="selectAttachment(item)">
                <fa-icon icon="file-alt" class="mr-3" size="lg"/>
                <span class="text-truncate">{{ item.fileName }}</span>
              </v-chip>
            </div>
          </div>
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
import DataIterator from '@/views/tasks/task-list/DataIterator'
import Attachments from '@/views/attachments/Attachments'
import Comments from '@/views/comments/Comments'
import TaskMenu from '@/views/tasks/task-details/TaskMenu'
import TaskButtons from '@/views/tasks/task-details/TaskButtons'
import { folders, tasks, attachments } from '@/mixins/units'

export default {
  name: 'TaskDetails',
  components: {
    DataIterator,
    Attachments,
    Comments,
    TaskMenu,
    TaskButtons
  },
  mixins: [folders, tasks, attachments],
  data: () => ({
    tab: 0,
    iFrameHeight1: 250,
    iFrameHeight2: 250
  }),
  computed: {
    externalParams () {
      return this.task.externalParams
        ? JSON.parse(this.task.externalParams)
        : {}
    },
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
        properties: JSON.stringify({ taskId: this.taskId })
      }
    },
    docTextHtml () {
      return this.parseDescription(this.task.docTextHtml)
    },
    htmlDescription () {
      return this.parseDescription(this.task.htmlDescript)
    },
    parseDescription () {
      return description => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(description, 'text/html')
        const body = doc.body.innerHTML.trim()
        return body ? description : body
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
    taskType () {
      return this.task ? this.task.taskType : null
    },
    typeName () {
      switch (this.taskType) {
        case '':
          return 'обычная задача/документ'
        case 'AGREE':
          return 'согласование'
        case 'WORKFLOW':
          return 'выполнение БП'
        case 'EXTERNAL':
          return 'внешняя задача'
        default:
          return 'unknown type'
      }
    },
    tabItems () {
      return [
        { name: this.$t('tabs.attachments'), component: 'attachments', icon: 'paperclip' },
        { name: this.$t('tabs.comments'), component: 'comments', icon: 'comment-alt-dots' }
      ]
    },
    taskStatus () {
      return () => {
        switch (this.task.status) {
          case '-':
            return {
              color: 'error',
              icon: 'exclamation-circle',
              text: this.$t('statuses.rejected')
            }
          case '+':
            return {
              color: 'success',
              icon: 'check-circle',
              text: this.$t('statuses.done')
            }
          case '#':
            return {
              color: 'yellow darken-2',
              icon: 'file-search',
              text: this.$t('statuses.review')
            }
          default:
            return {
              color: 'primary',
              icon: 'recycle',
              text: this.$t('statuses.inWork')
            }
        }
      }
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
  async created () {
    await this.getTask()
    this.tab = this.attachments.length ? 0 : 1
    this.task.isRead || this.getFolders()
  },
  methods: {
    iFrameOnLoad (frame, event) {
      const iFrameBody = event.path[0].contentDocument.body
      this['iFrameHeight' + frame] = Math.round(iFrameBody.scrollHeight * 1.2)
      iFrameBody.style.fontFamily = 'Roboto, sans-serif'
    },
    async formSubmit () {
      if (this.$refs.form) {
        const form = this.$refs.form
        const taskId = this.taskId
        try {
          const result = await form.submit({ taskId })
          if (result && result.success) {
            return result
          } else {
            this.$store.commit('SET_NOTIFY', {
              text: result.errorMessage || 'Form submit fail',
              color: 'warning'
            })
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
    selectAttachment (attachment) {
      this.setActiveAttachment(attachment)
      this.tab = 0
    }
  },
  beforeDestroy () {
    this.resetAttachmentData()
  }
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

 .side-header {
   position: relative;
   display: flex;
   align-items: center;
   min-height: 75px;
   border-bottom: 1px solid #e5e5e5;
 }

  @media (min-width: 850px) {
    .side-header {
      padding-right: 3.5em !important;
    }
  }

</style>
