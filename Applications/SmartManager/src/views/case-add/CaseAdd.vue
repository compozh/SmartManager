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
                      <span ref="dateFieldFrom">{{ $t('cases.dateStart') }}:</span>
                      <div class="date-wrapper mx-8">
                        <flat-pickr :config="configDatePicker"
                                    v-model="newCase.dateFrom"
                                    name="dateFrom"
                                    v-validate="'required'"/>
                        <span v-if="errors.has('dateFrom')"
                              class="required-text"
                        >{{ $t('validate.required') }}</span>
                      </div>
                    </div>

                    <div class="flex items-center ml-16">
                      <span ref="timeFieldFrom">{{ $t('pickers.time') }}:</span>
                      <div class="time-wrapper ml-8">
                        <flat-pickr :config="configTimePicker"
                                    v-model="newCase.timeFrom"
                                    name="timeFrom"
                                    v-validate="'required'"/>
                        <span v-if="errors.has('timeFrom')"
                              class="required-text"
                        >{{ $t('validate.required') }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex mb-8">
                    <div class="flex items-center">
                      <span ref="dateFieldTo">{{ $t('cases.dateEnd') }}:</span>
                      <div class="date-wrapper mx-8">
                        <flat-pickr :config="configDatePicker"
                                    v-model="newCase.dateTo"
                                    name="dateFrom"
                                    v-validate="'required'"/>
                        <span v-if="errors.has('dateTo')"
                              class="required-text"
                        >{{ $t('validate.required') }}</span>
                      </div>
                    </div>

                    <div class="flex items-center ml-16">
                      <span ref="timeFieldTo">{{ $t('pickers.time') }}:</span>
                      <div class="time-wrapper ml-8">
                        <flat-pickr :config="configTimePicker"
                                    v-model="newCase.timeTo"
                                    name="timeFrom"
                                    v-validate="'required'"/>
                        <span v-if="errors.has('timeTo')"
                              class="required-text"
                        >{{ $t('validate.required') }}</span>
                      </div>
                    </div>
                  </div>

                  <vs-input name="casePurpose"
                            :label-placeholder="$t('cases.purpose')"
                            v-model="newCase.purpose"
                            class="w-full mb-6 input-task-name"
                            v-validate="'required'"
                            :danger="errors.has('casePurpose')"
                            :danger-text="$t('validate.required')"
                            val-icon-danger="clear"/>
                  <vs-input name="caseComm"
                            :label-placeholder="$t('cases.comm')"
                            v-model="newCase.comm"
                            class="w-full mb-6 input-task-name"
                            val-icon-danger="clear"/>
                  <autocomplete :items="folders"
                                :multiple="false"
                                label="name"
                                v-model="newCase.folder"
                                :placeholder="$t('folders.folder')"
                                icon="FolderIcon"/>
                  <vs-button type="line"
                             @click="activePrompt = true"
                  >&#128193; {{ $t('buttons.addFolder') }}</vs-button>
                  <autocomplete :items="users"
                                :multiple="true"
                                :loading="userListLoading"
                                label="fio"
                                v-model="newCase.members"
                                :placeholder="$t('cases.members')"
                                class="my-6"
                                avatar/>
                  <files-upload @attach="getAttachment($event)"
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
                    >{{ $t('buttons.create') }}</vs-button>
                  </div>
                </form>
              </div>
            </div>
          </vx-card>
        </div>
      </div>
    </VuePerfectScrollbar>
    <vs-prompt
      :title="$t('folders.createFolder')"
      @cancel="newFolderName=''"
      @accept="createFolder(newFolderName)"
      :active.sync="activePrompt"
      :acceptText="$t('buttons.create')"
      :cancelText="$t('buttons.cancel')"
    >
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
      newCase: {
        name: '',
        // TODO: Начальную дату и время изменить на текущие
        dateFrom: moment().add(1, 'days').format('DD.MM.YYYY'),
        timeFrom: '12:00',
        dateTo: moment().add(1, 'days').format('DD.MM.YYYY'),
        timeTo: '12:00',
        purpose: null,
        comm: null,
        folder: [],
        members: [],
        attachments: []
      },
      configDatePicker: {
        locale: this.$i18n.locale,
        dateFormat: 'd.m.Y',
        minDate: new Date(),
        allowInput: true
      },
      configTimePicker: {
        enableTime: true,
        noCalendar: true,
        time_24hr: true,
        allowInput: true
      },
      userListLoading: false,
      filesUploading: false,
      activePrompt: false,
      newFolderName: '',
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
      return allFolders.filter(folder => !!folder.folderId)
    },
    dateFormat() {
      return postfix => {
        const formatDate = moment(this.newCase[`date${postfix}`], 'DD.MM.YYYY')
          .format('YYYY-MM-DD')
        return `${formatDate} ${this.newCase[`time${postfix}`]}`
      }
    },
    members() {
      const members = this.newCase.members
      return {
        addMembers: members.map(member => ({ID: member.userId, TYPE: 'USER'})),
        deleteMembers: []
      }
    }
  },
  mounted() {
    this.getUsers()
    this.dateFieldWidth()
  },
  methods: {
    dateFieldWidth() {
      // TODO: Добавить такой же расчет для времени
      const dateFrom = this.$refs.dateFieldFrom
      const dateTo = this.$refs.dateFieldTo
      const fromWidth = dateFrom.clientWidth
      const toWidth = dateTo.clientWidth
      const width = (fromWidth < toWidth ? toWidth : fromWidth) + 'px'
      dateFrom.style.width = dateTo.style.width = width
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
      try {
        await this.$store.dispatch('sm/caseFolderCreate', this.newFolderName)
        this.activePrompt = false
        this.newFolderName = ''
      } catch (e) {
        console.log('', e.message)
      }
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
      this.createCase()
    },
    async createCase() {
      const newCase = {
        name: this.newCase.name,
        dateFrom: this.dateFormat('From'),
        dateTo: this.dateFormat('To'),
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
    }
  }
}
</script>

<style scoped>

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
