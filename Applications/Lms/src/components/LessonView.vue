<template>
  <v-container fluid>
    <v-layout column>
      <v-flex mx-2>
        <v-card flat v-if="lesson">
          <h3>Просмотр урока <span class="indigo--text">{{lesson.name}}</span></h3>
          <div v-if='lesson.type==="video"'>
            <video class="lesson-video" :src="lesson.content" controls='controls'></video>
          </div>
          <div v-if='lesson.type==="html"'>
            <quill v-model="lesson.content" :config="config"></quill>
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
    lesson: Object
  },
  data() {
    return {

    }
  },
  methods: {

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
