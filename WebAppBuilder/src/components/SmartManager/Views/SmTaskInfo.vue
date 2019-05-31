<template>
  <v-container pa-0>
    <v-layout column>
      <v-flex>

        <sm-task-info-rl v-slot="{ menu, task, props }">
          <v-container pa-0>
            <v-layout>
              <v-flex xs12>
                <v-layout>
                  <v-flex xs6>
                    <v-tabs
                      centered
                      fixed-tabs
                      v-model="menu.activeTab"
                    >
                      <v-tab
                        v-for="item in menu.tabs"
                        :key="item"
                      >{{ item }}
                      </v-tab>
                    </v-tabs>
                    <v-divider></v-divider>
                    <v-tabs-items
                      v-model="menu.activeTab"
                    >
                      <v-tab-item
                        class="white"
                        v-for="item in menu.tabs"
                        :key="item"
                      >
                        <v-layout row wrap>
                          <v-flex xs2 sm1 d-flex justify-center align-center>
                            <v-img class="user-icon"
                                   v-if="task.addedPhoto"
                                   :src="task.addedPhoto"
                                   contain
                            ></v-img>
                            <v-icon
                              v-else
                              size="50"
                              color="#b3b3b3"
                            >account_circle
                            </v-icon>
                          </v-flex>
                          <v-flex xs10 sm11 py-1 pr-2>
                            <v-layout column text-xs-left>
                              <v-flex>
                                <span
                                  class="body-2 font-weight-light blue--text text--darken-2"
                                >{{ task.name }}</span>
                              </v-flex>
                              <v-flex class="caption">
                                <span>Исполнитель: {{ task.addedFio }}</span>
                              </v-flex>
                              <v-flex
                                d-flex
                                justify-space-between
                                class="caption grey--text"
                              >
                                <span class="text-xs-left">Дата добавления: {{ task.dateAdd }}</span>
                                <span class="text-xs-right">Плановая дата: {{ task.dateplan }}</span>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
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
    name: 'sm-task-info',
    props: ['taskinfo'],
    methods: {
      loadDataForComponents() {
        const datasource = {
          query: `{ smtasks { tasksGetInfo(taskId:${this.$route.params.taskId}) { id arso name status addedId dateAdd isAgree addedFio comments { date text user } dateFact dateplan  descript keyValue priority originals { id comm date file ndor user fileName typeName typeDescription } addedPhoto dateRemind docPlandate }}} `,
          schema: "SMARTMANAGER"
        }
        const key = "SMTASKINFO"
        this.$store.dispatch("LoadDataForComponent", {
          datasource,
          key
        });
      },
      // Функция для обновления данных при изменении роутинга
      beforeRouteUpdate(to, from, next) {
        this.loadDataForComponents();
      },
    },
    beforeMount() {
      this.loadDataForComponents();
    }
  }
</script>

<style scoped>

  .user-icon {
    max-height: 50px;
    max-width: 50px;
    border-radius: 50%;
  }

  .transfer {
    cursor: pointer;
  }

  .selected {
    background-color: yellowgreen;
  }
</style>
