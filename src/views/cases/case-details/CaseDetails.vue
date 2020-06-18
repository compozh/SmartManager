<template>
  <v-dialog v-model="caseDialog"
            persistent
            no-click-animation>

    <div class="d-flex justify-space-between align-center mb-2">
      <div class="d-flex white px-2"
           style="height: 25px; border-radius: 5px;">
        <div class="px-3" style="color: #2D469C;">Smart Manager</div>
        <v-img v-if="activeZone.title"
               src="@/assets/chevron.svg" width="10px"/>
        <div v-if="activeZone.title" class="px-3 success--text">
          {{ activeZone.title }}</div>
        <v-img v-if="activeFolder.Name"
               src="@/assets/chevron.svg" width="10px"/>
        <div v-if="activeFolder.Name" class="px-3 primary--text">
          {{ activeFolder.Name }}
        </div>
      </div>
      <v-btn fab x-small
             depressed
             color="white"
             class="task-close"
             @click="closeCaseDetails">
        <fa-icon icon="times" type="fal"
                 size="2x" color="#979797"/>
      </v-btn>
    </div>

    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white"
           :gutter-size="4"
           :direction="$vuetify.breakpoint.smAndDown ? 'vertical' : 'horizontal'">
      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column justify-center" :size="55">
        <!-- LEFT HEADER -->
        <div class="side-header">
          <!-- TASK PERFORMER -->
<!--          <task-performer v-model="taskData.performer"/>-->
          <!-- TASK DATE PLAN -->
<!--          <task-date-plan v-model="caseData.dateTo"/>-->
          <v-spacer/>
          <!-- TASK SAVE BUTTON -->
<!--          <task-save-btn v-if="taskChanged"-->
<!--                         @save="updateTaskData"-->
<!--                         @cancel="initTaskData"/>-->
          <!-- TASK MANAGEMENT BUTTONS -->
<!--          <task-buttons v-if="!taskChanged"-->
<!--                        class="py-3"-->
<!--                        @changeStage="changeStage"-->
<!--                        @changeStatus="changeStatus"-->
<!--                        @executeExternalTask="executeExternalTask"/>-->
          <!-- TASK MENU - MORE BTN -->
          <!-- TODO: need define task menu btn position-->
          <!--          <task-menu @taskDelete="taskDelete"-->
          <!--                     @changeStatus="changeStatus"/>-->
        </div>
<!--        <v-divider/>-->
        <div class="title text-center">Page in develop... Coming soon!</div>
        <!-- LEFT SCROLL AREA -->
<!--        <perfect-scrollbar class="pa-5">-->
<!--          <div class="d-flex align-baseline">-->
<!--            &lt;!&ndash; TASK NAME &ndash;&gt;-->
<!--            <task-name v-model="taskData.name"/>-->
<!--            &lt;!&ndash; TOGGLE PIN TASK BUTTON &ndash;&gt;-->
<!--            <icon-tooltip-btn btnClass="ml-auto"-->
<!--                              :btnColor="task.isFavorite ? 'cyan' : 'grey'"-->
<!--                              :btnClick="toggleTaskPin"-->
<!--                              icon="star" iconSize="2x"-->
<!--                              :iconType="task.isFavorite ? 'far' : 'fal'"-->
<!--                              tooltipPosition="top">-->
<!--              {{ task.isFavorite ? $t('buttons.unpin') : $t('buttons.pin') }}-->
<!--            </icon-tooltip-btn>-->
<!--          </div>-->
<!--          &lt;!&ndash; TASK DOC CAPTION &ndash;&gt;-->
<!--          <h3 v-if="task.name !== task.docCaption"-->
<!--              class="font-weight-light mb-3">-->
<!--            {{ task.docCaption }}</h3>-->

