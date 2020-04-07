<template>
  <div class="pa-3 d-flex flex-column fill-height">
    <div class="d-flex flex-column flex-grow-1 justify-space-between chat-bg border-light">
      <perfect-scrollbar class="d-flex flex-column flex-grow-1 pa-3" style="flex-basis: 0;">
        <div v-if="comments.length" class="d-flex flex-column">
          <comments-log :comments="comments"/>
        </div>
        <div v-else>
          <h4>{{ $t('messages.noComments') }}</h4>
        </div>
      </perfect-scrollbar>
      <div class="msg-input white d-flex pa-3">
        <v-text-field dense class="align-baseline"
                      style="margin-bottom: -22px;"
                      v-model="comment"
                      :label="$t('comments.placeholder')"
                      outlined
                      clearable
                      :loading="loading"
                      :disabled="loading"
                      @keyup.enter="sendMsg">
          <template #append-outer>
            <v-btn color="blue-grey"
                   class="ml-2 white--text"
                   :disabled="loading"
                   @click="sendMsg">
              {{ $t('buttons.send') }}
              <fa-icon :icon="['fal', 'paper-plane']" class="ml-2"/>
            </v-btn>
          </template>
        </v-text-field>
      </div>
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
    comment: '',
    loading: false
  }),
  computed: {
    comments () {
      return this.task.comments || []
    }
  },
  methods: {
    async sendMsg () {
      this.loading = true
      if (this.comment) {
        await this.$store.dispatch('addComment', {
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
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

  .chat-bg {
    background: url('../../assets/noise_bg.png');
  }

  .msg-input {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

</style>
