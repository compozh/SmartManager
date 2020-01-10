<template>
  <v-container fluid fill-height >

    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <login-rl v-slot="{ userData, message, params, loading, needEnterTempPassword}">

          <v-container>
            <!-- Логин/пароль режим -->
            <v-layout v-if="needEnterTempPassword">
              <v-flex>
                <confirm-password> </confirm-password>
              </v-flex>
            </v-layout>
            <v-layout column v-if="!qrMode && !needEnterTempPassword">
              <v-flex>
                <v-text-field
                  color="cyan"
                  v-bind="params.loginAttrs"
                  v-on="params.loginEvents"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  color="cyan"
                  v-bind="params.passwordAttrs"
                  v-on="params.passwordEvents"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-layout
                  row
                  wrap
                  align-center
                  justify-space-between
                >
                  <v-flex align-left>
                    <v-checkbox
                      color="cyan"
                      v-bind="params.rememberAttrs"
                      v-on="params.rememberEvents"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex class="text-xs-right">
                    <a v-on="params.buttonEventRecoverPasswordUrl">Забыли пароль?</a>
                    <v-btn
                      class="cyan white--text text-xs-right"
                      v-bind="params.buttonAttrs"
                      v-on="params.buttonEvents"
                    >Войти
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <p class="red--text text--darken-4"
                   v-bind="params.messageAttrs"
                >{{ message }}</p>
              </v-flex>
              <v-flex>
                <v-btn v-if="allowQrMode"
                  @click="qrMode = true"
                  class="cyan white--text text-xs-right">
                  Войти с помощью QR
                </v-btn>
              </v-flex>

            </v-layout>
              <!-- QR режим -->

            <v-layout v-if="qrMode">
              <v-flex>
                <qr-login></qr-login>
                <v-btn
                  @click="qrMode = false"
                  class="cyan white--text text-xs-right">
                  Ввести логин и пароль
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </login-rl>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import loginRl from './renderless/Login'
import qrLogin from './QrLogin.vue'
import confirmPassword from './ConfirmTempPassword.vue'
export default {
  name: 'login',
  props: ['allowQrMode'],
  data() {
    return {
      qrMode: false
    }
  },
  components: {
    'login-rl': loginRl,
    'qr-login': qrLogin,
    'confirm-password': confirmPassword
  }
}
</script>
