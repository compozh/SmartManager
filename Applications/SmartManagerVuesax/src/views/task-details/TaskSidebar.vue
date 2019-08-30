<template>
  <VuePerfectScrollbar class="email-scroll-area" :settings="settings">
    <div class="px-6 py-6 flex flex-col">

      <!-- details -->
      <div class="flex justify-between items-center cursor-pointer" @click="$emit('changeTab', 'details')">
        <div class="flex items-center mb-2">
          <feather-icon icon="AlertCircleIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.details') }}</span>
        </div>
        <vs-chip class="number" color="primary">1</vs-chip>
      </div>

      <!-- attachments -->
      <div class="flex items-center mt-4 mb-2 cursor-pointer" @click="$emit('changeTab', 'attachments')">
        <feather-icon icon="PaperclipIcon"></feather-icon>
        <span class="text-lg ml-3">{{ $t('tabs.attachments') }}</span>
      </div>

      <!-- comments -->
      <div class="flex justify-between items-center mt-4 cursor-pointer" @click="$emit('changeTab', 'comments')">
        <div class="flex items-center mb-2">
          <feather-icon icon="MessageSquareIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.comments') }}</span>
        </div>
        <vs-chip class="number" color="warning">2</vs-chip>
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
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.30,
    }
  }),
  methods: {
    changeTab(tabName) {
      this.$emit('closeSidebar', false)
    },
  }
}
</script>
