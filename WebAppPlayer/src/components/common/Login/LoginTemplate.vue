<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <login-rl v-slot="{ userData, message, params }">
          <v-container>
            <v-layout column>
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
                <v-layout row wrap align-center justify-space-between>
                  <v-flex align-left>
                    <v-checkbox
                      color="cyan"
                      v-bind="params.rememberAttrs"
                      v-on="params.rememberEvents"
                    ></v-checkbox>
                  </v-flex>
                  <v-flex class="text-xs-right">
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
                <p class="red--text text--darken-4" v-bind="params.messageAttrs">{{ message }}</p>
              </v-flex>
            </v-layout>
          </v-container>
        </login-rl>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'login'
}
</script>
