<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">
          <!-- TASK ATTACHMENTS -->
          <div class="vx-row">
            <div
              class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex">
              <feather-icon icon="PaperclipIcon" class="mr-2"/>
              <span class="block py-4">{{ $t('tabs.attachments').toUpperCase() }}</span>
            </div>
            <div class="flex">
              <div
                class="mail__attachment"
                v-for="(attachment, index) in attachments"
                :key="index"
              >
                <vs-chip
                  color="primary"
                  class="px-4 py-2 mr-3"
                >{{ attachment.fileName }}</vs-chip>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
  props: ['attachments'],
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  })
}
</script>

<style scoped>

</style>
