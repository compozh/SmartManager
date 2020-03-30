<template>
  <user-panel-rl v-slot="{ user, params, notifications }">
    <v-layout align-center>
      <v-flex>
        <v-menu
          :close-on-content-click="false"
          v-model="menu"
        >
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
            <v-flex xs6 pa-3>
              <v-switch label="Получать уведомления" v-model="notifications.enabled"  @change="notifications.toggle"></v-switch>
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
                  <v-btn
                    outlined small
                    :style="userMenuBtnStyle"
                    v-on="params.logOut"
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


