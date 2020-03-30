<template>
  <v-container fluid class="fixed-height">
    <v-row no-gutters class="full-height">
      <v-col class="full-height">
        <Split :gutterSize="4">
          <SplitArea class="d-flex">
            <!-- LEFT CONTENT AREA -->
            <perfect-scrollbar tag="v-row" class="ma-0 white align-content-start">
              <v-col cols="12">
                <v-card outlined class="pa-2">
                  <v-btn small depressed color="primary" class="mr-2">IN PROGRESS</v-btn>
                  <v-btn small outlined color="success" class="mr-5">
                    <fa-icon :icon="['fal', 'check']" size="lg"/>
                  </v-btn>
                  <v-avatar color="grey lighten-1" class="mx-3" size="30px">
                    <fa-icon v-if="!task.performerPhoto" :icon="['fal', 'user']" inverse/>
                    <v-img v-else :src="task.performerPhoto"/>
                  </v-avatar>
                  <span class="body-2">{{ task.performer }}</span>
                  <fa-icon :icon="['fal', 'flag']" size="lg" class="ml-5" color="orange"/>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card outlined class="pa-2">
                  <v-chip small color="#FACCCC"
                          text-color="red">
                    <fa-icon :icon="['fal', 'tag']" class="mr-2"/>
                    front-end
                  </v-chip>
                  <fa-icon :icon="['fal', 'tags']" class="mx-4"/>
                  <fa-icon :icon="['fal', 'ballot']"/>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card outlined lass="pa-2">
                  <v-card-title class="font-weight-light">
                    {{ task.name }}
                  </v-card-title>
                </v-card>
              </v-col>
              <v-col cols="12" class="py-0 text-right">
                <fa-icon :icon="['fal', 'print']"/>
                <fa-icon :icon="['fal', 'history']" class="mx-3"/>
                <fa-icon :icon="['fal', 'expand-alt']"/>
              </v-col>
              <v-col cols="12">
                <v-card outlined lass="pa-2">
                  <div v-if="htmlDescription" class="mail__content break-words mt-8 mb-4">
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
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card outlined lass="pa-2">
                  <v-card-subtitle>
                    {{ task.descript }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
              <v-col cols="12" class="body-2">
                <span>Progress: 0%</span>
                <v-divider vertical class="mx-3"></v-divider>
                <span class="mr-2">direction:</span>
                <v-chip small color="#81B1FF"
                        label text-color="white">
                  SmartManager Web
                </v-chip>
              </v-col>
              <v-divider></v-divider>
            </perfect-scrollbar>
          </SplitArea>
          <SplitArea class="d-flex">
            <!-- RIGHT CONTENT AREA -->
            <perfect-scrollbar tag="v-row" class="ma-0 blue lighten-3">
              <v-col cols="12">
                <v-card outlined>
                  <v-tabs v-model="tab">
                    <v-tab>Attachments</v-tab>
                    <v-tab>Comments</v-tab>
                  </v-tabs>
                </v-card>
              </v-col>
            </perfect-scrollbar>
          </SplitArea>
        </Split>
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
    },
    onDragStart (size) {
      console.log('Drag Start', size) // callback existing size
    },
    onDrag (size) {
      console.log('on Drag', size) // callback new size
    },
    onDragEnd (size) {
      console.log('Drag End', size) // callback new size
    }
  }
}
</script>

<style scoped>
  .fixed-height {
    height: calc(100vh - 48px);
  }

  .full-height {
    height: 100%;
  }

</style>
