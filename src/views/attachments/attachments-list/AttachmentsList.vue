<template>
  <div>
    <div class="d-flex align-center font-weight-light">
      <fa-icon icon="paperclip" class="mr-3" size="lg"/>
      <span class="mr-3">{{ $t('tabs.attachments').toUpperCase() }}</span>
      <v-btn v-if="attachmentTypes.length > 1">
        {{ $t('buttons.addAttachment') }}</v-btn>
      <v-btn v-else outlined x-small
             color="primary"
             class="add-btn pa-0">
        <label for="file" class="add-label pa-2">
          {{ $t('buttons.addAttachment') }}
        </label>
      </v-btn>
      <v-spacer/>

      <v-btn-toggle v-show="attachments.length"
                    v-model="attachmentsListMode"
                    mandatory>
        <v-btn text x-small depressed min-height="25">
          <fa-icon icon="bars" size="lg"/>
        </v-btn>
        <v-btn text x-small depressed min-height="25">
          <fa-icon icon="border-all" size="lg"/>
        </v-btn>
      </v-btn-toggle>
    </div>

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
                       class="pr-3"
                       style="height: 300px;">
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
                <td v-show="!hover" class="text-center text-truncate" style="width: 150px; max-width: 120px;">{{ item.date }}</td>
                <td v-show="!hover" class="text-center text-truncate" style="width: 100px; max-width: 0;">{{ fileSize(item.fileSize) }}</td>
                <td v-show="!hover" class="text-center" style="width: 20px;">
                  <fa-icon v-if="item.isSign" icon="medal" size="lg"/>
                  <span v-else>-</span>
                </td>
                <td v-show="hover" colspan="3">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on"
                             :href="item.url"
                             class="mr-3"
                             color="grey"
                             style="border: 1px dashed;"
                             text fab x-small dark depressed>
                        <fa-icon icon="arrow-alt-down" type="fal" size="2x"/>
                      </v-btn>
                    </template>
                    <span>{{ 'Download' /* TODO: add resource */ }}</span>
                  </v-tooltip>
                  <v-tooltip top>
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
import FilesUpload from '@/views/attachments/attachments-upload/FilesUpload'
import FileTypeIcon from '@/components/FileTypeIcon'
import { common, tasks, attachments } from '@/mixins/units'

export default {
  name: 'AttachmentsList',
  mixins: [common, tasks, attachments],
  components: {
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

 .add-btn {
   min-height: 25px;
   min-width: 50px;
 }

 .add-btn >>> span {
   height: 25px;
   width: 100%;
 }

 .add-btn .add-label {
   display: flex;
   align-items: center;
   justify-content: center;
   cursor: pointer;
   height: 100%;
   width: 100%;
   font-size: 12px;
 }

</style>
