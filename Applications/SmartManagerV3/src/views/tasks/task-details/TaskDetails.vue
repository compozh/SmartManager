<template>
  <v-container fluid class="fill-height">

    <v-row>
      <v-col cols="8">
        <v-card>
          <v-card-title class="py-2 primary lighten-1 white--text">
            {{ task.id }} - {{ task.name }}
          </v-card-title>
          <v-card-text>
            <div v-if="htmlDescription">
              <iframe seamless
                      scrolling="no"
                      width="100%"
                      :height="iFrameHeight1"
                      frameborder="0"
                      :srcdoc="htmlDescription"
                      @load="iFrameOnLoad(1, $event)"
                      style="pointer-events: none"/>
            </div>
            <div v-if="docTextHtml">
              <iframe seamless
                      scrolling="no"
                      width="100%"
                      :height="iFrameHeight2"
                      frameborder="0"
                      :srcdoc="docTextHtml"
                      @load="iFrameOnLoad(2, $event)"
                      style="pointer-events: none"/>
            </div>
          </v-card-text>
          <v-divider/>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-row v-for="(comment, index) in task.comments" :key="index">
            <v-col>
              <v-row>
                <v-col class="py-1 d-flex flex-nowrap">
                  <v-avatar color="grey lighten-1" class="mx-3" size="25px">
                    <fa-icon v-if="!comment.userPhoto" :icon="['fal', 'user']" inverse/>
                    <v-img v-else :src="comment.userPhoto"/>
                  </v-avatar>
                  <span class="body-2 text-truncate">{{ comment.user }}</span>
                </v-col>

                <v-col class="py-1 px-5 text-right">
                  <p class="caption mb-0">{{ comment.date }}</p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8" class="py-1">
                  <h6 class=" ma-0 pl-2 indigo--text">{{ comment.text  }}</h6>
                </v-col>
                <v-col class="py-1 px-5 d-flex align-center justify-end">
                  <fa-icon class="ml-2 orange--text" :icon="['fal', 'edit']"/>
                  <fa-icon class="ml-2 indigo--text" :icon="['fal', 'reply']"/>
                  <fa-icon class="ml-2 red--text" :icon="['fal', 'trash']"/>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-for="(val, key) in task" :key="key">
      <v-col>
        <v-card class="fill-height">
          <v-card-subtitle>
            {{ key }} - {{ val }}
          </v-card-subtitle>
          <v-divider/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskDetails',
  mixins: [tasks],
  data: () => ({
    iFrameHeight1: 250,
    iFrameHeight2: 250
  }),
  computed: {
    docTextHtml () {
      return this.parseDescription(this.task.docTextHtml)
    },
    htmlDescription () {
      return this.parseDescription(this.task.htmlDescript)
    },
    parseDescription () {
      return description => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(description, 'text/html')
        const body = doc.body.innerHTML.trim()
        return body ? description : body
      }
    }
  },
  created () {
    this.getTask()
  },
  methods: {
    iFrameOnLoad (frame, event) {
      const iFrameBody = event.path[0].contentDocument.body
      this['iFrameHeight' + frame] = iFrameBody.scrollHeight * 1.2
      iFrameBody.style.fontFamily = 'Roboto, sans-serif'
    }
  }
}
</script>

<style scoped>

</style>
