<template>
  <v-container class="fill-height" fluid >

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <login-rl v-slot="{ userData, message, params, loading, needEnterTempPassword}">

          <v-container>
            <!-- Логин/пароль режим -->
            <v-row v-if="needEnterTempPassword">
              <v-col>
                <confirm-password> </confirm-password>
              </v-col>
            </v-row>
            <v-col v-if="!qrMode && !needEnterTempPassword">
              <v-col>
                <v-text-field
                  v-bind="params.loginAttrs"
                  v-on="params.loginEvents"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-bind="params.passwordAttrs"
                  v-on="params.passwordEvents"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-row
                  align="center"
                  justify="space-between"
                >
                  <v-col class="align-left" >
                    <v-checkbox
                      v-bind="params.rememberAttrs"
                      v-on="params.rememberEvents"
                    ></v-checkbox>
                  </v-col>
                  <v-col class="text-right">
                    <!-- <a v-on="params.buttonEventRecoverPasswordUrl">Забыли пароль?</a> -->
                    <v-btn
                      :loading="loading"
                      class="primary text-right"
                      v-bind="params.buttonAttrs"
                      v-on="params.buttonEvents"
                    >
                    {{ $t('bpmn.authentication.login') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <p class="red--text text--darken-4"
                   v-bind="params.messageAttrs"
                >{{ message }}</p>
              </v-col>
              <v-col>
                <v-btn v-if="allowQrMode"
                  @click="qrMode = true"
                  class="primary text-right">
                  Войти с помощью QR
                </v-btn>
              </v-col>

            </v-col>
              <!-- QR режим -->

            <v-row v-if="qrMode">
              <v-col>
                <qr-login></qr-login>
                <v-btn
                  @click="qrMode = false"
                  class="primary text-right">
                  Ввести логин и пароль
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </login-rl>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import loginRl from '../login/renderless/Login'
import qrLogin from '../login/QrLogin.vue'
import confirmPassword from '../login/ConfirmTempPassword.vue'
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
