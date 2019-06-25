<template>
  <v-container fluid pa-0 pl-3>
    <v-layout justify-center>
      <v-flex xs12>
        <sm-task-info-rl
          v-slot="{ activeTab, tabs, taskDetail }"
        >
          <v-container fluid pa-0 ma-0>
            <v-layout>
              <v-flex lg6>
                <v-layout>
                  <v-flex xs12>
                    <v-tabs
                      class="tabs"
                      show-arrows
                      v-model="activeTab.value"
                    >
                      <v-tab
                        v-for="item in tabs"
                        :key="item.value"
                        :class="{ 'hidden-lg-and-up': item.value === 'originals' }"
                      >{{ item.name }}
                      </v-tab>
                    </v-tabs>
                    <v-tabs-items
                      v-model="activeTab.value"
                    >
                      <v-tab-item
                        class="white tab-header"
                        v-for="item in tabs"
                        :key="item.value"
                      >
                        <component
                          :is="item.component"
                          :class="{ 'hidden-lg-and-up': item.value === 'originals' }"
                          :task-detail="taskDetail"
                        ></component>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex
                xs6
                hidden-md-and-down
              >
                <v-layout column>
                  <v-flex document-viewer-container >
                    DOCUMENT VIEWER
                  </v-flex>
                  <v-flex>
                    <sm-task-tab-docs :task-detail="taskDetail"></sm-task-tab-docs>
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
  .tabs >>> .v-tabs__container {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
  }

  .selected {
    background-color: yellowgreen;
  }

  .document-viewer-container {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: cadetblue;
    background: aliceblue;
  }

</style>