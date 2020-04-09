<template>
  <div class="d-flex flex-column mb-10">
    <div v-for="(comment, index) in comments"
         :key="index">
      <template v-if="comments[index - 1]">
        <div v-if="!isSameDay(comment.date, comments[index - 1].date)"
             class="d-flex align-center mt-5">
          <v-divider class="mx-3"/>
          <span class="border-light py-1 px-3 caption" style="background: white">{{ toDate(comment.date) }}</span>
          <v-divider class="mx-3"/>
        </div>
        <div v-if="!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)" class="mt-5"></div>
      </template>

      <div :class="['d-flex', 'align-center', { 'flex-row-reverse': currentUserIsSender(comment.userId) }]">
        <template v-if="comments[index - 1]">
          <template v-if="(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)
                           || !isSameDay(comment.date, comments[index - 1].date))">
            <v-avatar class="mx-4" color="grey lighten-1" size="40px"
                      :class="currentUserIsSender(comment.userId) ? 'ml-4' : 'mr-4'">
              <fa-icon v-if="!comment.userPhoto" :icon="['fal', 'user']" inverse/>
              <v-img v-else :src="comment.userPhoto"/>
            </v-avatar>
          </template>
        </template>

        <template v-if="index === 0">
          <v-avatar class="mx-4 grey lighten-1" size="40px">
            <fa-icon v-if="!comment.userPhoto" :icon="['fal', 'user']" inverse/>
            <v-img v-else :src="comment.userPhoto"/>
          </v-avatar>
        </template>

        <template v-if="comments[index - 1]">
          <div v-if="!(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)
                       || !isSameDay(comment.date, comments[index - 1].date))"
               class="mx-9"></div>
        </template>

        <div class="msg border-light px-2 py-1 d-flex align-center">
          <span class="caption font-weight-light text--secondary">{{ comment.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentDates } from '@/mixins/dateTime'

export default {
  props: {
    comments: Array
  },
  mixins: [commentDates],
  computed: {
    currentUserIsSender () {
      const currentUserId = this.$store.getters.userId
      return userId => userId === currentUserId
    },
    hasSentPreviousMsg () {
      return (lastSender, currentSender) => lastSender === currentSender
    }
  },
  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight
      })
    }
  },
  updated () {
    this.scrollToBottom()
  },
  mounted () {
    this.scrollToBottom()
  }
}
</script>

<style scoped>

  /* TODO: output border-light class to common styles */
  .border-light {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }

  .msg {
    max-width: 70%;
    background: white;
  }

</style>
