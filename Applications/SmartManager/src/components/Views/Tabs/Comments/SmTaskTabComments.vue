<template>
  <v-container pa-0 pt-4>
    <v-layout
      class="comment-item text-xs-left align-center"
      row wrap
      v-for="(comment, index) in task.comments"
      :key="index"
    >
      <v-flex
        d-flex
        shrink
        class="text-xs-center"
      >
        <user-icon :src="comment.userPhoto" size="30"></user-icon>
      </v-flex>
      <v-flex px-2 class="text-xs-left">
        <v-layout column text-xs-left>
          <v-flex class="text-xs-left">
            <span
              class="body-2 font-weight-light blue--text text--darken-2"
            >{{ comment.text }}</span>
          </v-flex>
          <v-flex
            d-flex
            justify-space-between
            class="caption grey--text"
          >
            <span class="text-xs-left">{{ comment.user }}</span>
            <span class="text-xs-right">{{ comment.date }}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 v-if="!getCommentsLength">
        <p class="pt-3 grey--text subheading">Коментарии отсутствуют</p>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout row wrap mt-5>
      <v-flex>
        <v-text-field
          v-model="comment"
          label="Добавить коментарий"
          placeholder="Текст коментария..."
          clearable
          @click:clear.stop
          prepend-icon="edit"
          append-outer-icon="send"
          @change="sendMessage"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'sm-task-tab-comments',
  data: () => ({
    comment: ''
  }),
  computed: {
    task() {
      return this.$store.state.sm.taskInfo
    },
    type() {
      return this.task.isGenerate ? 'DOCUMENT' : 'TASK'
    },
    getCommentsLength() {
      return this.task.comments ? this.task.comments.length : ''
    }
  },
  methods: {
    sendMessage() {
      this.$store.dispatch('sm/addTaskComment', {
        comment: this.comment,
        params: {
          type: this.type,
          id: this.task.id,
          arso: this.task.arso,
          keyValue: this.task.keyValue,
          kidCopy: this.task.kidCopy
        }
      })
      this.comment = ''
    }
  }
}
</script>

<style scoped>
  .comment-item {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
  }
</style>
