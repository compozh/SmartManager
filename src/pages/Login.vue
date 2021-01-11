<template>
  <v-container fluid class="fill-height justify-center">
    <v-row align="center" justify="center">
      <v-col cols="10" sm="7" md="5" lg="4" xl="3">
      <v-card class="pa-5">
        <v-row align="center">
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
                          v-model="rememberMe"/>
              <v-spacer></v-spacer>
              <div v-if="authTypes.includes('SmartId')"
                   ref="smartId"
                   class="btn-smart-id"
                   v-ripple></div>
              <v-btn color="primary" @click="loginMethod">
                {{ $t('buttons.login') }}
              </v-btn>
            </div>
            <div class="d-flex justify-end subtitle-2">
              <a :href="forgotPasswordUrl" target="_blank">{{ $t('login.forgotPassword') }}</a>
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
  computed: {
    forgotPasswordUrl () {
      const forgotPasswordUrl = '/webparts/?id=LOGIN_REQUESTRECOVERPASSWORD&devexpress_theme=moderno&itLanguage='
      return window.appConfig.SiteUrl + forgotPasswordUrl + this.$i18n.locale
    }
  },
  created () {
    this.logout()
    this.getAuthTypes()
  },
  mounted () {
    this.$refs.smartId.addEventListener('click', this.smartId)
  },
  methods: {
    async getAuthTypes () {
      await this.$store.dispatch('authTypes')
    }
  }
}
</script>

<style scoped>

  .btn-smart-id {
    background: url("../assets/images/smart_id_btn_bg.png") no-repeat center center;
    background-color: #e6e6e6;
    background-size: 85%;
    border-radius: 4px;
    height: 36px;
    width: 76px;
    margin-right: 0.75rem;
    cursor: pointer;
    box-shadow: 0 1px 1px -2px rgba(0,0,0,.2),
                0 2px 2px 0 rgba(0,0,0,.14),
                0 1px 5px 0 rgba(0,0,0,.12)!important;
  }

</style>
