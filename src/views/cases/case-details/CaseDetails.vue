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
             class="case-close"
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
      <SplitArea class="d-flex flex-column" :size="55">
        <!-- LEFT HEADER -->
        <div class="side-header">
          <!-- CASE CREATOR -->
          <case-creator :userId="caseItem.userAdd"/>
          <!-- CASE DATES -->
          <div class="d-flex flex-wrap">
            <case-date v-model="caseData.dateFrom" :title="$t('cases.dateStart')"/>
            <case-date v-model="caseData.dateTo" :title="$t('cases.dateEnd')"/>
          </div>
          <v-spacer/>
          <!-- CASE SAVE BUTTON -->
          <save-button v-if="caseChanged"
                         @save="updateCaseData"
                         @cancel="initCaseData"/>
        </div>
        <v-divider/>
        <!-- LEFT SCROLL AREA -->
        <perfect-scrollbar class="pa-5">
          <div class="d-flex align-baseline">
            <!-- CASE NAME -->
            <editable-text-field v-model="caseData.name"
                                 required
                                 :editable="caseEditable"
                                 :changed="caseChanged"
                                 :changeHandler="setCaseChanged"
                                 class="title font-weight-bold"/>
          </div>
          <!-- CASE PURPOSE -->
          <editable-text-field v-model="caseData.purpose"
                               outlined
                               :editable="caseEditable"
                               :changed="caseChanged"
                               :placeholder="$t('cases.purpose')"
                               :changeHandler="setCaseChanged"/>
          <!-- CASE COMMENT-->
          <editable-text-field v-model="caseData.comment"
                               outlined
                               :editable="caseEditable"
                               :changed="caseChanged"
                               :placeholder="$t('cases.comment')"
                               :changeHandler="setCaseChanged"/>
          <!-- LABELS
          <case-labels :case="caseItem"/> -->
          <v-divider/>
          <!-- CASE PARTICIPANTS
          <task-participants v-model="caseData.participants"
                             class="mb-10"/> -->
          <!-- CASE ATTACHMENTS -->
          <attachments-list class="mb-10"
                            :attachmentList="attachments"
                            @selectAttachment="tab = 0"/>
          <!-- RELATIVE TASKS-->
          <div class="my-5">
            <div class="d-flex align-center font-weight-light">
              <fa-icon icon="link" class="mr-3" size="lg"/>
              <span class="mr-3">
                {{ $t('cases.relatedTasks').toUpperCase() }}</span>
              <task-form #activator="{ on }">
                <v-btn v-on="on"
                       outlined x-small
                       color="primary"
                       class="add-btn pa-2">
                  {{ $t('buttons.add') }}
                </v-btn>
              </task-form>
            </div>
            <task-cards :tasks="relatedTasks" class="mt-3"
                        hide-footer :hide-no-data="true"/>
          </div>
        </perfect-scrollbar>
      </SplitArea>
      <!-- RIGHT CONTENT AREA -->
      <SplitArea class="d-flex flex-column" :size="45">
        <v-tabs v-model="tab" grow
                height="75px" class="flex-grow-0">
          <v-tab v-for="(tab, idx) in visibleTabs" :key="idx">
            <fa-icon :icon="tab.icon" class="mr-3" size="lg"/>
            {{ tab.name }}
          </v-tab>
        </v-tabs>
        <v-divider/>
        <perfect-scrollbar class="fill-height">
          <v-tabs-items v-model="tab" class="fill-height">
            <v-tab-item v-for="(tab, idx) in visibleTabs"
                        :key="idx" class="fill-height">
              <component :is="tab.component"/>
            </v-tab-item>
          </v-tabs-items>
        </perfect-scrollbar>
      </SplitArea>
    </Split>
  </v-dialog>
</template>

<script>
import SaveButton from '@/components/SaveButton'
import EditableTextField from '@/components/EditableTextField'
import CaseCreator from '@/views/cases/case-details/CaseCreator'
import TaskForm from '@/views/tasks/task-create/TaskForm'
import TaskCards from '@/views/tasks/task-list/TaskCards'
import AttachmentsList from '@/views/attachments/attachments-list/AttachmentsList'
import AttachmentsViewer from '@/views/attachments/attachments-viewers/AttachmentsViewer'
import Comments from '@/views/comments/Comments'
import CaseDate from '@/views/cases/case-edit/CaseDate'
import { date } from '@/mixins/dateTime'
import { zones, folders, cases, attachments } from '@/mixins/units'

export default {
  name: 'CaseDetails',
  mixins: [zones, folders, cases, attachments, date],
  components: {
    SaveButton,
    EditableTextField,
    CaseCreator,
    TaskForm,
    TaskCards,
    CaseDate,
    AttachmentsList,
    AttachmentsViewer,
    Comments
  },
  data: () => ({
    tab: 0,
    caseData: {
      name: '',
      dateFrom: '',
      dateTo: '',
      fioAdded: '',
      purpose: '',
      comment: '',
      folder: {},
      participants: []
    }
  }),
  computed: {
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
        }
      ]
    },
    relatedTasks () {
      return this.caseItem.tasks && this.caseItem.tasks.length
        ? this.caseItem.tasks
        : []
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
    this.tab = this.attachments.length ? 0 : 1
  },
  beforeDestroy () {
    this.setCaseChanged(false)
    this.resetAttachmentData()
  },
  methods: {
    initCaseData () {
      this.caseData.name = this.caseItem.name
      this.caseData.dateFrom = this.caseItem.dateFrom
      this.caseData.dateTo = this.caseItem.dateTo
      this.caseData.fioAdd = this.caseItem.fioAdd
      this.caseData.purpose = this.caseItem.purpose
      this.caseData.comment = this.caseItem.comm
      this.caseData.folder = this.caseFolders.find(folder => {
        return folder.id === this.caseItem.folderId
      })
      this.caseData.participants = this.caseItem.participants || []
      this.setCaseChanged(false)
    },
    closeCaseDetails () {
      this.showCaseDialog(false)
      this.$router.push('/cases/' + this.activeFolder.Code)
    },
    async updateCaseData () {
      this.setCaseChanged(false)
      const caseData = {
        id: this.caseId,
        name: this.caseData.name,
        dateFrom: this.formatDateTime(this.caseData.dateFrom),
        dateTo: this.formatDateTime(this.caseData.dateTo),
        purpose: this.caseData.purpose,
        comm: this.caseData.comment,
        folderId: this.caseData.folder ? this.newCase.folder.folderId : 0,
        participants: this.caseData.participants
      }
      const result = await this.$store.dispatch('updateCase', caseData)
      if (!result.success) {
        this.initCaseData()
      }
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

  .case-close:hover {
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

  /*.v-input >>> .v-input__slot,*/
  /*.v-input >>> .v-text-field__details {*/
  /*  padding: 0 !important;*/
  /*}*/

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
