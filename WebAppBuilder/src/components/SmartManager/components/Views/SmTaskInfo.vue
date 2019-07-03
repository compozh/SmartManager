<template>
  <sm-task-info-rl
    v-slot="{ activeTab, tabs, params }"
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
                  :class="{
                          'hidden-lg-and-up': item.value === 'originals',
                          'marker': item.value === 'originals' && params.hasOrig
                                 || item.value === 'comments' && params.hasComm,
                         }"
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
            <v-flex>
              <sm-task-tab-docs></sm-task-tab-docs>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </sm-task-info-rl>
</template>

<script>
  export default {
    name: 'sm-task-info'
  }
</script>

<style scoped>

  .marker:after {
    content: '';
    position: relative;
    top: -15px;
    right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #B71C1C;
  }

</style>