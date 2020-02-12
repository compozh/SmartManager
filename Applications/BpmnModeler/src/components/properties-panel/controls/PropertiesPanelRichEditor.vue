<template>
  <div class="editor" ref="editor">
    <v-subheader v-if="label">{{ label }}</v-subheader>
    <quill-editor ref="quillEditor" v-model="content" :options="editorOptions"></quill-editor>
    <v-divider></v-divider>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import { fullScreenMixin } from '../../mixins';

const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
  ['fullscreen']
];

export default {
  name: 'properties-panel-rich-edit',
  mixins: [fullScreenMixin],
  components: {
    quillEditor
  },
  props: {
    label: {
      type: String
    },
    value: {
      type: String,
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
        modules: { toolbar: TOOLBAR_CONFIG },
        bounds: document.querySelector('.properties-panel-container')
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
    readonly: {
      handler(value) {
        this.changeReadOnly(value);
      }
    },
    content(value) {
      if (value !== this.value) {
        this.$emit('input', value);
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.quillEditor.quill;
    }
  },
  mounted() {
    this.changeReadOnly(this.readonly);
    this.readonly = !!this.readonly;
    const fullscreenBtn = document.querySelector('button.ql-fullscreen');
    fullscreenBtn.addEventListener('click', () => this.fullScreen = !this.fullScreen);
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.quillEditor.$el;
    },
    changeReadOnly(value) {
      this.editor.enable(!value);
      this.getFullScreenContainer().querySelector('.ql-toolbar').style.display = value ? 'none' : '';
    }
  }
};
</script>
<style lang="scss" >
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