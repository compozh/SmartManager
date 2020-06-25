<template>
  <div>
    <list-header v-model="attachmentsListMode"
                 :uploadType.sync="uploadType"/>

    <!-- UPLOAD COMPONENT -->
    <files-upload v-slot="{ files }"
                  upload-auto
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

    <perfect-scrollbar v-show="attachments.length">
<!--                       style="max-height: 300px;"-->
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
        <v-chip v-for="attachment in attachments"
                :key="attachment.id" small
                class="my-2 mr-2 text-truncate"
                :class="{ warning: attachment.id === activeAttachment.id }"
                style="min-width: 100px; max-width: 33%; flex: 1 1 24%"
                @click="selectAttachment(attachment)">
          <fa-icon icon="file-alt" class="mr-3" size="lg"/>
          <span class="text-truncate">{{ attachment.fileName }}</span>
        </v-chip>
      </div>
      <div v-else>
        <v-data-table
          :headers="headers"
          :items="attachments"
          item-key="id"
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
                <td class="px-1">
                  <v-btn icon :loading="attachment.loading"
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
                <td class="text-center px-0"
                    style="width: 30px;">
                  <file-type-icon :extension="attachment.fileExt"/>
                </td>
                <td class="text-truncate"
                    style="max-width: 0;">{{ attachment.fileName }}</td>
                <td :class="hover ? 'text-right' : 'text-center text-truncate'"
                    style="width: 150px; max-width: 120px;">
                  <span v-if="!hover">{{ attachment.date }}</span>
                  <v-tooltip v-if="hover" top>
                    <template #activator="{ on }">
                      <v-btn v-on="on"
                             id="addBtn"
                             @click.stop="newVersion(attachment.id, attachment.fileExt)"
                             color="grey"
                             class="mr-8"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <label for="file"
                               class="add-label pa-2">
                          <fa-icon icon="files-medical" type="fal" size="2x"/>
                        </label>
                      </v-btn>
                    </template>
                    <span>{{ 'Add version' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                  <v-tooltip v-if="hover" top>
                    <template #activator="{ on }">
                      <v-btn v-on="on"
                             :href="attachment.srcUrl"
                             :loading="attachment.downloading"
                             @click.stop="downloadAttachment(attachment)"
                             color="grey"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <fa-icon icon="arrow-alt-down" type="fal" size="2x"/>
                        <template #loader>
                          <span class="custom-loader">
                            <fa-icon icon="sync"/>
                          </span>
                        </template>
                      </v-btn>
                    </template>
                    <span>{{ 'Download' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td :class="hover ? 'text-left' : 'text-center text-truncate'"
                    style="width: 100px; max-width: 0;">
                  <span v-if="!hover">{{ fileSize(attachment.fileSize) }}</span>
                  <v-tooltip v-else top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"
                             color="grey"
                             style="border: 1px dashed;"
                             @click="attachmentDelete(attachment.id)"
                             text fab x-small dark depressed>
                        <fa-icon icon="trash" type="fal" size="lg"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Delete' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td class="text-center" style="width: 20px;">
                  <div v-if="!hover">
                    <fa-icon v-if="attachment.isSign" icon="medal" size="lg"/>
                    <span v-else>-</span>
                  </div>
                </td>
              </tr>
            </v-hover>
          </template>

          <template #expanded-item="{ item: attachment }">
            <tr class="expanded" style="border: 1px solid grey;">
                <td :colspan="headers.length + 1" class="pl-10 pr-0 pb-5">
                  <v-simple-table dense>
                    <template>
                      <thead>
                      <tr>
                        <th class="text-center px-0">{{ $t('table.type') }}</th>
                        <th class="text-center">{{ $t('table.name') }}</th>
                        <th class="text-center">{{ $t('table.date') }}</th>
                        <th class="text-center">{{ $t('table.version') }}</th>
                        <th class="text-center">{{ $t('table.fioAdd') }}</th>
                        <th class="text-center">{{ 'Действия' /* TODO: add resource */ }}</th>
                        <th class="text-center">{{ $t('table.sign') }}</th>
                      </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(version, index) in attachment.versions"
                          :key="index"
                          :class="{'light-blue--text text--darken-4': version.IsActive}"
                          style="cursor: pointer; width: 100%;"
                            @click="viewVersion(attachment.id, version.Details)">
                          <td class="text-center px-1"
                              style="width: 25px;">
                            <file-type-icon :size="18"
                                            :extension="version.Details.FileType"/>
                          </td>
                          <td class="text-truncate"
                              style="max-width: 200px; font-size: 13px;">
                            {{ version.Details.FileName }}</td>
                          <td class="text-center" style="font-size: 13px;">{{ version.Date }}</td>
                          <td class="text-center" style="font-size: 13px;">
                            {{ attachment.versions.length === 1 && version.Version === 0 ? 1 : version.Version }}
                          </td>
                          <td class="text-center text-truncate"
                              style="max-width: 100px; font-size: 13px;">
                            {{ version.User }}</td>
                          <td class="text-center">
                            <v-tooltip top>
                              <template #activator="{ on }">
                                <v-btn v-on="on"
                                       @click.stop="setActiveVersion(attachment.id, version.Id)"
                                       color="green"
                                       class="mr-4"
                                       style="border: 1px dashed;"
                                       :disabled="version.IsActive"
                                       icon x-small depressed>
                                  <fa-icon icon="check" type="fal" size="lg"/>
                                </v-btn>
                              </template>
                              <span>{{ 'Set active version' /* TODO: add resource */ }}</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template #activator="{ on }">
                                <v-btn v-on="on"
                                       @click.stop="() => {}"
                                       color="blue"
                                       class="mr-4"
                                       style="border: 1px dashed;"
                                       icon x-small depressed>
                                  <fa-icon icon="bars" type="fal" size="lg"/>
                                </v-btn>
                              </template>
                              <span>{{ 'Замечания' /* TODO: add resource */ }}</span>
                            </v-tooltip>
                            <v-tooltip top>
                              <template #activator="{ on }">
                                <v-btn v-on="on"
                                       @click.stop="deleteVersion(attachment.id, version.Id)"
                                       color="red darken-4"
                                       style="border: 1px dashed;"
                                       icon x-small depressed>
                                  <fa-icon icon="times" type="fal"/>
                                </v-btn>
                              </template>
                              <span>{{ 'Delete version' /* TODO: add resource */ }}</span>
                            </v-tooltip>
                          </td>
                          <td class="text-center" style="width: 20px;">
                            <div>
                              <fa-icon v-if="version.Signatures && version.Signatures.length"
                                       icon="medal" size="lg"/>
                              <span v-else>-</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </td>
              </tr>
          </template>
        </v-data-table>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import ListHeader from './ListHeader'
import FilesUpload from '@/views/attachments/attachments-upload/FilesUpload'
import FileTypeIcon from '@/components/FileTypeIcon'
import { common, tasks, attachments } from '@/mixins/units'
import axios from 'axios'

export default {
  name: 'AttachmentsList',
  mixins: [common, tasks, attachments],
  components: {
    ListHeader,
    FilesUpload,
    FileTypeIcon
  },
  data: () => ({
    attachmentsListMode: false,
    uploadType: 'attachments',
    versionParams: null
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
      if (this.uploadType === 'version') {
        return ({ filePath }) => {
          const { fileId, fileExt } = this.versionParams
          this.addVersion(fileId, fileExt, filePath)
        }
      } else {
        return this.addAttachments
      }
    }
  },
  created () {
    this.getAttachmentTypes()
    if (this.attachments.length && !this.activeAttachment.id) {
      this.selectAttachment(this.attachments[0])
    }
  },
  methods: {
    selectAttachment (attachment) {
      this.setActiveAttachment(attachment)
      this.$emit('selectAttachment')
    },
    async expandVersions (attachment, expand, isExpanded) {
      if (attachment.versions || isExpanded) {
        expand(!isExpanded)
      } else {
        attachment.loading = true
        await this.getAttachmentDetails(attachment)
        attachment.loading = false
        expand(!isExpanded)
      }
    },
    newVersion (fileId, fileExt) {
      this.uploadType = 'version'
      this.versionParams = { fileId, fileExt }
    },
    async downloadAttachment (attachment) {
      attachment.downloading = true
      attachment.srcUrl || await this.getAttachmentDetails(attachment)
      attachment.downloading = false
      await axios.get(attachment.srcUrl)
    }
  }
}
</script>

<style scoped>

  .v-data-table >>> th:nth-child(2) {
    padding-left: 0;
    padding-right: 0;
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
