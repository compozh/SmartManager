<!-- hasSentPreviousMsg -->
<template>
  <div id="component-chat-log" class="m-8">
    <div
      v-for="(comment, index) in comments"
      class="msg-grp-container"
      :key="index"
    >
      <!-- If previouse msg is older than current time -->
      <template v-if="comments[index - 1]">
        <vs-divider v-if="!isSameDay(comment.date, comments[index - 1].date)">
          <span>{{ toDate(comment.date) }}</span>
        </vs-divider>
        <div
          class="spacer mt-8"
          v-if="!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)"
        ></div>
      </template>

      <div :class="['flex', currentUserIsSender(comment.userId) ? 'flex-row-reverse' : 'items-start']">
        <template v-if="comments[index - 1]">
          <template
            v-if="(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId) || !isSameDay(comment.date, comments[index - 1].date))"
          >
            <vs-avatar
              size="40px"
              class="border-2 shadow border-solid border-white m-0 flex-shrink-0"
              :class="currentUserIsSender(comment.userId) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
              :src="comment.userPhoto"
            ></vs-avatar>
          </template>
        </template>

        <template v-if="index === 0">
          <vs-avatar
            size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0"
            :class="currentUserIsSender(comment.userId) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
            :src="comment.userPhoto"
          ></vs-avatar>
        </template>

        <template v-if="comments[index - 1]">
          <div
            class="mr-16"
            v-if="!(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId) || !isSameDay(comment.date, comments[index - 1].date))"
          ></div>
        </template>

        <div
          class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
          :class="currentUserIsSender(comment.userId) ? 'bg-primary-gradient text-white' : 'border border-solid border-grey-light bg-white'"
        >
          <span>{{ comment.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  props: {
    comments: Array
  },
  computed: {
    currentUserIsSender() {
      const currentUserId = this.$store.getters.userId
      return userId => userId === currentUserId
    },
    hasSentPreviousMsg() {
      return (last_sender, current_sender) => last_sender === current_sender
    }
  },
  methods: {
    isSameDay(dateTimeTo, dateTimeFrom) {
      const formal = 'DD.MM.YYYY HH:mm'
      const dateTo = moment(dateTimeTo, formal).format('LL')
      const dateFrom = moment(dateTimeFrom, formal).format('LL')
      return dateTo === dateFrom
    },
    toDate(dateTime) {
      moment.locale(this.$i18n.locale)
      return moment(dateTime, 'DD.MM.YYYY HH:mm')
        .format('D MMM YYYY')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight
      })
    }
  },
  updated() {
    this.scrollToBottom()
  },
  mounted() {
    this.scrollToBottom()
  }
}
</script>
