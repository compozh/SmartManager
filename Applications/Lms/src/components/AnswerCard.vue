<template>
  <div>
    <v-card flat class="my-2">
      <v-layout class="border">
        <v-flex shrink>
          <v-card-text>
            <v-avatar v-if="answer.avatar">
              <img :src="answer.avatar" alt="avatar">
            </v-avatar>
            <v-avatar v-else :color="color()">
              <span class="white--text headline">{{answer.authorName[0]}}</span>
            </v-avatar>
          </v-card-text>
        </v-flex>
        <v-flex>
          <v-layout column>
            <v-flex>
              <v-layout fill-height align-center>
                <v-flex grow>
                  <v-layout column>
                    <v-flex>
                      <div class="body-2">{{answer.authorName}}</div>
                    </v-flex>
                    <v-flex>
                      <div class="grey--text text-darken-1">
                        {{answer.prescription}}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <v-flex shrink>
                  <v-layout column>
                    <v-flex>
                      <social-counter
                        :icon="likesIcon"
                        :vouts="answer.voutsUpQty"
                        :iconColor="likesIconColor"
                        :voutsColor="likeColor"></social-counter>
                    </v-flex>
                    <v-flex>
                      <social-counter
                        :icon="dislikesIcon"
                        :vouts="answer.voutsDownQty"
                        :iconColor="dislikesIconColor"
                        :voutsColor="dislikeColor"></social-counter>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-card-text>
                <div v-html="answer.content"></div>
              </v-card-text>
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
  name: 'answer-card',
  components: {
    SocialCounter
  },
  props: {
    answer: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      likesIconColor: 'primary',
      dislikesIconColor: 'error',
      likeColor: 'blue--text text-darken-1',
      dislikeColor: 'red--text text-darken-1',
      likesIcon: 'thumb_up_alt',
      dislikesIcon: 'thumb_down_alt',
      colors: colors
    }
  },
  methods: {
    color() {
      return  randomColor(this.colors)
    }
  }
}
</script>

<style>

</style>
