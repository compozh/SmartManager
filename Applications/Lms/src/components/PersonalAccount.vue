<template>
  <v-container>
    <v-layout justify-center align-center column>
      <v-flex>
        <h2>Личный кабинет</h2>
      </v-flex>
      <v-flex>
      <v-layout>
        <v-flex>
          <v-card>
            <v-list-tile>
              <v-list-tile-avatar>
                <v-img
                  class="elevation-6"
                  :src="userPhoto"></v-img>
              </v-list-tile-avatar>
            </v-list-tile>
            <v-card-title>
              <div>{{userName}}</div>
            </v-card-title>
            <v-card-title>
              <div>{{userLogin}}</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex>

        </v-flex>
      </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'lms-personal-account',
  computed: {
    user() {
      return this.$store.state.lms.user
    },
    userName() {
      return this.user ? this.user.userName : ''
    },
    userLogin() {
      return this.user ? this.user.login : ''
    },
    userPhoto() {
      return this.user ? this.user.userPhoto : ''
    }
  }
}
</script>

<style>

</style>
