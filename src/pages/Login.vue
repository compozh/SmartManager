<template>
  <v-container fluid class="fill-height justify-center">
    <v-row align="center" justify="center">
      <v-col cols="10" sm="7" md="5" lg="4" xl="3">
      <v-card>
        <v-row class="pa-5" align="center">
          <v-col class="d-flex flex-column">
            <h3 class="mb-4">{{ $t('login.title') }}</h3>
            <p>{{ $t('login.welcome') }}</p>

              <v-form>
                <v-text-field v-model="login"
                              :label="$t('login.login')"
                              :placeholder="$t('login.loginPlaceholder')"
                              outlined
                              name="login"
                              type="text"
                              autocomplete="username"
                              class="body-1"
                              @keyup.enter="loginMethod">
                  <template #prepend-inner>
                    <v-icon small class="pt-1 pr-2">fas fa-user</v-icon>
                  </template>
                </v-text-field>

                <v-text-field v-model="password"
                              :label="$t('login.password')"
                              :placeholder="$t('login.passwordPlaceholder')"
                              outlined
                              name="password"
                              type="password"
                              autocomplete="current-password"
                              class="body-1"
                              @keyup.enter="loginMethod">
                  <template #prepend-inner>
                    <v-icon small class="pt-1 pr-2">fas fa-key</v-icon>
                  </template>
                </v-text-field>
              </v-form>
            <div class="d-flex align-center justify-space-between">
              <v-checkbox :label="$t('login.rememberMe')"
                          v-model="checkbox_remember_me"/>
              <v-btn color="primary" @click="loginMethod">
                {{ $t('buttons.login') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { userMethods } from '@/mixins/users'

export default {
  name: 'Login',
  mixins: [userMethods],
  data: () => ({
    login: '',
    password: '',
    checkbox_remember_me: false
  }),
  created () {
    this.logout()
  }
}
</script>
