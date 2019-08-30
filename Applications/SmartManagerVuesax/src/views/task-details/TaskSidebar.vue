<template>
  <VuePerfectScrollbar class="email-scroll-area" :settings="settings">
    <div class="px-6 py-6 flex flex-col">

      <!-- details -->
      <div class="flex items-center mt-4 mb-2 cursor-pointer" @click="$emit('changeTab', 'details')">
        <feather-icon icon="AlertCircleIcon"></feather-icon>
        <span class="text-lg ml-3">{{ $t('tabs.details') }}</span>
      </div>

      <!-- attachments -->
      <div class="flex justify-between items-center mt-4 cursor-pointer" @click="$emit('changeTab', 'attachments')">
        <div class="flex items-center mb-2">
          <feather-icon icon="PaperclipIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.attachments') }}</span>
        </div>
        <vs-chip class="number" color="primary">3</vs-chip>
      </div>

      <!-- comments -->
      <div class="flex justify-between items-center mt-4 cursor-pointer" @click="$emit('changeTab', 'comments')">
        <div class="flex items-center mb-2">
          <feather-icon icon="MessageSquareIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.comments') }}</span>
        </div>
        <vs-chip class="number" color="warning">5</vs-chip>
      </div>

      <!-- approvals -->
      <div class="flex items-center mt-4 mb-2 cursor-pointer" @click="$emit('changeTab', 'approvals')">
        <feather-icon icon="CheckIcon"></feather-icon>
        <span class="text-lg ml-3">{{ $t('tabs.approvals') }}</span>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  props: {
    attachments: {
      type: Array
    },
    comments: {
      type: Array
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  })
}
</script>
