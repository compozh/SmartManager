<template>
  <v-container pa-0>
    <v-layout row wrap>
      <v-flex xs6>
        <v-layout column>
          <v-flex>
            <p class="headline blue-grey--text">DOCUMENT VIEWER</p>
          </v-flex>
          <v-divider></v-divider>
          <v-flex xs6>
            <originals-viewer
              v-slot="{ originals, fileName, fileUrl, fileId, selectDocument }"
              :originals="task.originals"
            >
              <div>
                <v-layout column>
                  <v-flex>
                    <div
                      v-for="doc in originals"
                      :key="doc.id"
                    >
                      <span
                        class="transfer"
                        :class="fileId === doc.id ? 'selected' : ''"
                        @click="selectDocument(doc.fileName, doc.file, doc.id)"
                      >
                        {{ doc.fileName }}
                      </span>
                    </div>
                  </v-flex>
                  <v-flex px-2>
                    <documentViewer
                      :fileName="fileName"
                      :fileUrl="fileUrl"
                    ></documentViewer>
                  </v-flex>
                </v-layout>
              </div>
            </originals-viewer>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
  </v-container>
</template>

<script>
  export default {
    name: "smTaskTabDocs",
    props: ['task']
  }
</script>

<style scoped>

</style>