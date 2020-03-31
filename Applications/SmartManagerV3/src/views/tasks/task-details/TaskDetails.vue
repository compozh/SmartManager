<template>
    <Split style="flex-basis: 0; border-radius: 5px;"
           class="flex-grow-1 overflow-hidden white">
      <!-- LEFT CONTENT AREA -->
      <SplitArea class="d-flex flex-column">
        <div class="side-header pa-5">
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
        </div>
        <perfect-scrollbar class="pa-5">
          <div>
            <v-chip small color="#FACCCC"
                    text-color="red">
              <fa-icon :icon="['fal', 'tag']" class="mr-2"/>
              front-end
            </v-chip>
            <fa-icon :icon="['fal', 'tags']" class="mx-4"/>
            <fa-icon :icon="['fal', 'ballot']"/>
          </div>
          <h3 class="font-weight-light">
            {{ task.name }}
          </h3>
          <fa-icon :icon="['fal', 'print']"/>
          <fa-icon :icon="['fal', 'history']" class="mx-3"/>
          <fa-icon :icon="['fal', 'expand-alt']"/>
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
          <p>{{ task.descript }}</p>
          <span>Progress: 0%</span>
          <span class="mr-2">direction:</span>
          <v-chip small color="#81B1FF"
                  label text-color="white">
            SmartManager Web
          </v-chip>
          <v-divider></v-divider>

          <div v-for="i in 20" :key="i" class="white ma-2 pa-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, facilis.
          </div>

        </perfect-scrollbar>
      </SplitArea>
      <!-- RIGHT CONTENT AREA -->
      <SplitArea class="d-flex flex-column">
        <v-tabs v-model="tab" class="side-header">
          <v-tab>Attachments</v-tab>
          <v-tab>Comments</v-tab>
        </v-tabs>
        <perfect-scrollbar class="pa-3">

          <div v-for="i in 150" :key="i" class="white ma-2 pa-2">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, facilis.
          </div>

        </perfect-scrollbar>
      </SplitArea>
    </Split>
</template>

<script>
import { tasks } from '@/mixins/units'

export default {
  name: 'TaskDetails',
  mixins: [tasks],
  data: () => ({
    tab: null,
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

 .sticky-top {
   position: sticky;
   top: 0;
 }

 .side-header {
   display: flex;
   flex: 1 0 75px;
   align-items: center;
   border-bottom: 1px solid #e5e5e5;
 }

</style>
