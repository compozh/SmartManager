<template>
  <div class="d-flex flex-column fill-height" style="background: #fbfbfb;">
    <div class="d-flex flex-column flex-grow-1 justify-space-between">
      <perfect-scrollbar class="d-flex flex-column flex-grow-1 pa-3" style="flex-basis: 0;">
        <div v-if="comments.length" class="d-flex flex-column">
          <comments-log :comments="comments"/>
        </div>
        <div v-else
             class="fill-height d-flex justify-center align-center">
          <span class="headline font-weight-light grey--text">
            {{ $t('messages.noComments') }}
          </span>
        </div>
      </perfect-scrollbar>
      <div class="msg-input white d-flex pa-3 align-center">
        <v-text-field dense class="align-center"
                      v-model="comment"
                      :label="$t('comments.placeholder')"
                      flat solo
                      clearable
                      hide-details
                      :loading="loading"
                      :disabled="loading"
                      @keyup.enter="sendMsg">
        </v-text-field>
        <v-btn v-if="comment"
               depressed
               color="blue-grey"
               class="ml-2 white--text"
               :disabled="loading"
               @click="sendMsg">
          {{ $t('buttons.send') }}
          <fa-icon icon="paper-plane" class="ml-2"/>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import CommentsLog from './CommentsLog.vue'
import { common, tasks } from '@/mixins/units'

export default {
  mixins: [common, tasks],
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
      if (this.comment) {
        this.loading = true
        await this.$store.dispatch('addComment', {
          comment: this.comment,
          params: this.params
        })
        this.comment = ''
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

  .msg-input {
    border-top: 1px solid;
    border-color: #e5e5e5 !important;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

</style>
