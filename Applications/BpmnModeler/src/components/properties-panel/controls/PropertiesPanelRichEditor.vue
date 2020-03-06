<template>
  <div class="editor" ref="editor">
    <v-subheader v-if="label">{{ label }}</v-subheader>
    <quill-editor ref="quillEditor" v-model="content" :options="editorOptions" @ready="onEditorReady($event)"></quill-editor>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';

export default {
  name: 'properties-panel-rich-edit',
  components: {
    quillEditor: async () => (await import(/* webpackChunkName: "quill" */ 'vue-quill-editor')).quillEditor
  },
  props: {
    label: {
      type: String
    },
    value: {
      required: true
    },
    readonly: {
      type: Boolean
    }
  },
  data() {
    return {
      isfullscreen: false,
      fullscreenEnabled: document.fullscreenEnabled,
      editorOptions: {
        theme: 'bubble',
        modules: {

          toolbar: ['bold', 'italic', 'underline', 'strike']
        },
        bounds: document.querySelector('.properties-panel-container'),
        placeholder: this.$t('bpmn.labels.InsertTextHere')
      },
      content: ''
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (value === this.content) {
          return;
        }
        this.content = value;
      }
    },
    readonly(value) {
      this.changeReadOnly(value);
    },
    content(value) {
      if (value !== this.value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    onEditorReady(quill) {
      quill.enable(!this.readonly);
    }
  }
};
</script>
<style lang="scss" scoped>
  .quill-editor,
  .quill-code {
    height: 20rem;
  }

.quill-editor {
  padding-bottom: 20px;
  background-color: white;
  .ql-editor {
    border-bottom: 1px solid silver;
    border-top: 1px solid silver;
    &:focus {
      border-bottom: 1px solid #1976d2;
      border-top: 1px solid #1976d2;
    }
  }
}
.ql-bubble .ql-toolbar .ql-formats {
  margin: 4px 5px 4px 0px;
  &:first-child {
    margin-left: 0px;
  }
}
.quill-editor:fullscreen {
  padding: 20px;
}

.quill-editor:fullscreen .ql-container {
  height: calc(100% - 40px);
}

.quill-editor:fullscreen .ql-editor {
 overflow: auto;
}

.editor .v-subheader {
  padding: 0;
  height: 24px;
  font-size: 12px;
  font-weight: 400;
}

.editor:fullscreen .v-subheader {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.ql-fullscreen:focus{
  outline: none;
}

.ql-fullscreen::after{
  content: "\F293";
  font-family: "Material Design Icons";
  font-size: 25px;
  position: relative;
  top: -13px;
  left: -12px;
}

.ql-container.ql-snow.ql-disabled {
  border-top: 1px solid #ccc !important;
}

.ql-blank::before {
  content: '' !important;
}
</style>
