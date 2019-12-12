<template>
  <div class="app-fixed-height border border-solid rounded
              d-theme-border-grey-light relative overflow-hidden">
    <VuePerfectScrollbar class="scroll-area" :settings="settings">
      <div class="vx-row form-container">
        <div class="vx-col w-full h-full">
          <vx-card>
            <div class="vx-row">
              <div class="vx-col w-full">
                <!-- ADD CASE -->
                <form @submit.prevent>
                  <vs-input name="caseName"
                            :label-placeholder="$t('cases.name')"
                            v-model="newCase.name"
                            class="w-full mb-6 input-task-name"
                            v-validate="'required'"
                            :danger="errors.has('caseName')"
                            :danger-text="$t('validate.required')"
                            val-icon-danger="clear"/>

                  <div class="flex mb-8">
                    <div class="flex items-center">
                      <span>{{ $t('cases.dateStart') }}:</span>
                      <div class="date-wrapper mx-8">
                        <flat-pickr :config="configDatePicker"
                                    v-model="newCase.dateFrom"
                                    name="dateFrom"/>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <span>{{ $t('cases.dateEnd') }}:</span>
                      <div class="date-wrapper mx-8">
                        <flat-pickr :config="configDatePicker"
                                    v-model="newCase.dateTo"
                                    name="dateFrom"/>
                      </div>
                    </div>
                  </div>
                  <vs-input name="casePurpose"
                            :label-placeholder="$t('cases.purpose')"
                            v-model="newCase.purpose"
                            class="w-full mb-6 input-task-name"/>
                  <vs-input name="caseComm"
                            :label-placeholder="$t('cases.comm')"
                            v-model="newCase.comm"
                            class="w-full mb-6 input-task-name"/>
                  <div class="flex">
                    <autocomplete class="flex-1 mr-6"
                                  :items="folders"
                                  :multiple="false"
                                  label="name"
                                  v-model="newCase.folder"
                                  :placeholder="$t('folders.folder')"
                                  icon="FolderIcon"/>
                    <vs-button color="primary"
                               type="border"
                               icon="create_new_folder"
                               @click="activePrompt = true"
                    >{{ $t('buttons.addFolder') }}</vs-button>
                  </div>
                  <autocomplete :items="users"
                                :multiple="true"
                                :loading="userListLoading"
                                :disabled="userListLoading"
                                label="fio"
                                v-model="newCase.members"
                                :placeholder="$t('cases.members')"
                                class="my-6"
                                avatar/>
                  <files-upload @attach="getAttachment($event)"
                                :existingFiles="existingFiles"
                                :uploading="filesUploading"
                                class="mt-4"/>
                  <vs-divider/>
                  <div class="flex justify-end">
                    <vs-button class="mx-6"
                               color="primary"
                               type="flat"
                               @click="$router.go(-1)"
                    >{{ $t('buttons.cancel') }}</vs-button>
                    <vs-button type="gradient"
                               @click="submitForm"
                    >{{ caseEdit ? $t('buttons.save') : $t('buttons.create') }}</vs-button>
                  </div>
                </form>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </VuePerfectScrollbar>
    <vs-prompt :title="$t('folders.createFolder')"
               @cancel="newFolderName=''"
               @accept="createFolder(newFolderName)"
               :active.sync="activePrompt"
               :acceptText="$t('buttons.create')"
               :cancelText="$t('buttons.cancel')">
      <div>
        <span>{{ $t('folders.placeholderNew') }}</span>
        <vs-input :placeholder="$t('folders.placeholderCreate')"
                  v-model="newFolderName"
                  class="mt-3 w-full"/>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import Autocomplete from '@/components/Autocomplete'
import FilesUpload from '@/components/FilesUpload'
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
// eslint-disable-next-line no-unused-vars
import {Russian} from 'flatpickr/dist/l10n/ru.js'
// eslint-disable-next-line no-unused-vars
import {Ukrainian} from 'flatpickr/dist/l10n/uk.js'

