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
                  :src="userData.CurrentUserData.UserPhoto"></v-img>
              </v-list-tile-avatar>
            </v-list-tile>
            <v-card-title>
              <div>{{userData.CurrentUserData.UserName}}</div>
            </v-card-title>
            <v-card-title>
              <div>{{userData.LoginData.UserLogin}}</div>
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
  data() {

  },
  created() {

  },
  computed: {
    userData() {
      return this.$store.state.authentication.currentUser.UserData
    }
  }
}
</script>

<style>

</style>
