<template>
  <VuePerfectScrollbar class="chat-scroll-area pt-4" :settings="settings">

    <!-- RIGHT COLUMN -->
    <div
      class="chat__bg app-fixed-height chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0"
      :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChatUser === null}"
    >
      <template>
        <VuePerfectScrollbar
          class="chat-content-scroll-area border border-solid d-theme-border-grey-light"
          :settings="settings"
          ref="chatLogPS"
        >
          <div class="chat__log" ref="chatLog">
            <chat-log :userId="activeChatUser" v-if="activeChatUser"></chat-log>
          </div>
        </VuePerfectScrollbar>

        <div class="chat__input flex p-4 bg-white">
          <vs-input
            class="flex-1"
            :placeholder="$t('comments.commentText')"
            v-model="typedMessage"
            @keyup.enter="sendMsg"/>
          <vs-button
            class="bg-primary-gradient ml-4"
            type="filled"
            @click="sendMsg"
          >Send
          </vs-button>
        </div>
      </template>
    </div>
  </VuePerfectScrollbar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import ChatLog from './ChatLog.vue'

export default {
  name: 'vx-sidebar',
  components: {
    VuePerfectScrollbar,
    ChatLog
  },
  data: () => ({
    activeChatUser: null,
    typedMessage: '',
    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.70,
    },
    clickNotClose: true,
    windowWidth: window.innerWidth
  }),
  methods: {
    sendMsg() {
      if (!this.typedMessage) {
        return
      }
      this.typedMessage = ''
      this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth
    }
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize)
    })
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleWindowResize)
  },
}
</script>

<style lang="scss">
  @import "@/assets/scss/vuesax/apps/chat.scss";
</style>
