<template>
  <div class="editor" ref="editor">
    <v-subheader>{{ label }}</v-subheader>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">
        <v-btn-toggle :value="isActive.bold()">
          <v-btn :value="true" @click="commands.bold" flat small><v-icon>mdi-format-bold</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.italic()">
          <v-btn :value="true" @click="commands.italic" flat small><v-icon>mdi-format-italic</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.strike()">
          <v-btn :value="true" @click="commands.strike" flat small><v-icon>mdi-format-strikethrough</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.underline()">
          <v-btn :value="true" @click="commands.underline" flat small><v-icon>mdi-format-underline</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.heading({ level: 1 })">
          <v-btn :value="true" @click="commands.heading({ level: 1 })" flat small><v-icon>mdi-format-header-1</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.heading({ level: 2 })">
          <v-btn :value="true" @click="commands.heading({ level: 2 })" flat small><v-icon>mdi-format-header-2</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.heading({ level: 3 })">
          <v-btn :value="true" @click="commands.heading({ level: 3 })" flat small><v-icon>mdi-format-header-3</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.bullet_list()">
          <v-btn :value="true" @click="commands.bullet_list" flat small><v-icon>mdi-format-list-bulleted</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.ordered_list()">
          <v-btn :value="true" @click="commands.ordered_list" flat small><v-icon>mdi-format-list-numbered</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.blockquote()">
          <v-btn :value="true" @click="commands.blockquote" flat small><v-icon>mdi-format-quote-close</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle :value="isActive.code_block()">
          <v-btn :value="true" @click="commands.code_block" flat small><v-icon>code</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-model="toggle">
          <v-btn :value="false" @click="() => { commands.horizontal_rule(); $nextTick(() => toggle = []); }" flat small><v-icon>mdi-minus</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-model="toggle">
          <v-btn :value="false" @click="() => { commands.undo(); $nextTick(() => toggle = []); }" flat small><v-icon>undo</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-model="toggle">
          <v-btn :value="false" @click="() => { commands.redo(); $nextTick(() => toggle = []); }" flat small><v-icon>redo</v-icon></v-btn>
        </v-btn-toggle>

        <v-btn-toggle v-model="toggle">
          <v-btn :value="false" @click="() => { fullScreen = !fullScreen; $nextTick(() => toggle = []); }" flat small>
            <v-icon v-if="fullScreen">fullscreen_exit</v-icon>
            <v-icon v-else>fullscreen</v-icon>
          </v-btn>
        </v-btn-toggle>
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
      editor: null,
      toggle: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        if (this.editor && value === this.editor.getHTML()) {
          return;
        }
        this.createEditor();
      }
    },
    readonly(value) {
      this.editor.setOptions({ editable: !value });
    }
  },
  methods: {
    getFullScreenContainer() {
      return this.$refs.editor;
    },
    createEditor() {
      if (this.editor) {
        this.editor.destroy();
      }

      this.editor = new Editor({
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
      });
    }
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
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

.menubar .v-btn {
  padding: 0 2px;
  opacity: 1;
}

.menubar .v-icon {
  color: rgba(0,0,0,.54) !important;
}
</style>