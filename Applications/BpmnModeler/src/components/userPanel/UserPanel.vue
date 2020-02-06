<template>
  <user-panel-rl v-slot="{ user, params }">
    <v-row align="center">
      <v-col>
        <v-menu
          :close-on-content-click="false"
          v-model="menu"
        >
          <template v-slot:activator="{on}">
            <v-row class="user-panel" v-on="on" align="center">
              <v-col id="user-icon">
                <user-icon :src="user.photo" size="50"></user-icon>
              </v-col>
              <v-col v-if="!mini" class="hidden-xs-only">
                <p class="ma-0 pl-2 subheading">{{ user.name }}</p>
              </v-col>
            </v-row>
          </template>
          <v-col>
            <v-col>
              <v-row class="pa-2" >
                <v-col class="grow-0">
                  <user-icon
                    :src="user.photo"
                    size="60"
                  ></user-icon>
                </v-col>
                <v-col class="text-left ml-3">
                  <p v-if="mini" class="mb-1">{{ user.name }}</p>
                    <a
                      v-on:click="params.changePassword"
                      @click="menu = !menu"
                    >Сменить пароль</a>
                </v-col>
              </v-row>
            </v-col>
            <v-divider></v-divider>
            <v-col>
              <v-row
                class="#f5f5f5 pa-2 grey lighten-4"
                justify="space-between"
              >
              <v-col  v-show="hideDelegatedRightsButton"></v-col>
                <v-col class="grow-0"  v-show="!hideDelegatedRightsButton">
                  <v-menu auto>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        outlined small
                        :style="userMenuBtnStyle"
                        v-on="on"
                      >Делегированные права
                      </v-btn>
                    </template>
                    <v-col class="text-left caption">
                      <v-col
                        class="delegated-menu-item d-flex py-1 px-2"
                        v-on="params.delegatedRights"
                        @click="menu = !menu"
                        v-for="(item, index) in user.rights"
                        :key="index"
                      >
                        <div class="icon-container grow-0">
                          <v-icon v-show="item.IsActive">mdi-check</v-icon>
                        </div>
                        <span :id="item.USERID">{{ item.USERNAME }}</span>
                      </v-col>
                      <v-divider></v-divider>
                      <v-col
                        
                        
                        class="delegated-menu-item d-flex py-1 px-2"
                        v-on="params.setDelegation"
                        @click="menu = !menu"
                      >
                        <div class="icon-container grow-0"></div>
                        <span>Делегировать права</span>
                      </v-col>
                    </v-col>
                  </v-menu>
                </v-col>
                <v-col class="grow-0">
                  <v-btn
                    outlined small
                    :style="userMenuBtnStyle"
                    v-on="params.logOut"
                  >Выход
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-col>
        </v-menu>
      </v-col>
    </v-row>
  </user-panel-rl>
</template>

<script>
import userPanelRl from './UserPanel'

export default {
  name: 'user-panel',
  components: {
    userPanelRl
  },
  props: ['mini', 'hideDelegatedRightsButton'],

  data: () => ({
    menu: false,
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
    top: 184px !important;
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


