<template>
  <div>
    <div class="d-flex align-center">
      <fa-icon icon="paperclip" class="mr-3" size="lg"/>
      <span class="mr-3">{{ $t('tabs.attachments').toUpperCase() }}</span>
      <v-btn v-if="attachmentTypes.length > 1">
        {{ $t('buttons.addAttachment') }}</v-btn>
      <v-btn v-else outlined x-small
             color="primary"
             class="add-btn pa-0">
        <label for="file" class="add-label">
          {{ $t('buttons.addAttachment') }}
        </label>
      </v-btn>
      <v-spacer/>

      <v-btn-toggle v-show="attachments.length"
                    v-model="attachmentsListMode"
                    mandatory>
        <v-btn text x-small depressed min-height="25">
          <fa-icon icon="border-all" size="lg"/>
        </v-btn>
        <v-btn text x-small depressed min-height="25">
          <fa-icon icon="bars" size="lg"/>
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- UPLOAD COMPONENT -->
    <files-upload v-slot="{ files }"
                  @attach="getAttachments($event)"
                  :attachmentsList.sync="attachmentsList"
                  upload-auto>
      <div>File list:</div>
      <v-simple-table>
        <template>
          <tbody>
            <tr v-for="item in files" :key="item.id">
              <td></td>
              <td>{{ item.name }}</td>
              <td>{{ fileSize(item.size) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </files-upload>

    <perfect-scrollbar v-show="attachments.length">
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
        <v-chip v-for="item in attachments"
                :key="item.id" small
                class="my-2 mr-2 text-truncate"
                :class="{ warning: item.id === activeAttachment.id }"
                style="min-width: 100px; max-width: 200px; flex: 1 1 20%"
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
              <th></th>
              <th class="text-left">{{ $t('table.name') }}</th>
              <th class="text-left">{{ $t('table.size') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in task.originals" :key="item.id">
              <td class="text-center"><fa-icon icon="file" size="2x" type="fal"/></td>
              <td>{{ item.fileName }}</td>
              <td>{{ fileSize(item.fileSize) }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import FilesUpload from '@/views/attachments/attachments-upload/FilesUpload'
import { tasks, attachments } from '@/mixins/units'

export default {
  name: 'AttachmentsList',
  mixins: [tasks, attachments],
  components: {
    FilesUpload
  },
  data: () => ({
    attachmentsListMode: false
  }),
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
   width: 50px;
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
