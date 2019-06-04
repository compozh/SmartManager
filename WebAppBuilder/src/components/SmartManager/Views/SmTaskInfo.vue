<template>
  <v-container fluid mx-4 pa-0>
    <v-layout justify-center>
      <v-flex xs12>
        <sm-task-info-rl v-slot="{ menu, task, props }">
          <v-container fluid pa-0 ma-0>
            <v-layout>
              <v-flex xs12>
                <v-layout>
                  <v-flex xs6>
                    <v-tabs
                      centered
                      show-arrows
                      fixed-tabs
                      v-model="menu.activeTab"
                    >
                      <v-tab
                        v-for="(item, index) in menu.tabs"
                        :key="index"
                      >{{ item.name }}({{ item.count }})
                      </v-tab>
                    </v-tabs>
                    <v-divider></v-divider>
                    <v-tabs-items
                      v-model="menu.activeTab"
                    >
                      <v-tab-item
                        class="white tab-header"
                        v-for="(item, index) in menu.tabs"
                        :key="index"
                      >
                        <component
                          :is="item.component"
                          :task="task"
                        ></component>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-flex>
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
              </v-flex>
            </v-layout>
          </v-container>
        </sm-task-info-rl>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'sm-task-info'
  }
</script>

<style scoped>
  .transfer {
    cursor: pointer;
  }

  .selected {
    background-color: yellowgreen;
  }

</style>