export default {
  components: {
    VuePerfectScrollbar,
    Autocomplete,
    flatPickr,
    FilesUpload
  },
  data() {
    return {
      caseEdit: false,
      newCase: {
        name: '',
        dateFrom: moment().format('DD.MM.YYYY'),
        dateTo: moment().add(1, 'days').format('DD.MM.YYYY'),
        purpose: '',
        comm: '',
        folder: [],
        members: [],
        attachments: []
      },
      configDatePicker: {
        locale: this.$i18n.locale,
        dateFormat: 'd.m.Y',
        minDate: moment().format('DD.MM.YYYY'),
        allowInput: true
      },
      userListLoading: false,
      filesUploading: false,
      activePrompt: false,
      newFolderName: '',
      oldAttachments: [],
      oldMembers: [],
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.30,
      }
    }
  },
  computed: {
    users() {
      return this.$store.state.sm.users
    },
    folders() {
      const allFolders = this.$store.state.sm.folders || []
      return allFolders.filter(i => !!i.folderId)
    },
    folderById() {
      return id => this.folders.filter(i => i.folderId === id)
    },
    members() {
      const oldMembers = this.oldMembers
      const newMembers = this.newCase.members
      const add = newMembers.filter(newMember => oldMembers
        .every(oldMember => oldMember.userId !== newMember.userId))
      const del = oldMembers.filter(oldMember => newMembers
        .every(newMember => newMember.userId !== oldMember.userId))
      return {
        addMembers: add.map(member => ({ID: member.userId, TYPE: 'USER'})),
        deleteMembers: del.map(member => ({ID: member.userId, TYPE: 'USER'})),
      }
    },
    dateClient() {
      return date => moment(date, 'DD.MM.YYYY')
    },
    dateServer() {
      return date => {
        if (date) {
          return moment(date,'DD.MM.YYYY').format('YYYY-MM-DD')
        }
        return '0001-01-01'
      }
    },
    existingFiles() {
      return this.oldAttachments.map(attachment => ({
        id: attachment.id,
        size: attachment.fileSize,
        name: attachment.fileName,
        progress: '100.0',
        success: true,
        existing: true
      }))
    }
  },
  beforeRouteEnter(to, from, next) {
    const folderId = from.params.id
    next(vm => {
      if (from.name === 'case-list' && folderId !== 'ALL') {
        vm.newCase.folder = vm.folderById(+folderId)
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    // TODO: Add confirm for saving
    next()
  },
  async mounted() {
    this.getUsers()
    if (this.$route.name === 'case-edit') {
      this.caseEdit = true
      const caseItem = await this.getCase()
      this.setFieldsForUpdate(caseItem)
    }
  },
  methods: {
    async getCase() {
      const caseId = +this.$route.params.id
      await this.$store.dispatch('sm/getCaseDetails', {
        caseId, loading: true
      })
      return this.$store.state.sm.caseDetails[caseId]
    },
    setFieldsForUpdate(caseItem) {
      if (this.dateServer(caseItem.dateFrom) !== '0001-01-01') {
        const date = caseItem.dateFrom
        const minDate = this.configDatePicker.minDate
        this.configDatePicker.minDate = this.dateClient(minDate)
          .isAfter(this.dateClient(date)) ? date : minDate
      }
      this.newCase.name = caseItem.name
      this.newCase.dateFrom = caseItem.dateFrom
      this.newCase.dateTo = caseItem.dateTo
      this.newCase.purpose = caseItem.purpose
      this.newCase.comm = caseItem.comm
      this.newCase.folder = this.folderById(caseItem.folderId)
      this.oldMembers = this.users.filter(user => caseItem.participants
        .some(member => member.userId === user.userId))
      this.newCase.members = this.oldMembers
      this.oldAttachments = caseItem.originals
    },
    async getUsers() {
      this.userListLoading = true
      const users = this.$store.state.sm.users
      if (users.length === 0) {
        await this.$store.dispatch('sm/getUsers')
      }
      this.userListLoading = false
    },
    async createFolder() {
      await this.$store.dispatch('sm/caseFolderCreate', this.newFolderName)
      this.activePrompt = false
      this.newFolderName = ''
    },
    async submitForm() {
      const result = await this.$validator.validateAll()
      if (result) {
        this.upload()
      }
    },
    upload() {
      this.filesUploading = true
    },
    getAttachment(event) {
      this.newCase.attachments = event
      this.filesUploading = false
      this.caseEdit ? this.caseUpdate() : this.createCase()
    },
    async createCase() {
      const newCase = {
        name: this.newCase.name,
        dateFrom: this.dateServer(this.newCase.dateFrom),
        dateTo: this.dateServer(this.newCase.dateTo),
        purpose: this.newCase.purpose,
        comm: this.newCase.comm,
        folderId: this.newCase.folder.folderId || 0,
        members: this.members,
        attachments: this.newCase.attachments
      }
      try {
        const newCaseId = await this.$store.dispatch('sm/caseCreate', newCase)
        await this.$router.push({name: 'case-view', params: {id: newCaseId}})
      } catch (e) {
        setTimeout(() => this.$router.go(0), 1000)
      }
    },
    async caseUpdate() {
      const newCaseData = {
        id: this.$route.params.id,
        name: this.newCase.name,
        dateFrom: this.dateServer(this.newCase.dateFrom),
        dateTo: this.dateServer(this.newCase.dateTo),
        purpose: this.newCase.purpose,
        comm: this.newCase.comm,
        folderId: this.newCase.folder ? this.newCase.folder.folderId : 0,
        members: this.members,
        attachments: this.newCase.attachments
      }
      const result = await this.$store.dispatch('sm/caseUpdate', newCaseData)
      if (result) {
        await this.$router.push({name: 'case-view', params: {id: newCaseData.id}})
      }
    }
  }
}
</script>

<style scoped>

  * >>> input {
    font-family: "Montserrat", Helvetica, Arial, sans-serif !important;
  }

  .form-container {
    margin: 15px 0;
  }

  .vs-upload >>> .con-img-upload {
    margin: 0;
    padding: 0;
  }

  .vs-upload >>> .con-input-upload {
    width: 99%;
    height: 2.5rem;
    margin: 1.1rem auto 0 auto;
    float: none;
  }

  .date-wrapper,
  .time-wrapper {
    position: relative;
  }

  .date-wrapper .required-text,
  .time-wrapper .required-text {
    position: absolute;
    top: 100%;
  }

  .required-text {
    color: rgba(var(--vs-danger),1)!important;
    position: relative;
    font-size: .65rem;
    overflow: hidden;
    transition: all .25s ease;
    padding: 2px 4px 4px 4px;
    display: block;
  }
</style>
