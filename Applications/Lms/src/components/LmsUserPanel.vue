<template>
  <v-layout>
    <v-flex >
      <v-menu v-if="user"
        v-model="menu"
        :nudge-width="200"
        bottom
        offset-x
        offser-y>
        <template v-slot:activator="{on}">
            <v-btn v-on="on" icon large>
              <v-icon>person</v-icon>
            </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-tile
              v-for="(item, i) in userMenuItems" :key="i"
              @click="item.action">
                <v-list-tile-title>
                  <v-icon>{{item.icon}}</v-icon>
                  {{item.title}}
                </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'lms-user-panel',
  data() {
    return {
      menu: false,
      userMenuItems: [
        {title: 'Профиль пользователя', icon: 'face', action: this.userProfile},
        {title: 'Личный кабинет', icon: 'person', action: this.personalAccount},
        {title: 'Выйти', icon: 'exit_to_app', action: this.signOut}
      ]
    }
  },
  methods: {
    personalAccount() {
      this.$router.push({name: 'LMSPERSONALACCOUNT'})
    },
    signOut() {
      this.$store.dispatch('lms/logout')
    }
  },
  computed: {
    user() {
      return this.$store.state.lms.user
    }
  }
}
</script>

<style>

</style>
