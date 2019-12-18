<template>
	<v-container fluid mt-5 ma-0 pa-0>
    <v-layout pt-3 align-center justify-center row fill-height>
      <v-flex lg8 md10 sm10 xs12 class='white'>
        <v-breadcrumbs>
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item	v-for="item in items"	v-if="!item.disabled" :key="item.target.name" style='color: red !important' :to="item.target" :exact="true">{{ item.text }}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-divider/>
      </v-flex>
    </v-layout>
    <v-layout align-center justify-center row fill-height>
      <v-flex lg8 md10 sm10 xs12>
        <v-card class='py-2' v-if="lesson">
          <h1 class='display-1 font-weight-regular pb-2 ml-2'>{{lesson.name}}</h1>
          <v-flex xs12 v-if="content">
            <quill v-model="content" :config="config"></quill>
          </v-flex>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>

var courseName = "";
var moduleName = "";
var lessonData = { name: "" };

var links = [];
links.push({
    text: courseName,
    disabled: true,
    target: { name: "LMSCOURSEDETAILS", params: { courseGuid: undefined } }
  });
links.push({
    text: moduleName,
    disabled: false,
    target: { name: "LMSMODULEDETAILS", params: { moduleGuid: undefined } }
  });
links.push({
    text: lessonData.name,
    disabled: false,
    target: { name: "lmslesson", params: { lessonGuid: undefined } }
  });

export default {
  name: "lms-lesson",
    data() {
      return {
        //content: content,
        config: {
          readOnly: true,
          placeholder: "",
          modules: {
            syntax: false,
            toolbar: false
          },
          theme: "snow",
        },
        items: links,
        lessonGuid: ''
      }
  },

  created() {
    this.lessonGuid = this.$route.params.lessonGuid
    this.getLessonContent(this.lessonGuid)
  },
  methods: {
    getLessonContent(lessonGuid) {
      this.$store.dispatch('lms/getLessonContent', lessonGuid)
    }
  },
  computed: {
    content() {
      return this.$store.getters['lms/lessonContent']
    },
    lesson() {
      return this.$store.getters['lms/unit']
    }
  },
  beforeCreate() {
    links[0].target.params.courseGuid = this.$route.params.courseGuid;
    links[1].target.params.moduleGuid = this.$route.params.moduleGuid;
    links[2].target.params.lessonGuid = this.$route.params.lessonGuid;
    var routeParams = this.$route.params;
    if (routeParams) {
      courseName = routeParams.courseName;
      moduleName = routeParams.moduleName;
      if (routeParams.lesson) {
        lessonData.name = routeParams.lesson.name;
      }
    }
  },
}
</script>

<style scoped>
.v-breadcrumbs__item {
  margin: 0px 0px 6px 8px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
video::-internal-media-controls-download-button {
    display:none;
}

video::-webkit-media-controls-enclosure {
    overflow:hidden;
}

video::-webkit-media-controls-panel {
    width: calc(100% + 30px); /* Adjust as needed */
}
</style>

<style>
.ql-container.ql-snow {
  border: none;
}
.ql-snow .ql-editor pre.ql-syntax {
  background-color: #f6f9fc;
  color: #000000;
  overflow: visible;
}
.ql-video {
    display: block;
    height: 352px;
    margin-left: auto;
    margin-right: auto;
    width: 625px;
}
.ql-container {
    font-family: Roboto,Helvetica,Arial,sans-serif;
    font-size: 16px;
}
</style>

<style>
.resp-iframe {
    border: 0;
    height: 600;
    left: 0;
    position: relative;
    top: 0;
    width: 100%;
}
</style>
