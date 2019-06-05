<template>
  <originals-viewer
    v-slot="{ originals, file, params }"
    :originals="task.originals"
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
                      v-for="doc in originals"
                      :key="doc.id"
                      class="transfer"
                      :class="file.id === doc.id ? 'selected' : ''"
                      @click="params.selectDocument(doc.fileName, doc.file, doc.id)"
                    >
                      <v-layout my-2 pa-2 column class="file-icon-container">
                        <v-flex>
                          <v-icon size="50">file_copy</v-icon>
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
    props: ['task']
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
  .file-icon-container:hover {
    cursor: pointer;
    background: #efefef;
    color: #1976d2;
  }

  .file-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icons-container {
    overflow-y: auto;
  }
</style>