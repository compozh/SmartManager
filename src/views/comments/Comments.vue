<template>
  <div class="d-flex flex-column fill-height"
       style="background: #fbfbfb;">
    <div class="d-flex flex-column flex-grow-1 justify-space-between">
      <perfect-scrollbar class="d-flex flex-column flex-grow-1 pa-3"
                         :options="scrollOptions"
                         style="flex-basis: 0;">
        <div v-if="comments.length" class="d-flex flex-column">
          <comments-log :comments="comments"/>
        </div>
        <div v-else
             class="fill-height d-flex justify-center align-center">
          <span class="headline font-weight-light grey--text text-center">
            {{ $t('messages.noComments') }}
          </span>
        </div>
      </perfect-scrollbar>
      <div class="comment-input white d-flex pa-3 align-center">

        <!-- Comment input field -->
        <v-text-field dense class="align-center"
                      v-model="comment"
                      :label="$t('comments.placeholder') + '...'"
                      flat solo
                      hide-details
                      :loading="loading"
                      :disabled="loading"
                      @keyup.enter="sendMsg">

          <!-- Comment clear button -->
          <template #append>
            <v-btn v-if="comment"
                   icon small class="clear-btn"
                   @click="comment = null">
              <fa-icon icon="times" type="fal" size="lg"/>
            </v-btn>
          </template>

        </v-text-field>

        <!-- Comment send button -->
        <outlined-btn v-if="comment"
                      x-small
                      color="blue-grey"
                      icon="paper-plane"
                      :disabled="loading"
                      :handler="sendMsg">
          <span>{{ $t('buttons.send') }}</span>
        </outlined-btn>
      </div>
    </div>
  </div>
</template>

<script>
import OutlinedBtn from '@/components/OutlinedBtn'
import { common, tasks, cases } from '@/mixins/units'

const CommentsLog = () => import('./CommentsLog.vue')

export default {
  mixins: [common, tasks, cases],
  components: {
    OutlinedBtn,
    CommentsLog
  },

  data: () => ({
    comment: null,
    loading: false,
    scrollOptions: {
      wheelSpeed: 0.3,
      suppressScrollX: true
    }
  }),

  computed: {
    comments () {
      return this.$store.getters.comments || []
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
