<template>
  <div v-if="attachmentList.length || attachmentTypes.length || businessObject">
    <list-header v-model="attachmentsListMode"
                 :businessObject="businessObject"
                 :uploadType.sync="uploadType"/>

    <!-- UPLOAD COMPONENT -->
    <files-upload v-slot="{ files }"
                  upload-auto
                  :inputId="objectId"
                  :uploadHandler="uploadHandler"
                  :uploadType="uploadType">
        <v-simple-table>
          <template>
            <tbody>
            <tr v-for="file in files"
                :key="file.id"
                class="grey--text">
              <td style="width: 30px;">
                <v-progress-circular :size="25" :width="3"
                                     :value="file.progress"
                                     color="primary"
                                     class="caption"/>
              </td>
              <td class="text-truncate" style="max-width: 0;">{{ file.name }}</td>
              <td style="width: 100px;">{{ fileSize(file.size) }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
    </files-upload>

    <!-- Attachment list chips mode-->
    <perfect-scrollbar v-show="attachmentList.length" :options="scrollOptions">
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
        <v-chip v-for="(attachment, idx) in attachmentList"
                :key="idx" small
                class="my-2 text-truncate"
                :class="[`${mr}-2`, { warning: attachment.id === activeAttachment.id }]"
                style="min-width: 100px; max-width: 33%; flex: 1 1 24%"
                @click="selectAttachment(attachment)">
          <fa-icon icon="file-alt" :class="`${mr}-3`" size="lg"/>
          <span class="text-truncate">{{ attachment.fileName }}</span>
        </v-chip>
      </div>

      <!-- Attachment list table mode-->
      <div v-else>
        <v-data-table :headers="headers"
                      :items="attachmentList"
                      item-key="index"
                      show-expand
                      disable-filtering
                      disable-pagination
                      disable-sort
                      hide-default-footer>

          <template #item="{ item: attachment, index, headers, expand, isExpanded }">
            <v-hover #default="{ hover }">
              <tr style="cursor: pointer; width: 100%;"
                  :class="{ 'light-blue lighten-5': attachment.id === activeAttachment.id }"
                  @click="selectAttachment(attachment)">

                <!-- Expand icon for versions view -->
                <td class="px-1">
                  <v-btn icon :loading="versionLoaders.includes(attachment.id)"
                         @click.stop="expandVersions(attachment, expand, isExpanded)">
                    <fa-icon icon="chevron-right" size="xs"
                             style="transition: transform .2s"
                             :style="{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }"/>
                    <template #loader>
                      <span class="custom-loader">
                        <fa-icon icon="sync"/>
                      </span>
                    </template>
                  </v-btn>
                </td>

                <!-- File type icon -->
                <td class="text-center px-0" style="width: 30px;">
                  <file-type-icon :extension="attachment.fileExt"/>
                </td>

                <!-- File name -->
                <td class="text-truncate" style="max-width: 0;">{{ attachment.fileName }}</td>

                <!-- Date file adding -->
                <td class="text-center text-truncate" style="width: 150px;">
                  <span v-if="!hover">{{ toLocalString(attachment.date) }}</span>
                </td>

                <!-- File size -->
                <td class="text-center text-truncate" style="width: 100px;">
                  <span v-if="!hover">{{ fileSize(attachment.fileSize) }}</span>
                </td>

                <!-- Signed file icon -->
                <td class="text-center" style="width: 20px; position: relative">
                  <div v-if="!hover">
                    <fa-icon v-if="isSign(attachment)" color="#FFC107"
                             icon="award" type="fal" fixed-size="20"/>
                    <span v-else>-</span>
                  </div>

                  <!-- Buttons for attachment management -->
                  <attachment-btns v-if="hover" :objectId="objectId"
                                   :access="attachment.access"
                                   :is-sign="isSign(attachment)"
                                   :loading="downLoaders.includes(attachment.id)"
                                   @new-version="newVersion(attachment)"
                                   @download="downloadAttachment(attachment)"
                                   @delete="attachmentDeleteDialog(attachment)"
                                   @sign="sign(attachment)"
                                   @eds="showEds(attachment)"/>
                </td>
              </tr>
            </v-hover>
          </template>

          <!-- Expand slot - version list -->
          <template #expanded-item="{ item: attachment }">
            <tr class="expanded" style="border: 1px solid grey;">
              <td :colspan="headers.length + 1" :class="`${pl}-10 ${pr}-0 pb-5`">
                <version-list :attachment="attachment"></version-list>
              </td>
            </tr>
          </template>

        </v-data-table>
      </div>
    </perfect-scrollbar>

    <!-- Attachment delete confirm dialog -->
    <delete-confirm v-if="deleteConfirmDialog"
                    v-model="deleteConfirmDialog"
                    @confirm="attachmentDelete(deleteParams.attachment)">
      <template #title>{{ $t('attachments.delete') }}</template>
      <template #text>
        <span class="subtitle-2">{{ $t('attachments.delConfirmText') }}</span>
        <br><br>{{ '- ' + deleteParams.fileName }}
      </template>
    </delete-confirm>

    <!-- Eds list-->
    <eds v-if="edsDialog"
         v-model="edsDialog"
         :signatures="attachment.signatures"
         :attachment-params="attachmentParams"
         :details-loading="attachmentDetailsLoading"/>

    <!-- Create eds dialog -->
    <eds-create v-if="edsCreateDialog"
                v-model="edsCreateDialog"
                :attachment="attachmentParams"/>
  </div>
</template>

<script>
import ListHeader from './ListHeader'
import AttachmentBtns from './AttachmentBtns'
import FileTypeIcon from '@/components/FileTypeIcon'
import { common, tasks, cases, attachments } from '@/mixins/units'
import { date } from '@/mixins/dateTime'
import eds from '@/mixins/eds'

const VersionList = () => import('./VersionList')
const Eds = () => import('../attachment-eds/EdsList')
const EdsCreate = () => import('../attachment-eds/eds-create/EdsCreate')
const DeleteConfirm = () => import('@/components/DeleteConfirm')
const FilesUpload = () => import('@/views/attachments/attachment-upload/FilesUpload')

export default {
  name: 'AttachmentsList',
  mixins: [common, tasks, cases, attachments, eds, date],

  props: {
    businessObject: Object,
    attachmentList: Array
  },

  components: {
    Eds,
    ListHeader,
    VersionList,
    AttachmentBtns,
    DeleteConfirm,
    FilesUpload,
    FileTypeIcon,
    EdsCreate
  },

  data: () => ({
    attachmentsListMode: false,
    deleteConfirmDialog: false,
    edsCreateDialog: false,
    deleteDialogType: '',
    deleteParams: {},
    uploadType: 'attachments',
    versionParams: null,
    versionLoaders: [],
    signatures: [],
    attachment: {},
    attachmentParams: {},
    attachmentDetailsLoading: false,
    edsDialog: false,
    downLoaders: [],
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    }
  }),

  computed: {
    headers () {
      return [
        { text: this.$t('table.type'), value: 'type', align: 'center' },
        { text: this.$t('table.name'), value: 'name', align: 'center' },
        { text: this.$t('table.date'), value: 'date', align: 'center' },
        { text: this.$t('table.size'), value: 'size', align: 'center' },
        { text: this.$t('table.sign'), value: 'sign', align: 'center' }
      ]
    },

    uploadHandler () {
      let handler = () => {}
      if (this.uploadType === 'attachments') {
        handler = attachment => this.addAttachments(attachment, this.businessObject)
      }
      if (this.uploadType === 'version') {
        handler = ({ filePath }) => {
          const attachment = this.versionParams.attachment
          this.addVersion(attachment, filePath, this.businessObject)
        }
      }
      return handler
    },

    isSign: () => attachment => attachment.isSign || !!attachment?.signatures?.length
  },

  created () {
    this.getAttachmentTypes(this.businessObject)
  },

  methods: {
    async selectAttachment (attachment, version) {
      await this.setActiveAttachment(attachment, version)
      this.$emit('selectAttachment')
    },

    async expandVersions (attachment, expand, isExpanded) {
      this.versionLoaders.push(attachment.id)
      if (attachment.hasDetails || isExpanded) {
        expand(!isExpanded)
      } else {
        const result = await this.getAttachmentDetails(attachment)
        !result.success || expand(!isExpanded)
      }
      this.versionLoaders = this.versionLoaders.filter(i => i !== attachment.id)
    },

    newVersion (attachment) {
      this.uploadType = 'version'
      this.versionParams = { attachment }
    },

    async downloadAttachment (attachment) {
      this.downLoaders.push(attachment.id)
      attachment.srcUrl || await this.getAttachmentDetails(attachment)
      window.open(attachment.srcUrl, '_self')
      this.downLoaders = this.downLoaders.filter(i => i !== attachment.id)
    },

    attachmentDeleteDialog (attachment) {
      this.deleteConfirmDialog = true
      this.deleteParams.attachment = attachment
      this.deleteParams.fileName = attachment.fileName
    },

    async sign (attachment) {
      if (!this.privateKeyIsSaved) {
        this.edsCreateDialog = true
        await this.getAttachmentParams(attachment)
        return
      }
      await this.getAttachmentParams(attachment)
      this.$store.commit('START_PRELOADER', 'signAttachment')
      try {
        await this.getSign(attachment.url)
        await this.signAttachment(this.attachmentParams)
      } catch (e) {
        this.resetPrivateKey()
        this.error = e
      }
      this.$store.commit('STOP_PRELOADER', 'signAttachment')
    },

    async showEds (attachment) {
      this.edsDialog = true
      await this.getAttachmentParams(attachment)
    },

    async getAttachmentParams (attachment) {
      this.attachment = attachment
      // Load attachment details if it needed
      if (!attachment.hasDetails) {
        this.attachmentDetailsLoading = true
        await this.getAttachmentDetails(attachment)
        this.attachmentDetailsLoading = false
      }
      this.attachmentParams = {
        loading: false,
        isVersion: false,
        fileId: attachment.id,
        fileUrl: attachment.url,
        fileSize: attachment.fileSize,
        fileExt: attachment.fileExt
      }
    }
  }
}
</script>

<style scoped>

  .v-data-table >>> th:nth-child(2) {
    padding-left: 0;
    padding-right: 0;
  }

  tr {
    transition: background .5s;
  }

  tr.expanded:hover {
    background: none !important;
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  #addBtn >>> .v-btn__content {
    border-radius: 50%;
    overflow: hidden;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

</style>
