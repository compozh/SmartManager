<template>
  <div @click="$emit('click', question.id)">
    <v-card flat class="my-2">
      <v-layout class="border card">
        <v-flex shrink>
          <v-card-text>
            <v-avatar v-if="question.avatar">
              <img :src="question.avatar" alt="avatar">
            </v-avatar>
            <v-avatar v-else :class="color()">
              <span class="white--text headline">{{answer.authorName[0]}}</span>
            </v-avatar>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex px-3 py-3>
              <v-layout fill-heigh align-center justify-space-between>
                <v-flex grow>
                  <div class="body-2 indigo--text text-darken-1">{{question.authorName}}</div>
                </v-flex>
                <v-flex shrink>
                  <div class="body-2">{{question.dateTime}}</div>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex pl-3 >
              <v-layout align-center>
                <v-flex>
                  <div class="body-2">{{question.title}}</div>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink>
                  <social-counter
                    :icon="commentIcon"
                    :vouts="question.answersQty"
                    :iconColor="iconColor"
                    :voutsColor="voutsColor"></social-counter>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex pl-3 class="border-top">
              <!-- Likes, dislikes, oldest -->
              <v-layout nowrap>
                <v-flex shrink>
                  <social-counter
                    :icon="likesIcon"
                    :vouts="question.voutsUpQty"
                    :iconColor="iconColor"
                    :voutsColor="voutsColor"></social-counter>
                </v-flex>
                <v-flex>
                  <social-counter
                    :icon="dislikesIcon"
                    :vouts="question.voutsDownQty"
                    :iconColor="iconColor"
                    :voutsColor="voutsColor"></social-counter>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import SocialCounter from './SocialCounter'
import {colors, randomColor} from '../helpers/questions'

export default {
  name: 'question-card',
  components: {
    SocialCounter
  },
  props: {
    question: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      commentIcon: 'comment',
      likesIcon: 'thumb_up_alt',
      dislikesIcon: 'thumb_down_alt',
      iconColor: 'info',
      voutsColor: 'blue--text text-darken-1',
      colors: colors
    }
  },
  methods: {
    color() {
      return randomColor(this.colors)
    }
  }
}
</script>

<style>
.border {
  border: solid 1px lightgray;
  border-radius: 5px;
}
.border-top {
  border-top: solid 1px lightgray;
}
.border-top-bottom {
  border-top: solid 1px lightgray;
  border-bottom: solid 1px lightgray;
}
.card:hover {
  cursor: pointer;
  background: rgba(0,0,0,0.1);
}
</style>
