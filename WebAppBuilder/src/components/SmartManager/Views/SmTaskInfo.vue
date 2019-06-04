<template>
  <v-container fluid mx-4 pa-0>
    <v-layout justify-center>
      <v-flex xs12>
        <sm-task-info-rl
          v-slot="{ activeTab, tabs, task, props }"
        >
          <v-container fluid pa-0 ma-0>
            <v-layout>
              <v-flex xs12>
                <v-layout>
                  <v-flex xs12>
                    <v-tabs
                      show-arrows
                      v-model="activeTab.value"
                    >
                      <v-tab
                        v-for="item in tabs"
                        :key="item.value"
                      >{{ item.name }}
                      </v-tab>
                    </v-tabs>
                    <v-divider></v-divider>
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
                          :task="task"
                        ></component>
                      </v-tab-item>
                    </v-tabs-items>
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