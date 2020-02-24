<template>
  <v-container py-0>
    <v-layout column>
      <v-flex mx-2 pt-2>
        <v-card flat v-if="unit">
          <div v-if='unit.lesson.lessonType === lessonType.video'>
            <video
              ref="lessonvideo"
              class="lesson-view"
              :src="getLink(unit.content)"
              @ended="getNextTrack()"
              controls='controls'></video>
          </div>
          <div
            v-if='unit.lesson.lessonType === lessonType.text'
            class="lesson-view">
            <quill v-model="getLessonContent" :config="config"></quill>
          </div>
          <div v-if="unit.lesson.lessonType === lessonType.test">
            <test-view
              class="lesson-view"
              :test="unit"
            ></test-view>
          </div>
        </v-card>
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
    getLessonContent () {
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
.lesson-view {
  width:100%;
  min-height: 35vh;
  max-height: 75vh;
  overflow: hidden;
  border: solid lightgray 1px;
}
</style>
