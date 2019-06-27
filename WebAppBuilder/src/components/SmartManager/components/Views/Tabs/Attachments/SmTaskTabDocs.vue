<template>
  <originals-viewer
    v-slot="{ originals, file, params }"
    :originals="taskDetail ? taskDetail.originals : []"
  >
    <v-container fluid pa-0>
      <v-layout class="viewer-layout" row wrap>
        <v-flex>
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row>
                <v-flex xs10 lg11>
                  <document-viewer
                    :fileUrl="file.url"
                    :fileName="file.name"
                  ></document-viewer>
                </v-flex>
                <v-flex xs2 lg1>
                  <v-layout
                    column
                    align-center
                    class="icons-container"
                  >
                    <v-flex
                      xs10
                      v-for="doc in originals"
                      :key="doc.id"
                      :class="file.id === doc.id ? 'selected' : ''"
                      @click="params.selectDocument(doc.fileName, doc.fileUrl, doc.id)"
                    >
                      <v-layout my-2 pa-2 column class="file-icon-container">
                        <v-flex>
                          <v-icon x-large>file_copy</v-icon>
                        </v-flex>
                        <v-flex class="file-title">
                          <span class="caption">{{ doc.fileName }}</span>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </originals-viewer>
</template>

<script>
  export default {
    name: "smTaskTabDocs",
    props: ['taskDetail']
  }
</script>

<style scoped>

  .viewer-layout {

  }

  .file-icon-container {
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .selected .file-icon-container {
    background: #efefef;
  }

  .file-icon-container:hover {
    cursor: pointer;
    background: #efefef;
    color: #1976d2;
  }

  .file-title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10px;
  }

  .icons-container {
    overflow-y: auto;
  }
</style>