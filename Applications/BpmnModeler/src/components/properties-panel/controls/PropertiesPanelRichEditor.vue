<template>
  <div class="editor" ref="editor">
    <v-subheader>{{ label }}</v-subheader>
    <quill-editor ref="quillEditor" v-model="content" :options="editorOptions"></quill-editor>

    <v-divider></v-divider>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';

import { fullScreenMixin } from '../../mixins';


export default {
  name: 'properties-panel-rich-edit',
  mixins: [ fullScreenMixin ],
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
      editorOptions: { },
      content: ''
    }
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
        this.editor.enable(!value);
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
      return this.$refs.quillEditor.quill
    }
  },
  mounted() {
    this.editor.enable(!this.readonly);
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.quillEditor;
    },
  }
}
</script>
<style>
.editor {
  padding-bottom: 20px;
  background-color: white;
}

.editor:fullscreen {
  padding: 20px;
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
</style>