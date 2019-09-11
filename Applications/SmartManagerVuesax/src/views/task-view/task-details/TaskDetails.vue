<template>
  <VuePerfectScrollbar
    class="scroll-area md:px-8 pt-4 px-6"
    :settings="settings"
  >
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card class="px-4">

          <!-- TASK META ROW -->
          <div
            class="vx-row w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid flex justify-between flex items-center">
            <div class="vx-col sm:w-4/5 w-full flex flex-wrap items-center mb-2">
              <vs-avatar
                class="sender__avatar--single flex-shrink-0 mr-3 border-2 border-solid border-white"
                :src="task.performerPhoto"
                size="65px"></vs-avatar>
              <div class="flex flex-col">
                <h5 class="mb-1">{{ task.performer }}</h5>
                <div class="flex items-center">
                  <span class="text-sm truncate"></span>
                </div>
              </div>
            </div>
            <div
              class="vx-col sm:w-1/5 w-full flex sm:flex-col items-center sm:justify-end mb-2">
              <span
                class="flex sm:mr-0 mr-2 self-end whitespace-no-wrap">{{ time(task.dateAdd) }}</span>
              <span
                class="flex self-end sm:mt-2 mt-0 whitespace-no-wrap">{{ date(task.dateAdd) }}</span>
            </div>
          </div>

          <!-- TASK CONTENT -->
          <div class="vx-row">
            <div class="vx-col w-full">
              <div v-if="task.htmlDescript" class="mail__content break-words mt-8 mb-4">
                <iframe
                  seamless
                  scrolling="no"
                  width="100%"
                  :height="iFrameHeight"
                  frameborder="0"
                  :srcdoc="task.htmlDescript"
                  @load="iFrameOnLoad"
                  style="pointer-events: none;"
                >
                </iframe>
              </div>
              <div
                v-if="task.descript"
                class="mail__content break-words mt-8 mb-4"
                v-html="task.descript"></div>
              <div
                v-if="task.docCaption"
                class="mail__content break-words mt-8 mb-4"
                v-html="task.docCaption"></div>
            </div>
          </div>

          <!-- TASK ATTACHMENTS -->
          <div class="vx-row">
            <div
              class="vx-col w-full border-b border-l-0 border-r-0 border-t-0 d-theme-border-grey-light border-solid mb-6 flex">
              <feather-icon icon="PaperclipIcon" class="mr-2"/>
              <span class="block py-4">{{ $t('tabs.attachments').toUpperCase() }}</span>
            </div>
            <div class="vx-row flex">
              <div
                class="mail__attachment"
                v-for="(attachment, index) in task.originals"
                :key="index"
              >
                <vs-chip
                  color="primary"
                  class="mr-3"
                >{{ index }}</vs-chip>
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <div class="vx-row" style="margin-top: 2.2rem">
      <div class="vx-col w-full pb-10">
        <vx-card>
          <div class="vx-row">
            <div class="vx-col w-full flex justify-between">
                      <span
                        class="text-lg">Click here to <span
                        class="text-primary font-semibold cursor-pointer">Reply</span> or <span
                        class="text-primary font-semibold cursor-pointer">Forward</span></span>
              <feather-icon icon="PaperclipIcon"></feather-icon>
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
  props: {
    task: Object
  },
  components: {
    VuePerfectScrollbar
  },
  data: () => ({
    defaultDescHeight: 250,
    iFrameHeight: 250,
    showThread: false,
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.50,
    },
  }),
  computed: {
    time() {
      return dateTime => dateTime
        ? dateTime.split(' ').pop()
        : ''
    },
    date() {
      return dateTime => dateTime
        ? dateTime.split(' ').shift()
        : ''
    }
  },
  methods: {
    iFrameOnLoad(event) {
      this.iFrameHeight = event.path[0].contentDocument.body.scrollHeight + 5
    }
  }
}
</script>
