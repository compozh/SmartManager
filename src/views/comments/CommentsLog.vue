<template>
  <div class="d-flex flex-column mb-10">
    <div v-for="(comment, index) in comments"
         :key="index">
      <template v-if="index === 0 || !isSameDay(comment.date, comments[index - 1].date)">
        <div class="d-flex align-center mb-5"
             :class="{'mt-5': index !== 0}">
          <v-divider class="mx-3"/>
          <span class="border-light px-3 caption grey--text">{{ toDate(comment.date) }}</span>
          <v-divider class="mx-3"/>
        </div>
      </template>

      <div :class="['d-flex', 'align-center', 'mt-1', { 'flex-row-reverse': currentUserIsSender(comment.userId) }]">
        <template v-if="comments[index - 1]">
          <template v-if="comment.userId !== comments[index - 1].userId
                           || !isSameDay(comment.date, comments[index - 1].date)">
            <v-avatar class="mx-4 my-n2" color="grey lighten-1" size="40px"
                      :class="currentUserIsSender(comment.userId) ? 'ml-4' : 'mr-4'">
              <fa-icon v-if="!comment.userPhoto" icon="user" inverse/>
              <v-img v-else :src="comment.userPhoto"/>
            </v-avatar>
          </template>
        </template>

        <template v-if="index === 0">
          <v-avatar class="mx-4 my-n2 grey lighten-1" size="40px">
            <fa-icon v-if="!comment.userPhoto" icon="user" inverse/>
            <v-img v-else :src="comment.userPhoto"/>
          </v-avatar>
        </template>

        <template v-if="comments[index - 1]">
          <div v-if="!(comment.userId !== comments[index - 1].userId
                     || !isSameDay(comment.date, comments[index - 1].date))"
               class="mx-9"/>
        </template>

        <div class="msg border-light px-2 py-1 d-flex flex-column">
          <div class="d-flex justify-space-between caption">
            <span v-if="index === 0 || !isSameDay(comment.date, comments[index - 1].date)
                        || comment.userId !== comments[index - 1].userId"
                  :class="currentUserIsSender(comment.userId) ? 'order-1 ml-5' : 'mr-5'">
              {{ comment.user }}
            </span>
            <span class="font-weight-thin grey--text text--lighten-2 "
                  :class="currentUserIsSender(comment.userId) ? 'mr-auto' : 'ml-auto'">
              {{ toTime(comment.date) }}</span>
          </div>
          <span class="body-2 font-weight-light text--secondary"
                :class="{'text-truncate': !comment.text.includes(' ')}">
            {{ comment.text }}</span>
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
    position: relative;
    max-width: 70%;
    background: white;
  }

</style>
