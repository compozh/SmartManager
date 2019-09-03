<!-- hasSentPreviousMsg -->
<template>
    <div id="component-chat-log" class="m-8">
        <div v-for="(comment, index) in comments" class="msg-grp-container" :key="index">

            <!-- If previouse msg is older than current time -->
            <template v-if="comments[index - 1]">
                <vs-divider v-if="!isSameDay(comment.date, comments[index - 1].date)">
                    <span>{{ toDate(comment.date) }}</span>
                </vs-divider>
                <div class="spacer mt-8" v-if="!hasSentPreviousMsg(isSent(comments[index - 1].userId), isSent(comment.userId))"></div>
            </template>

            <div class="flex items-start" :class="[{'flex-row-reverse' : isSent(comment.userId)}]">

                <template v-if="comments[index - 1]">
                    <template v-if="(!hasSentPreviousMsg(isSent(comments[index-1].userId), isSent(comment.userId)) || !isSameDay(comment.date, comments[index - 1].date))">
                        <vs-avatar size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0" :class="isSent(comment.userId) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'" :src="comment.userPhoto"></vs-avatar>
                    </template>
                </template>

                <template v-if="index === 0">
                    <vs-avatar size="40px" class="border-2 shadow border-solid border-white m-0 flex-shrink-0" :class="isSent(comment.userId) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'" :src="comment.userPhoto"></vs-avatar>
                </template>

                <template v-if="comments[index - 1]">
                    <div class="mr-16" v-if="!(!hasSentPreviousMsg(isSent(comments[index - 1].userId), isSent(comment.userId)) || !isSameDay(comment.date, comments[index - 1].date))"></div>
                </template>

                <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm" :class="{'bg-primary-gradient text-white': isSent(comment.userId), 'border border-solid border-grey-light bg-white': !isSent(comment.userId)}">
                    <span>{{ comment.text }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import moment from 'moment'

export default {
  props: ['comments'],
  data: () => ({

  }),
  computed: {
    isSent() {
      const currentUserId = this.$store.state.auth.currentUser.UserData.CurrentUserData.UserId
      return userId => userId === currentUserId
    },
    chatData() {
      return this.$store.getters['chat/chatDataOfUser'](this.userId)
    },
    contactIndex() {
      return contacts.findIndex(contact => contact.id == this.userId)
    },
    userImg() {
      if (this.contactIndex !== -1) { return this.contacts[this.contactIndex].img }
      return undefined
    },
    activeUserImg() {
      return this.$store.state.AppActiveUser.img
    },
    senderImg() {
      return isSentByActiveUser => {
        if (isSentByActiveUser) {
          return require(`@/assets/images/portrait/small/${this.$store.state.AppActiveUser.img}`)
        } else {
          return require(`@/assets/images/portrait/small/${this.contacts[this.contactIndex].img}`)
        }
      }
    },
    hasSentPreviousMsg() {
      return (last_sender, current_sender) => last_sender == current_sender
    },
  },
  methods: {
    isSameDay(time_to, time_from) {
      const date_time_to = moment(time_to, 'DD.MM.YYYY HH:mm')
      const date_time_from = moment(time_from, 'DD.MM.YYYY HH:mm')

      return date_time_to.year() === date_time_from.year() &&
                date_time_to.month() === date_time_from.month() &&
                date_time_to.date() === date_time_from.date()
    },
    toDate(time) {
      const locale = 'en-us'
      const date_obj = new Date(moment(time, 'DD.MM.YYYY HH:mm'))
      const monthName = date_obj.toLocaleString(locale, {
        month: 'short'
      })
      return date_obj.getDate() + ' '  + monthName
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
