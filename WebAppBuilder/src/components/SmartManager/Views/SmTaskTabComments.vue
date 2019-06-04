<template>
  <v-container pa-0>
    <v-layout
      class="comment-item text-xs-left"
      row wrap
      v-for="(comment, index) in task.comments"
      :key="index"
    >
      <v-flex
        xs1
        class="text-xs-center"
      >
        <v-icon
          size="40"
          color="#b3b3b3"
        >account_circle
        </v-icon>
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
      </v-flex>
      <v-divider></v-divider>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: "smTaskTabComments",
    props: ['task'],
    computed: {
      getCommentsLength() {
        return this.task.comments ? this.task.comments.length : ''
      }
    }
  }
</script>

<style scoped>

  .comment-item {
    border-bottom: 1px solid rgba(0, 0, 0, .12);
  }

</style>