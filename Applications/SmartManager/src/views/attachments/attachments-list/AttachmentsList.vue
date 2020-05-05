<template>
  <div>
    <div class="d-flex align-center">
      <fa-icon icon="paperclip" class="mr-3" size="lg"/>
      <span class="mr-3">{{ $t('tabs.attachments').toUpperCase() }}</span>
      <v-btn v-if="attachmentTypes.length > 1">
        {{ $t('buttons.addAttachment') }}</v-btn>
      <v-btn v-else outlined small color="primary">
        <label id="addLabel" for="file"
               style="cursor: pointer;">
          {{ $t('buttons.addAttachment') }}
        </label>
      </v-btn>
      <files-upload @attach="getAttachments($event)"/>
      <v-spacer/>
      <v-btn-toggle v-model="attachmentsListMode" mandatory>
        <v-btn text small depressed>
          <fa-icon icon="border-all" size="lg"/>
        </v-btn>
        <v-btn text small depressed>
          <fa-icon icon="bars" size="lg"/>
        </v-btn>
      </v-btn-toggle>
    </div>
    <perfect-scrollbar>
      <div v-if="attachmentsListMode" class="py-2 d-flex flex-wrap">
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

</style>
