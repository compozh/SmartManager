<template>
  <user-panel-rl v-slot="{ user, params }">
    <v-layout align-center>
      <v-flex>
        <v-menu :close-on-content-click="false">
          <template v-slot:activator="{on}">
            <v-layout class="user-panel" v-on="on" align-center>
              <v-flex id="user-icon">
                <user-icon :src="user.photo" size="50"></user-icon>
              </v-flex>
              <v-flex v-if="!mini" class="hidden-xs-only">
                <p class="ma-0 pl-2 subheading">{{ user.name }}</p>
              </v-flex>
            </v-layout>
          </template>
          <v-layout column>
            <v-flex>
              <v-layout pa-2>
                <v-flex class="grow-0">
                  <user-icon
                    class="user-big-image"
                    :src="user.photo"
                    size="80"
                  ></user-icon>
                </v-flex>
                <v-flex ml-3 class="text-xs-left">
                  <p v-if="mini" class="mb-1">{{ user.name }}</p>
                  <p class="mb-1">{{ user.login }}</p>
                  <a @click="params.changePassword"
                  >Сменить пароль</a>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-divider></v-divider>
            <v-flex>
              <v-layout
                pa-2
                grey
                lighten-4
                class="#f5f5f5"
                justify-space-between
              >
                <v-flex class="grow-0">
                  <v-menu auto>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        outline small
                        :style="userMenuBtnStyle"
                        v-on="on"
                      >Делегированные права
                      </v-btn>
                    </template>
                    <v-layout
                      column
                      class="text-xs-left caption"
                    >
                      <v-flex
                        d-flex
                        py-1 px-2
                        class="delegated-menu-item"
                        v-bind="params.delegatedRightsBtnAttr"
                        v-on="params.delegatedRightsBtnAEvents"
                        v-for="(item, index) in user.rights"
                        :key="index"
                      >
                        <div class="icon-container grow-0">
                          <v-icon v-show="item.isActive">done</v-icon>
                        </div>
                        <span>{{ item.USERNAME }}</span>
                      </v-flex>
                      <v-divider></v-divider>
                      <v-flex
                        d-flex
                        py-1 px-2
                        class="delegated-menu-item"
                        v-bind="params.setDelegationBtnAttr"
                        v-on="params.setDelegationBtnEvents"
                      >
                        <div class="icon-container grow-0"></div>
                        <span>Делегировать права</span>
                      </v-flex>
                    </v-layout>
                  </v-menu>
                </v-flex>
                <v-flex class="grow-0">
                  <v-btn
                    outline small
                    :style="userMenuBtnStyle"
                    v-bind="params.logOutBtnAttr"
                    v-on="params.logOutBtnAEvents"
                  >Выход
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-menu>
      </v-flex>
    </v-layout>
  </user-panel-rl>
</template>

<script>
export default {
  name: 'user-panel',
  props: ['mini'],
  data: () => ({
    userMenuBtnStyle: [
      { 'textTransform': 'none' },
      { 'font-weight': 300 },
      { color: 'rgb(102, 102, 102)' },
      { 'border-color': '#c6c6c6' }
    ]
  })
}
</script>

<style scoped>

  .v-menu__content {
    background-color: white;
    top: 65px !important;
  }

  .v-menu__content.v-menu__content--auto {
    top: 208px !important;
  }

  .user-panel {
    cursor: pointer;
  }

  .delegated-menu-item {
    padding-bottom: 5px;
    align-items: center;
    color: rgb(102, 102, 102)
  }

  .delegated-menu-item:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }

  .icon-container {
    display: flex;
    width: 30px;
    height: 18px;
  }

  .grow-0 {
    flex-grow: 0 !important;
  }

  a:hover {
    text-decoration: underline #67A4E1;
  }
</style>
