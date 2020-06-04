<template>
  <div>
    <list-header v-model="attachmentsListMode"/>

    <!-- UPLOAD COMPONENT -->
    <files-upload v-slot="{ files }" upload-auto>
        <v-simple-table>
          <template>
            <tbody>
            <tr v-for="item in files"
                :key="item.id"
                class="grey--text">
              <td style="width: 30px;">
                <v-progress-circular
                  :size="25"
                  :value="item.progress"
                  :width="3"
                  color="primary"
                  class="caption"/>
              </td>
              <td class="text-truncate" style="max-width: 0;">{{ item.name }}</td>
              <td style="width: 100px;">{{ fileSize(item.size) }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
    </files-upload>

    <perfect-scrollbar v-show="attachments.length"
                       style="max-height: 300px;">
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
        <v-chip v-for="item in attachments"
                :key="item.id" small
                class="my-2 mr-2 text-truncate"
                :class="{ warning: item.id === activeAttachment.id }"
                style="min-width: 100px; max-width: 33%; flex: 1 1 24%"
                @click="selectAttachment(item)">
          <fa-icon icon="file-alt" class="mr-3" size="lg"/>
          <span class="text-truncate">{{ item.fileName }}</span>
        </v-chip>
      </div>
      <div v-else>
        <v-simple-table>
          <template>
            <thead>
              <tr>
                <th class="text-center">{{ $t('table.type') }}</th>
                <th class="text-center">{{ $t('table.name') }}</th>
                <th class="text-center">{{ $t('table.date') }}</th>
                <th class="text-center">{{ $t('table.size') }}</th>
                <th class="text-center">{{ $t('table.sign') }}</th>
              </tr>
            </thead>
            <tbody>
            <v-hover v-slot:default="{ hover }" v-for="item in this.attachments"
                     :key="item.id">
              <tr style="cursor: pointer; width: 100%;"
                  :class="{ 'light-blue lighten-5': item.id === activeAttachment.id }"
                  @click="selectAttachment(item)">
                <td class="text-center"
                    style="width: 30px;">
                  <file-type-icon :extension="item.fileExt"/>
                </td>
                <td class="text-truncate" style="max-width: 0;">{{ item.fileName }}</td>
                <td :class="hover ? 'text-right' : 'text-center text-truncate'"
                    style="width: 150px; max-width: 120px;">
                  <span v-show="!hover">{{ item.date }}</span>
                  <v-tooltip v-show="hover" top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"
                             :href="item.srcUrl"
                             @click.stop
                             color="grey"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <fa-icon icon="arrow-alt-down" type="fal" size="2x"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Download' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td :class="hover ? 'text-left' : 'text-center text-truncate'"
                    style="width: 100px; max-width: 0;">
                  <span v-if="!hover">{{ fileSize(item.fileSize) }}</span>
                  <v-tooltip v-else top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"
                             color="grey"
                             style="border: 1px dashed;"
                             @click="attachmentDelete(item.id)"
                             text fab x-small dark depressed>
                        <fa-icon icon="trash" type="fal" size="lg"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Delete' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                </td>
                <td class="text-center" style="width: 20px;">
                  <div v-if="!hover">
                    <fa-icon v-if="item.isSign" icon="medal" size="lg"/>
                    <span v-else>-</span>
                  </div>
                </td>
              </tr>
            </v-hover>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import ListHeader from './ListHeader'
import FilesUpload from '@/views/attachments/attachments-upload/FilesUpload'
import FileTypeIcon from '@/components/FileTypeIcon'
import { common, tasks, attachments } from '@/mixins/units'

export default {
  name: 'AttachmentsList',
  mixins: [common, tasks, attachments],
  components: {
    ListHeader,
    FilesUpload,
    FileTypeIcon
  },
  data: () => ({
    attachmentsListMode: false
  }),
  created () {
    this.getAttachmentTypes()
  },
  methods: {
    selectAttachment (attachment) {
      this.setActiveAttachment(attachment)
      this.$emit('input')
    }
  }
}
</script>

<style scoped>

  .v-data-table >>> .v-data-table__wrapper {
    overflow-x: hidden;
  }

</style>
