<template>
  <div class="flex lg:w-1/2 h-full bg-white p-2 pr-0 rounded-l-lg">
    <router-view v-if="$route.name === 'versions'"></router-view>
    <VuePerfectScrollbar v-else :settings="settings" class="flex-1">
      <table>
        <tr>
          <th>{{ $t('table.type') }}</th>
          <th>{{ $t('table.name') }}</th>
          <th>{{ $t('table.size') }}</th>
          <th>{{ $t('table.sign') }}</th>
        </tr>
        <tr v-for="(attachment, index) in originals" :key="index"
            :class="{active: attachment.id === +$route.params.attachmentId}"
            @click="toAttachment(attachment.id)">
          <td><file-icon :extention="attachment.fileExt"/></td>
          <td class="text-left">{{ attachment.fileName }}</td>
          <td>{{ fileSize(attachment.fileSize) }}</td>
          <td><vs-icon v-if="index % 2">done</vs-icon></td>
        </tr>
      </table>
    </VuePerfectScrollbar>
    <VuePerfectScrollbar v-else :settings="settings" class="flex-1">
      <table>
        <tr>
          <th>{{ $t('table.type') }}</th>
          <th>{{ $t('table.name') }}</th>
          <th>{{ $t('table.size') }}</th>
          <th>{{ $t('table.sign') }}</th>
        </tr>
        <tr v-for="(attachment, index) in originals" :key="index"
            :class="{active: attachment.id === +$route.params.attachmentId}"
            @click="toAttachment(attachment.id)">
          <td><file-icon :extention="attachment.fileExt"/></td>
          <td class="text-left">{{ attachment.fileName }}</td>
          <td>{{ fileSize(attachment.fileSize) }}</td>
          <td><vs-icon v-if="index % 2">done</vs-icon></td>
        </tr>
      </table>
    </VuePerfectScrollbar>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import FileIcon from '@/components/FileIcon'
export default {
  name: 'attachment-list',
  props: {
    originals: Array,
    toAttachment: Function,
    fileSize: Function,
  },
  components: {
    VuePerfectScrollbar,
    FileIcon
  },
  data: () => ({
    edsDialog: false,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    }
  })
}
</script>

<style scoped>

</style>
