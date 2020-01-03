<template>
  <UserPanelrs v-slot="{ user, params }">
    <v-menu >
      <template v-slot:activator="{on}">
        <v-btn icon text v-on="on">
          <v-icon v-html="'account_circle'" />
        </v-btn>
      </template>
      <v-col>
        <v-row justify="center">
          <user-icon :src="user.photo" size="60" />
        </v-row>
        <v-row justify="center">
          <p class="ma-0 pl-2 subheading">{{ user.name }}</p>
        </v-row>
        <v-divider />
        <v-row>
          <v-col class="pa-2 #f5f5f5 lighten-4 grey" justify="space-between">
 
            <v-row justify="center">
              <v-btn text v-on:click="logoutCallback(params.logOut)">Выход</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-menu>
  </UserPanelrs>
</template>

<script>
export default {
  name: 'user-panel',

  methods: {
    logoutCallback(logoutFunctionPointer) {
      this.$router.push({ name: 'MESLOGIN', params:{ routeToBack: this.$router.currentRoute.path }} )
      logoutFunctionPointer.click()
    }
  }
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
  color: rgb(102, 102, 102);
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
  text-decoration: underline #67a4e1;
}
</style>


