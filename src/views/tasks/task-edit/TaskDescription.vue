<template>
  <div>
    <quill-editor ref="editor"
                  v-if="taskEditable || htmlDescription"
                  :disabled="!taskEditable"
                  v-model="htmlDescription"
                  :options="editorOption"
                  class="mb-5"/>
    <div v-if="docTextHtml">
      <iframe seamless
              scrolling="no"
              width="100%"
              :height="iFrameHeight"
              frameborder="0"
              :srcdoc="docTextHtml"
              @load="iFrameOnLoad"
              style="pointer-events: none"/>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'TaskDescription',
  components: {
    quillEditor
  },
  model: {
    prop: 'description'
  },
  props: {
    description: String,
    docTextHtml: String
  },
  data: () => ({
    initDescription: '',
    iFrameHeight: 250
  }),
  computed: {
    htmlDescription: {
      get () {
        return this.description
      },
      set (description) {
        const setDescription = this.parseDescription(description)
        const taskDescription = this.parseDescription(this.description)
        const initDescription = this.parseDescription(this.initDescription)
        if (!this.compareDescription(setDescription, taskDescription) &&
            !this.compareDescription(setDescription, initDescription)) {
          if (!this.taskChanged) {
            this.$store.commit('SET_TASK_CHANGED', true)
          }
          this.$emit('input', `<body>${description}</body>`)
        }
      }
    },
    editorOption () {
      return {
        theme: 'bubble',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ align: [] }],
            ['clean'] // remove formatting button
          ]
        },
        placeholder: this.$t('tasks.description') + '...'
      }
    },
    taskEditable () {
      return this.$store.state.tasks.taskEditable
    },
    taskChanged () {
      return this.$store.state.tasks.taskChanged
    }
  },
  watch: {
    // Write init task description for backup
    description (description) {
      const desc = description ? description.trim() : ''
      if (desc.trim() && !this.taskChanged) {
        this.initDescription = desc
      }
    },
    // Update init task description for backup
    taskChanged (changed) {
      if (!changed) {
        this.initDescription = this.description
      }
    }
  },
  mounted () {
    if (this.taskEditable) {
      const quill = this.$refs.editor.quill
      // console.log('getFormat', quill.getFormat())
      this.$refs.editor.quill.blur()
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'api') {
          // console.log('An API call triggered this change.')
        } else if (source === 'user') {
          console.log('A user action triggered this change.')
        }
        // console.log('delta', delta)
        // console.log('oldDelta', oldDelta)
      })
      // console.log(this.$refs.editor.quill)
    }
  },
  methods: {
    iFrameOnLoad (frame) {
      const iFrameBody = frame.path[0].contentDocument.body
      this.iFrameHeight = Math.round(iFrameBody.scrollHeight * 1.2)
      iFrameBody.style.fontFamily = '"Proxima Nova Regular", sans-serif'
      iFrameBody.style.margin = '0'
    },
    parseDescription (description) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(description, 'text/html')
      return doc.body.innerHTML
    },
    compareDescription (desc1, desc2) {
      const transform = desc => desc.trim().split('').sort().join()
      return transform(desc1) === transform(desc2)
    }
  }
}
</script>

<style scoped>

  .quill-editor >>> .ql-editor {
    padding: 0;
  }

  .quill-editor >>> .ql-container {
    font-style: normal;
  }

  .quill-editor >>> .ql-editor::before {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #cccccc;
    letter-spacing: 1px;
    left: 0;
  }

  .quill-editor >>> .ql-editor p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    left: 0;
  }

  .quill-editor >>> .ql-tooltip {
    z-index: 99;
  }

</style>
