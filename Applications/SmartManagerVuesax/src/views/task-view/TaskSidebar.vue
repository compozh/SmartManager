<template>
  <VuePerfectScrollbar class="email-scroll-area" :settings="settings">
    <div class="px-6 py-6 flex flex-col">

      <!-- details -->
      <div
        class="flex items-center mt-4 mb-2 cursor-pointer"
        :class="{'text-primary': currentTab === 'details'}"
        @click="$emit('changeTab', 'details')"
      >
        <feather-icon icon="AlertCircleIcon"></feather-icon>
        <span class="text-lg ml-3">{{ $t('tabs.details') }}</span>
      </div>

      <!-- attachments -->
      <div
        class="flex justify-between items-center mt-4 cursor-pointer"
        :class="{'text-primary': currentTab === 'attachments'}"
        @click="$emit('changeTab', 'attachments')"
      >
        <div class="flex items-center mb-2">
          <feather-icon icon="PaperclipIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.attachments') }}</span>
        </div>
        <vs-chip v-if="attachments.length" class="number" color="primary">{{ attachments.length }}</vs-chip>
      </div>

      <!-- comments -->
      <div
        class="flex justify-between items-center mt-4 cursor-pointer"
        :class="{'text-primary': currentTab === 'comments'}"
        @click="$emit('changeTab', 'comments')"
      >
        <div class="flex items-center mb-2">
          <feather-icon icon="MessageSquareIcon"></feather-icon>
          <span class="text-lg ml-3">{{ $t('tabs.comments') }}</span>
        </div>
        <vs-chip v-if="comments.length" class="number" color="warning">{{ comments.length }}</vs-chip>
      </div>

      <!-- approvals -->
      <div
        class="flex items-center mt-4 mb-2 cursor-pointer"
        :class="{'text-primary': currentTab === 'approvals'}"
        @click="$emit('changeTab', 'approvals')"
      >
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
    currentTab: String,
    attachments: Array,
    comments: Array,
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
