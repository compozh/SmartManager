<template>
  <v-container py-0>
    <v-layout column fill-height>
      <v-flex v-if="unit" class="height100">
        <div class="height100" v-if='unit.lesson.lessonType === lessonType.video'>
          <video
            ref="lessonvideo"
            class="lesson-content-view"
            :src="getLink(unit.content)"
            @ended="getNextTrack()"
            controls='controls'></video>
        </div>
        <div
          v-if='unit.lesson.lessonType === lessonType.text'
          class="height100 lesson-content-view">
          <quill v-model="lessonContent" :config="config"></quill>
        </div>
        <div class="height100"
          v-if="unit.lesson.lessonType === lessonType.test">
          <test-view
            class="lesson-content-view"
            :testGuid="unit.lesson.surveyId" />
        </div>
        <!-- <div class="height100"
          v-if="unit.lesson.lessonType === lessonType.text">
          <task-view
            class="lesson-content-view"
            :task="lessonContent"
            :config="config" />
        </div> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {lessonType, addTicketToLink} from '../helpers/lesson.js'

export default {
  name: 'lesson-view',
  props: {
    unit: Object,
    startPlay: Boolean
  },
  mounted () {
    this.videoPlayer = this.$refs.lessonvideo
  },
  updated () {
    if ( this.startPlay ) {
      this.videoPlayer.play()
    }
  },
  data () {
    return {
      // HTMLMediaElement
      videoPlayer: null,
      // quilljs config
      config: {
        readOnly: true,
        placeholder: '',
        modules: {
          syntax: false,
          toolbar: null
        },
        theme: 'snow',
      },
      lessonType: lessonType
    }
  },
  methods: {
    getNextTrack () {
      this.$emit('ended')
    },
    getLink(content) {
      return addTicketToLink(content)
    }
  },
  computed: {
    lessonContent () {
      let content = null
      if (this.unit.content) {
        try {
          content = JSON.parse(this.unit.content)
          return content
        } catch (error) {
          console.log('Отсутствует контент урока!')
        }
      }
      return { ops: [{insert: 'Контент отсутствует.'}]}
    }
  }
}
</script>

<style>
.height100 {
  height: 100%;
  /* overflow-y: auto; */
}
.lesson-content-view {
  width:100%;
  height: 100%;
}
</style>
