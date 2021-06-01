<template>
  <div class="d-flex flex-column mb-10">

    <!-- Comments -->
    <div v-for="(comment, index) in comments" :key="index">

      <!-- Date separator -->
      <template v-if="index === 0 || !isSameDay(comment.date, comments[index - 1].date)">
        <div class="d-flex align-center mb-5"
             :class="{'mt-5': index !== 0}">
          <v-divider class="mx-3"/>
          <span class="border-light px-3 caption grey--text">{{ toDate(comment.date) }}</span>
          <v-divider class="mx-3"/>
        </div>
      </template>

      <!-- Comment block -->
      <div :class="['d-flex', 'align-center', 'mt-1', { 'flex-row-reverse': currentUserIsSender(comment.userId) }]">

        <template v-if="comments[index - 1]">
          <template v-if="comment.userId !== comments[index - 1].userId
                           || !isSameDay(comment.date, comments[index - 1].date)">
            <v-avatar class="mx-4 my-n2" color="grey lighten-1" size="40px"
                      :class="currentUserIsSender(comment.userId) ? `${ml}-4` : `${mr}-4`">
              <fa-icon v-if="!comment.userPhoto" icon="user" inverse/>
              <v-img v-else :src="comment.userPhoto"/>
            </v-avatar>
          </template>
        </template>

        <!-- Show avatar if it a first user comment-->
        <template v-if="index === 0">
          <v-avatar class="mx-4 my-n2 grey lighten-1" size="40px">
            <fa-icon v-if="!comment.userPhoto" icon="user" inverse/>
            <v-img v-else :src="comment.userPhoto"/>
          </v-avatar>
        </template>

        <!-- Add margin if it comment from another user and no same day -->
        <template v-if="comments[index - 1]">
          <div v-if="!(comment.userId !== comments[index - 1].userId
                     || !isSameDay(comment.date, comments[index - 1].date))"
               class="mx-9"/>
        </template>

        <!-- Comment text -->
        <div class="comment-msg border-light px-2 py-1 d-flex flex-column">
          <div class="d-flex justify-space-between caption">
            <span v-if="index === 0 || !isSameDay(comment.date, comments[index - 1].date)
                        || comment.userId !== comments[index - 1].userId"
                  :class="currentUserIsSender(comment.userId) ? `order-1 ${ml}-5` : `${mr}-5`">
              {{ comment.user }}
            </span>
            <span class="font-weight-thin grey--text text--lighten-2 "
                  :class="currentUserIsSender(comment.userId) ? `${mr}-auto` : `${ml}-auto`">
              {{ toTime(comment.date) }}</span>
          </div>
          <span class="body-2 font-weight-light text--secondary"
                :class="{'text-truncate': !comment.text.includes(' ')}"
                @click="showMsg">
            {{ comment.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentDates } from '@/mixins/dateTime'

export default {
  mixins: [commentDates],
  props: {
    comments: Array
  },
  computed: {
    currentUserIsSender () {
      const currentUserId = this.$store.getters.userId
      return userId => userId === currentUserId
    }
  },
  updated () {
    this.scrollToBottom()
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    scrollToBottom () {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight
      })
    },
    showMsg (event) {
      event.target.style.wordBreak = 'break-all'
    }
  }
}
</script>
