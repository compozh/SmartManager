<template>
  <user-panel-rl v-slot="{ menu, userData, params }">
    <v-layout align-center>
      <v-flex>
        <user-icon :src="userData.Image" size="50"></user-icon>
      </v-flex>
      <v-flex class="hidden-and-up user-name">
        <p class="ma-0 pl-2 subheading">{{ userData.Name }}</p>
      </v-flex>
      <v-flex>
        <v-menu
          v-model="menu.show"
          :close-on-content-click="false"
          :nudge-width="300"
          :nudge-top="300"
          :position-y="165"
          bottom

        >
          <template v-slot:activator="{ on }">
            <v-icon large v-on="on"
            >
              {{ menu.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}
            </v-icon>
          </template>
          <v-layout column>
            <v-flex>
              <v-layout pa-2>
                <v-flex class="grow-0">
                  <user-icon
                    class="user-big-image"
                    :src="userData.Image"
                    size="80"
                  ></user-icon>
                </v-flex>
                <v-flex ml-3 class="text-xs-left">
                  <p class="mb-1">{{ userData.Login }}</p>
                  <a @click="params.changePassword"
                  >Сменить пароль</a>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-divider></v-divider>
            <v-flex>
              <v-layout justify-space-between grey lighten-4 pa-2 class="#f5f5f5">
                <v-flex class="grow-0">
                  <v-btn
                    outline small
                    v-bind="params.delegatRigthBtnAttr"
                    v-on="params.delegatRigthBtnAEvents"
                  >Делегированные права</v-btn>
                </v-flex>
                <v-flex class="grow-0">
                  <v-btn
                    outline small
                    v-bind="params.logOutBtnAttr"
                    v-on="params.logOutBtnAEvents"
                  >Выход</v-btn>
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
    name: 'user-panel'
  }
</script>

<style scoped>

  .v-menu__content {
    background-color: white;
    top: 65px !important;
  }

  .user-name {
    white-space: nowrap;
    width: 100%;
  }



  .grow-0 {
    flex-grow: 0 !important;
  }

  a:hover {
    text-decoration: underline #67A4E1;
  }
</style>

