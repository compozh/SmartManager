<template>
  <sm-task-info-rl
    v-slot="{ activeTab, tabs, task, params, events }"
  >
    <v-container fluid pa-0 ma-0>
      <sm-task-add-form
        v-if="params.taskAddForm"
        :parent="task.id"
      ></sm-task-add-form>
      <v-layout v-else>
        <v-flex lg6 px-2>
          <v-layout wrap>
            <v-flex>
              <v-layout>
                <v-flex shrink>
                  <v-btn
                    class="info ml-0"
                    small depressed
                    @click="events.openTaskAddForm"
                  >
                    <v-icon size="18">add_to_photos</v-icon>
                    <span class="caption pl-1">Добавить подзадачу</span>
                  </v-btn>
                </v-flex>
                <v-flex
                  v-if="task.isGenerate"
                  d-flex shrink
                  align-center
                >
                  <v-menu open-on-hover offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="main-btn mx-0"
                        color="error"
                        small depressed
                        @click="events.changeStage(0)"
                      >
                        <v-icon size="18">close</v-icon>
                        <span class="caption pl-1">Отклонить</span>
                      </v-btn>
                      <v-btn
                        class="menu-btn mx-0"
                        color="error"
                        small depressed
                        dark
                        v-on="on"
                      >
                        <v-icon>arrow_drop_down</v-icon>
                      </v-btn>
                    </template>
                    <v-list pa-0>
                      <v-list-tile
                        @click.stop="dialog = true"
                        @click="stage = 0"
                      >
                        <v-list-tile-title>Отклонить с коментарием</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                  <v-menu open-on-hover offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        class="main-btn mr-0"
                        color="success"
                        small depressed
                        @click="events.changeStage(1)"
                      >
                        <v-icon size="18">done</v-icon>
                        <span class="caption pl-1">Согласовать</span>
                      </v-btn>
                      <v-btn
                        class="menu-btn mx-0"
                        color="success"
                        small depressed
                        dark
                        v-on="on"
                      >
                        <v-icon>arrow_drop_down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile
                        @click.stop="dialog = true"
                        @click="stage = 1"
                      >
                        <v-list-tile-title>Согласовать с коментарием</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-flex>
                <v-flex v-else shrink>
                  <v-btn
                    v-if="task.status === '' || task.status === '*'"
                    class="success ml-0"
                    small depressed
                    @click="events.changeStatus('+')"
                  >
                    <v-icon size="18">done</v-icon>
                    <span class="caption pl-1">Выполнить</span>
                  </v-btn>
                  <v-btn
                    v-if="task.status === '+'"
                    class="warning ml-0"
                    small depressed
                    @click="events.changeStatus('*')"
                  >
                    <v-icon size="18">settings_backup_restore</v-icon>
                    <span class="caption pl-1">Вернуть в работу</span>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex d-flex text-xs-right>
              <sm-task-status class="py-2" :status="task.status" chip="true"></sm-task-status>
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
                    'marker'
                      : item.value === 'originals' && task.originals.length
                      || item.value === 'comments' && task.comments.length
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
          <v-layout column>
            <v-flex>
              <sm-task-tab-docs v-if="params.hiddenLgAndUp"></sm-task-tab-docs>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-dialog
        v-model="dialog"
        max-width="600"
      >
        <v-card class="px-5 pt-4 pb-3">
          <v-layout row wrap>
            <v-flex>
              <v-text-field
                label="Добавить коментарий"
                placeholder="Текст коментария..."
                clearable
                @click:clear.stop
                prepend-icon="edit"
                append-outer-icon="send"
                v-on:change="events.changeStage(stage, $event)"
                @change="dialog = false"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-container>
  </sm-task-info-rl>
</template>

<script>
export default {
  name: 'sm-task-info',
  data: () => ({
    dialog: false,
    stage: 0
  })
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

  .main-btn {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .menu-btn {
    min-width: 10px;
    margin: 0;
    padding: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .v-list {
    padding: 0;
  }

  .v-list >>> .v-list__tile {
    height: 40px;
    font-size: 14px;
  }

</style>
