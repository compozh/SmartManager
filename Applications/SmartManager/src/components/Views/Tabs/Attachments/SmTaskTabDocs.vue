<template>
  <sm-document-viewer-rl
    v-slot="{ originals, file, select, component, params }"
    >
    <v-container fluid pa-0>
      <v-layout
        class="viewer-layout">
        <v-flex xs12 mt-2 class="view-container">
          <component :is="component" :url="file.url"></component>
          <sm-empty-state v-if="!component">{{ $t('sm.messages.noFiles') }}</sm-empty-state>
        </v-flex>
        <v-flex mt-2 class="icons-container">
          <v-layout>
            <v-flex
              xs12
              class="file-icon-container file-add px-2"
            >
              <file-upload-document-viewer></file-upload-document-viewer>
            </v-flex>
          </v-layout>
          <v-layout column>
            <v-flex
              class="file-icon-container px-2"
              xs12
              v-for="doc in originals"
              :key="doc.id"
              :class="file.id === doc.id ? 'selected' : ''"
              @click="select(doc)"
            >
              <div class="file-icon">
                <v-icon
                  :color="params.iconColor(doc.fileExt)"
                  size="50">insert_drive_file
                </v-icon>
                <span
                  class="icon-extension"
                  :style="{color: params.iconColor(doc.fileExt)}"
                >{{ doc.fileExt }}</span>
              </div>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="caption file-title">{{ doc.fileName }}</span>
                </template>
                <span>{{ doc.fileName }}</span>
              </v-tooltip>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </sm-document-viewer-rl>
</template>

<script>
export default {
  name: 'sm-task-tab-docs'
}
</script>

<style scoped>
  .viewer-layout {
    height: 86vh;
  }

  .hidden-md-and-down .viewer-layout {
    height: 92vh;
  }

  .view-container {
    height: inherit;
  }

  .icons-container {
    overflow-y: auto;
  }

  .file-icon-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    width: 100px;
    transition: background-color 0.2s;
  }

  .file-icon-container:hover {
    cursor: pointer;
    background: #efefef;
    box-shadow: inset 1px 1px 0 0 rgba(100, 121, 143, 0.122),
    inset -1px -1px 0 0 rgba(100, 121, 143, 0.122);
  }

  .file-icon-container:hover .file-title {
    color: #1976d2;
  }

  .file-icon-container.selected {
    background: #efefef;
    box-shadow: inset 1px 1px 0 0 rgba(100, 121, 143, 0.122),
    inset -1px -1px 0 0 rgba(100, 121, 143, 0.122);
  }

  .file-add {
    position: sticky;
    padding: 0 !important;
  }

  .file-icon {
    position: relative;
    width: min-content;
  }

  .icon-extension {
    position: absolute;
    bottom: 1px;
    right: 5px;
    font-size: 15px;
    text-shadow: 1px 1px 0 #fff,
    1px -1px 0 #fff,
    -1px 1px 0 #fff,
    -1px -1px 0 #fff;
  }

  .file-title {
    width: 100%;
    max-height: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>
