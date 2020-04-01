<template>
    <div class="blue lighten-5">
        <perfect-scrollbar>
          <div v-if="comments.length">
            <comments-log :comments="comments"/>
          </div>
          <div v-else>
            <h4>{{ $t('messages.noComments') }}</h4>
          </div>
        </perfect-scrollbar>
        <div>
          <v-input class="flex-1"
                    :placeholder="$t('comments.placeholder')"
                    v-model="comment"
                    @keyup.enter="sendMsg"/>
          <v-button class="bg-primary-gradient ml-4"
                     type="filled"
                     @click="sendMsg">{{ $t('buttons.send') }}
          </v-button>
        </div>
    </div>
</template>

<script>
import CommentsLog from './CommentsLog.vue'
import { tasks } from '@/mixins/units'

export default {
  mixins: [tasks],
  components: {
    CommentsLog
  },
  data: () => ({
    active: true,
    isHidden: false,
    searchContact: '',
    activeProfileSidebar: false,
    activeChatUser: null,
    userProfileId: -1,
    comment: '',
    windowWidth: window.innerWidth
  }),
  computed: {
    comments () {
      return this.task.comments || []
    },
    type () {
      if (this.task.__typename === 'Task') {
        return this.task.keyValue ? 'DOCUMENT' : 'TASK'
      }
      if (this.task.__typename === 'Case') {
        return 'CASE'
      }
      return ''
    }
  },
  methods: {
    sendMsg () {
      if (this.comment) {
        this.$store.dispatch('addComment', {
          comment: this.comment,
          params: {
            type: this.type,
            id: this.task.id || this.$route.params.taskId,
            arso: this.task.arso,
            keyValue: this.task.keyValue,
            kidCopy: this.task.kidCopy
          }
        })
        this.comment = ''
      }
    }
  }
}
</script>

<style scoped>

</style>