<!--          &lt;!&ndash; FORMIO &ndash;&gt;-->
<!--          <div v-if="Object.keys(form).length" class="w-full">-->
<!--            <formio-form-component class="formio"-->
<!--                                   ref="form"-->
<!--                                   :formCode="form.UNFORMIO"-->
<!--                                   :formDefinition="formDefinition"/>-->
<!--          </div>-->
<!--          &lt;!&ndash; HTML DESCRIPTION&ndash;&gt;-->
<!--          <task-description v-model="taskData.description"-->
<!--                            :docTextHtml="task.docTextHtml"/>-->
<!--          &lt;!&ndash; LABELS &ndash;&gt;-->
<!--          <task-labels :task="task"/>-->
<!--          <v-divider/>-->
<!--          &lt;!&ndash; TASK PARTICIPANTS &ndash;&gt;-->
<!--          <task-participants v-model="taskData.participants"-->
<!--                             class="mb-10"/>-->
<!--          &lt;!&ndash; TASK ATTACHMENTS &ndash;&gt;-->
<!--          <attachments-list v-if="!externalTaskCamunda || attachments.length"-->
<!--                            class="mb-10" @input="tab = 0"/>-->
<!--          &lt;!&ndash; BASE TASK &ndash;&gt;-->
<!--          <div v-if="baseTask" class="my-5">-->
<!--            <fa-icon icon="sitemap" class="mr-3" size="lg"/>-->
<!--            <span class="font-weight-light">-->
<!--              {{ $t('tasks.base').toUpperCase() }}</span>-->
<!--            <task-cards :tasks="[baseTask]" class="mt-3"-->
<!--                        hide-footer/>-->
<!--          </div>-->
<!--          &lt;!&ndash; PARENT TASKS &ndash;&gt;-->
<!--          <div v-if="task.parentTasks" class="my-5">-->
<!--            <fa-icon icon="sitemap" class="mr-3" size="lg"/>-->
<!--            <span class="font-weight-light">-->
<!--              {{ $t('tasks.parentTasks').toUpperCase() }}</span>-->
<!--            <task-cards :tasks="task.parentTasks" class="mt-3" hide-footer/>-->
<!--          </div>-->
<!--          &lt;!&ndash; SUB TASKS&ndash;&gt;-->
<!--          <div class="my-5">-->
<!--            <div class="d-flex align-center font-weight-light">-->
<!--              <fa-icon icon="folder-tree" class="mr-3" size="lg"/>-->
<!--              <span class="mr-3">-->
<!--                {{ $t('tasks.subTasks').toUpperCase() }}</span>-->
<!--              <task-form #activator="{ on }">-->
<!--                <v-btn v-on="on"-->
<!--                       outlined x-small-->
<!--                       color="primary"-->
<!--                       class="add-btn pa-2">-->
<!--                  {{ $t('buttons.add') }}-->
<!--                </v-btn>-->
<!--              </task-form>-->
<!--            </div>-->
<!--            <task-cards :tasks="childTasks" class="mt-3"-->
<!--                        hide-footer :hide-no-data="true"/>-->
<!--          </div>-->
<!--        </perfect-scrollbar>-->
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
        <perfect-scrollbar class="fill-height">
          <v-tabs-items v-model="tab" class="fill-height">
            <v-tab-item v-for="tab in tabItems"
                        :key="tab.name"
                        class="fill-height">
<!--              <component :is="tab.component"/>-->
            </v-tab-item>
          </v-tabs-items>
        </perfect-scrollbar>
      </SplitArea>
    </Split>
  </v-dialog>
</template>

<script>
import { date } from '@/mixins/dateTime'
import { zones, folders, cases, attachments } from '@/mixins/units'

export default {
  name: 'CaseDetails',
  mixins: [zones, folders, cases, attachments, date],
  data: () => ({
    tab: 0,
    caseData: {
      name: '',
      fioAdded: '',
      dateFrom: '',
      dateTo: '',
      purpose: '',
      note: '',
      participants: []
    }
  }),
  computed: {
    tabItems () {
      const tabs = [
        { name: this.$t('tabs.comments'), component: 'comments', icon: 'comment-alt-dots' }
      ]
      tabs.unshift({ name: this.$t('tabs.attachment'), component: 'attachments-viewer', icon: 'paperclip' })
      return tabs
    }
  },
  watch: {
    '$route' (route) {
      if (route.name === 'case-details') {
        this.getCase()
      }
    }
  },
  async created () {
    await this.getCase()
    this.setCaseEditable(true)
    this.initCaseData()
    // TODO: create caseAttachment computed property
    this.tab = 1 // this.attachments.length ? 0 : 1
  },
  methods: {
    initCaseData () {
      this.caseData.name = this.caseItem.name
      this.caseData.dateFrom = this.caseItem.dateFrom
      this.caseData.dateTo = this.caseItem.dateTo
      this.caseData.fioAdd = this.caseItem.fioAdd
      this.caseData.purpose = this.caseItem.purpose
      this.caseData.participants = this.caseItem.participants || []
      this.setCaseChanged(false)
    },
    closeCaseDetails () {
      this.showCaseDialog(false)
      this.$router.push('/cases/' + this.activeFolder.Code)
    }
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
