<template>
  <div class="editor" ref="editor">
    <v-subheader>{{ label }}</v-subheader>

    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <v-icon>mdi-format-bold</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <v-icon>mdi-format-italic</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <v-icon>mdi-format-strikethrough</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <v-icon>mdi-format-underline</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          <v-icon>mdi-format-header-1</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          <v-icon>mdi-format-header-2</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          <v-icon>mdi-format-header-3</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <v-icon>mdi-format-list-numbered</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <v-icon>mdi-format-quote-close</v-icon>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <v-icon>code</v-icon>
        </button>

        <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <v-icon>mdi-minus</v-icon>
        </button>

        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <v-icon>undo</v-icon>
        </button>

        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <v-icon>redo</v-icon>
        </button>

        <button @click="fullScreen = !fullScreen" :title="$t('bpmn.labels.ToggleFullScreen')" v-if="fullscreenEnabled">
          <v-icon v-if="fullScreen">fullscreen_exit</v-icon>
          <v-icon v-else>fullscreen</v-icon>
        </button>

      </div>
    </editor-menu-bar>

    <editor-content class="editor__content" :editor="editor" />

    <v-divider></v-divider>
  </div>
</template>

<script>
import { fullScreenMixin } from '../../mixins';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  ListItem,
  OrderedList,
  BulletList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  TrailingNode
} from 'tiptap-extensions';

export default {
  name: 'properties-panel-rich-edit',
  mixins: [ fullScreenMixin ],
  components: {
    EditorContent,
    EditorMenuBar,
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
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new Code(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new BulletList(),
          new Link(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new TrailingNode({
            node: 'paragraph',
            notAfter: ['paragraph'],
          }),
        ],
        editable: !this.readonly,
        content: this.value,
        onUpdate: (e) => {
          this.$emit('input', e.getHTML());
        }
      }),
    }
  },
  watch: {
    value(value) {
      this.editor.setContent(value);
    },
    readonly(value) {
      this.editor.setOptions({ editable: !value });
    }
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.editor;
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
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

.editor:fullscreen .editor__content {
  height: calc(100% - 80px);
}

.editor:fullscreen .editor__content > div {
  height: 100%;
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

.editor .menubar__button {
  padding: 0px 3px;
}
</style>