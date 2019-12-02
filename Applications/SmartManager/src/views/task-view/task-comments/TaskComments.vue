<template>
  <div id="chat-app" class="rounded relative overflow-hidden">

    <!-- RIGHT COLUMN -->
    <div
      class="chat__bg app-fixed-height chat-content-area"
    >
      <template>
        <VuePerfectScrollbar
          class="comments-container chat-content-scroll-area"
          :settings="settings"
          ref="chatLogPS"
        >
          <div
            v-if="comments.length"
            class="chat__log"
            ref="chatLog"
          >
            <task-comments-log :comments="comments"></task-comments-log>
          </div>
          <div v-else class="no-comments flex flex-col items-center">
            <feather-icon icon="MessageSquareIcon" class="mb-4 bg-white p-8 shadow-md rounded-full" svgClasses="w-16 h-16"></feather-icon>
            <h4 class="py-2 px-4 bg-white shadow-md rounded-full">{{ $t('messages.noComments') }}</h4>
          </div>
        </VuePerfectScrollbar>
        <div class="chat__input flex p-4 bg-white">
          <vs-input
            class="flex-1"
            :placeholder="$t('comments.placeholder')"
            v-model="comment"
            @keyup.enter="sendMsg"
          />
          <vs-button
            class="bg-primary-gradient ml-4"
            type="filled"
            @click="sendMsg"
          >{{ $t('buttons.send') }}
          </vs-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import TaskCommentsLog from './TaskCommentsLog.vue'

export default {
  props: ['task'],
  components: {
    VuePerfectScrollbar,
    TaskCommentsLog,
  },
  data: () => ({
    active: true,
    isHidden: false,
    searchContact: '',
    activeProfileSidebar: false,
    activeChatUser: null,
    userProfileId: -1,

    comment: '',

    settings: {
      maxScrollbarLength: 60,
      wheelSpeed: 0.70,
    },
    windowWidth: window.innerWidth,
  }),
  computed: {
    comments() {
      return this.task.comments
        ? this.task.comments
        : []
    },
    type() {
      if (this.task.__typename === 'Task') {
        return this.task.isGenerate ? 'DOCUMENT' : 'TASK'
      }
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      return ''
    }
  },
  methods: {
    sendMsg() {
      if (this.comment) {
        this.$store.dispatch('sm/addComment', {
          comment: this.comment,
          params: {
            type: this.type,
            id: this.task.id || this.$route.params.id,
            arso: this.task.arso,
            keyValue: this.task.keyValue,
            kidCopy: this.task.kidCopy
          }
        })
        this.comment = ''
      }
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

  #chat-app {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }

  .comments-container {
    display: flex;
    justify-content: space-between;
  }

  .chat__log {
    flex-grow: 1;
  }

  .no-comments {
    align-self: center;
    margin: 0 auto;
  }
</style>
