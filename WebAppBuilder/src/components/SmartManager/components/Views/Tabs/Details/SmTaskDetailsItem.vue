<template>
  <sm-tasks-item-rl v-slot="{}">
    <v-card flat class="task-item mr-2">
      <v-layout row align-center>
        <v-flex d-flex justify-center shrink pr-3>
          <user-icon :src="task.addedPhoto" size="50"></user-icon>
        </v-flex>
        <v-flex py-1 class="text-ellipsis">
          <v-layout column text-xs-left>
            <v-flex>
              <v-layout>
                <v-flex class="text-ellipsis">
                  <span
                    class="body-2 font-weight-light blue--text text--darken-2"
                  >{{ task.name }}</span>
                </v-flex>
                <v-flex shrink>
                  <span class="icon-group d-flex align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.priority" v-on="on">priority_high</v-icon>
                      </template>
                      <span>Высокий приоритет</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.hasOrig" v-on="on">attach_file</v-icon>
                      </template>
                      <span>Есть вложения</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.isAgree" class="ml-1" v-on="on">playlist_add_check</v-icon>
                      </template>
                      <span>Требует согласования</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.hasComm" class="ml-1" v-on="on">chat_bubble_outline</v-icon>
                      </template>
                      <span>Есть коментарии</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-if="task.isMy" class="ml-1" v-on="on">face</v-icon>
                      </template>
                      <span>Задача от меня</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          v-on="on"
                          :color="taskStatus.color"
                          class="hidden-sm-and-up ml-1"
                        >{{ taskStatus.icon }}</v-icon>
                      </template>
                      <span>{{ taskStatus.text }}</span>
                    </v-tooltip>
                    <v-chip
                      disabled
                      small outline
                      class="hidden-xs-only ma-0 ml-1"
                      :color="taskStatus.color"
                    >
                      <v-avatar>
                        <v-icon size="18px">{{ taskStatus.icon }}</v-icon>
                      </v-avatar>{{ taskStatus.text }}
                    </v-chip>
                  </span>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="caption text-ellipsis">
              <span class="hidden-xs-only"
              >Исполнитель: </span>{{ task.addedFio }}
            </v-flex>
            <v-flex d-flex class="caption grey--text">
              <v-flex class="text-xs-left">
                <span class="hidden-xs-only"
                >Добавлено: </span>{{ task.dateAdd }}
              </v-flex>
              <v-flex class="text-xs-right">
                <span class="hidden-xs-only"
                >Идентификатор: </span>{{ task.id }}
              </v-flex>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout
        column
        id="desc"
        class="description-container"
      >
        <v-flex
          xs12
          class="iframe-container"
          :class="{'show-after': !showHiddenDesc && compareDescHeight}"
        >
          <iframe
            seamless
            scrolling="no"
            width="100%"
            :height="setDescriptionHeight"
            frameborder="0"
            :srcdoc="task.htmlDescript"
            @load="iFrameOnLoad"
          ></iframe>
        </v-flex>
        <v-flex
          v-if="compareDescHeight"
          class="btn-more-container"
        >
          <v-btn
            outline small
            @click="btnToggle"
            :fab="showHiddenDesc"
            class="btn-more"
            :class="{'btn-no-fab': !showHiddenDesc}"
            :style="{ right: showHiddenDesc ? setBtnPosition : 'auto' }"
          >
            {{ showHiddenDesc ? '' : 'Показать больше' }}
            <v-icon v-if="!showHiddenDesc" size="18">keyboard_arrow_down</v-icon>
            <v-icon v-if="showHiddenDesc">keyboard_arrow_up</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </sm-tasks-item-rl>
</template>

<script>
  export default {
    name: 'sm-task-details-item',
    props: ['task'],
    data: () => ({
      defaultDescHeight: 250,
      iFrameHeight: '',
      showHiddenDesc: false,
    }),
    methods: {
      iFrameOnLoad(event) {
        this.iFrameHeight = event.path[0].contentDocument.body.scrollHeight
      },
      btnToggle() {
        this.showHiddenDesc = !this.showHiddenDesc
      },
    },
    computed: {
      compareDescHeight() {
        return this.iFrameHeight > this.defaultDescHeight
      },
      setDescriptionHeight() {
        return this.showHiddenDesc || !this.compareDescHeight
          ? this.iFrameHeight + 5
          : this.defaultDescHeight
      },
      setBtnPosition() {
        switch (this.$vuetify.breakpoint.name) {
          case 'lg': return '42%'
          case 'xl': return '45%'
        }
      },
      taskStatus() {
        switch (this.task.status) {
          case '':
            return {
              color: 'orange darken-2',
              icon: 'access_time',
              text: 'ожидает'
            }
          case '*':
            return {
              color: 'blue-grey darken-1',
              icon: 'loop',
              text: 'в работе'
            }
          case '-':
            return {
              color: 'red darken-2',
              icon: 'highlight_off',
              text: 'отклонена'
            }
          case '+':
            return {
              color: 'green darken-2',
              icon: 'check_circle_outline',
              text: 'выполнена'
            }
        }
      }
    }
  }
</script>

<style scoped>
  .task-item {
    box-shadow: inset 0 -1px 0 rgba(100, 121, 143, 0.122);
    border-radius: 0;
  }

  .text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .v-chip {
    height: 22px !important;
    font-size: 12px
  }

  .v-chip:focus {
    background-color: red;
  }

  .v-chip >>> .v-chip__content {
    cursor: pointer;
  }

  .unread {
    border-left-color: #1976D2;
  }

  .description-container {
    overflow: hidden;
  }

  .iframe-container {
    position: relative;
  }

  .show-after.iframe-container:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 25px;
    width: 100%;
    background: linear-gradient(0deg, rgb(255, 255, 255) 20%, rgba(255, 255, 255, 0) 100%);
  }

  iframe {
    transition: height linear .2s;
  }

  .btn-more {
    margin: 3px 0;
    padding: 0;
    text-transform: none;
    font-weight: 300;
    color: #666;
    background-color: #f5f5f5 !important;
    border-color: #c6c6c6;
  }

  .btn-more.v-btn--floating {
    position: fixed;
    right: 15px;
    bottom: 15px;
  }

  .btn-no-fab {
    border-radius: 2px;
    height: 21px;
    width: 100%;
  }

</style>