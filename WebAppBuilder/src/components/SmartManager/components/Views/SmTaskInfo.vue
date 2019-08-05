<template>
  <sm-task-info-rl
    v-slot="{ activeTab, tabs, params, changeStatus }"
  >
    <v-container fluid pa-0 ma-0>
      <v-layout>
        <v-flex lg6 px-2>
          <v-layout wrap>
            <v-flex xs9 text-xs-left>
              <v-btn
                v-if="params.status === '*'"
                class="success ml-0"
                small depressed
                @click="changeStatus('+')"
              >
                <v-icon size="18">done</v-icon>
                <span class="caption pl-1">Выполнить</span>
              </v-btn>
              <v-btn
                v-if="params.status === ''"
                class="info ml-0"
                small depressed
                @click="changeStatus('*')"
              >
                <v-icon size="18">settings_backup_restore</v-icon>
                <span class="caption pl-1">В работу</span>
              </v-btn>
              <v-btn
                v-if="params.status === '' || params.status === '*'"
                color="error"
                small depressed
                @click="changeStatus('-')"
              >
                <v-icon size="18">close</v-icon>
                <span class="caption pl-1">Отменить</span>
              </v-btn>
            </v-flex>
            <v-flex xs3 d-flex text-xs-right>
              <sm-task-status class="py-2" :status="params.status" chip="true"></sm-task-status>
            </v-flex>
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
                  <component :is="item.component"></component>
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
              <sm-task-tab-docs v-if="params.hiddenLgAndUp"></sm-task-tab-docs>
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
    top: -13px;
    right: 10px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #B71C1C;
  }

  .tabs >>> .v-tabs__container {
    height: 35px;
  }

</style>
