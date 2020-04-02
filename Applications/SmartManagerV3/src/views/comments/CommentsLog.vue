<template>
  <div class="d-flex flex-column mb-10">
    <div v-for="(comment, index) in comments"
         :key="index">
      <!-- If previouse msg is older than current time -->
      <template v-if="comments[index - 1]">
        <div v-if="!isSameDay(comment.date, comments[index - 1].date)"
             class="d-flex align-center mt-5">
          <v-divider class="mx-3"/>
          <span class="py-1 px-3 white caption elevation-3">{{ toDate(comment.date) }}</span>
          <v-divider class="mx-3"/>
        </div>
        <div v-if="!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)" class="mt-5"></div>
      </template>

      <div :class="['d-flex', 'align-center', { 'flex-row-reverse': currentUserIsSender(comment.userId) }]">
        <template v-if="comments[index - 1]">
          <template v-if="(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)
                           || !isSameDay(comment.date, comments[index - 1].date))">
            <v-avatar class="mx-4" color="grey lighten-1 elevation-3" size="40px"
                      :class="currentUserIsSender(comment.userId) ? 'ml-4' : 'mr-4'">
              <fa-icon v-if="!comment.userPhoto" :icon="['fal', 'user']" inverse/>
              <v-img v-else :src="comment.userPhoto"/>
            </v-avatar>
          </template>
        </template>

        <template v-if="index === 0">
          <v-avatar class="mx-4 grey lighten-1 elevation-3" size="40px">
            <fa-icon v-if="!comment.userPhoto" :icon="['fal', 'user']" inverse/>
            <v-img v-else :src="comment.userPhoto"/>
          </v-avatar>
        </template>

        <template v-if="comments[index - 1]">
          <div v-if="!(!hasSentPreviousMsg(comment.userId, comments[index - 1].userId)
                       || !isSameDay(comment.date, comments[index - 1].date))"
               class="mx-9"></div>
        </template>

        <div class="msg mt-1 px-2 py-1 d-flex align-center elevation-3"
             :class="{ 'self-msg': currentUserIsSender(comment.userId) }">
          <span class="white--text">{{ comment.text }}</span>
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
    currentUserIsSender () {
      const currentUserId = this.$store.getters.userId
      return userId => userId === currentUserId
    },
    hasSentPreviousMsg () {
      return (lastSender, currentSender) => lastSender === currentSender
    }
  },
  methods: {
    isSameDay (dateTimeTo, dateTimeFrom) {
      const formal = 'DD.MM.YYYY HH:mm'
      const dateTo = moment(dateTimeTo, formal).format('LL')
      const dateFrom = moment(dateTimeFrom, formal).format('LL')
      return dateTo === dateFrom
    },
    toDate (dateTime) {
      moment.locale(this.$i18n.locale)
      return moment(dateTime, 'DD.MM.YYYY HH:mm')
        .format('D MMM YYYY')
    },
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

  .msg {
    max-width: 70%;
    border-radius: 5px;
    background: linear-gradient(to right, rgba(130,130,130,1) 0%, rgba(189,189,189,1) 100%);
  }

  .self-msg {
    align-self: flex-end;
    background: linear-gradient(to right, rgba(95,129,255,1) 0%, rgba(63,86,171,1) 100%);
  }

</style>
