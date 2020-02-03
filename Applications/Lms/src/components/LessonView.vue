<template>
  <v-container fluid>
    <v-layout column>
      <v-flex mx-2>
        <v-card flat v-if="unit">
          <h3>Просмотр урока <span class="indigo--text">{{unit.lesson.name}}</span></h3>
          <div v-if='unit.lesson.lessonType===lessonType.video'>
            <video class="lesson-video" :src="unit.content" controls='controls'></video>
          </div>
          <div v-if='unit.lesson.lessonType===lessonType.text'>
            <quill v-model="getLessonContent" :config="config"></quill>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'lesson-view',
  props: {
    unit: Object
  },
  data() {
    return {
      // quilljs config
      config: {
        readOnly: true,
        placeholder: '',
        modules: {
          syntax: false,
          toolbar: false
        },
        theme: 'snow',
      },
      lessonType: {
        text: 0,
        video: 1,
        test: 2
      }
    }
  },
  computed: {
    getLessonContent() {
      return JSON.parse(this.unit.content)
    }
  }
}
</script>

<style>
.lesson-video {
  width: 100%;
  height: 100%;
  border: solid lightgray 1px;
}
</style>
