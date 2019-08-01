<template>
  <!-- EDS -->
  <Eds-view-DigitalSignature v-if="!hidden" @processed="processed" :internal="true" :sign-data="stringToSign" :dataType="'data'">
    <v-container slot-scope="props">
      <!-- Сообщения -->

      <v-alert class="eds-allert" type="warning" :value="props.warning != null || localWarning != null" dismissible>
        <div v-html="props.warning || localWarning"></div>
      </v-alert>
      <v-alert class="eds-allert" type="error" :value="props.error != null" dismissible>
        <div v-html="props.error"></div>
      </v-alert>

      <!-- Окно -->
      <v-dialog :fullscreen="$vuetify.breakpoint.smAndDown" :value="true" hide-overlay persistent width="700" content-class="login-dialog">
        <v-container pa-0>
          <v-layout>
            <v-layout style="align-items: stretch" justify-center row fill-height>
              <!-- Логотип -->
              <v-flex
                class="left-panel content-panel"
                xs6
                :style="'--login-logo-img:url(\''+image+'\')'"
              >
                <h4 class="it-label pb-3 display-1 font-weight-light">{{$t('eds.MinfinLogo')}}</h4>
                <h4 class="title font-weight-light">{{$t('eds.LocalBudgets')}}</h4>
              </v-flex>

              <!-- Форма входа -->
              <v-flex class="rignt-panel content-panel" xs6>
                <h5 class="pb-5 display-1 font-weight-thin header">{{$t('eds.SigIn')}}</h5>

                <form v-on="props.formEvents">
                  <!-- Аппаратный ключ -->
                  <v-checkbox
                    class="pt-0"
                    dark
                    :disabled="props.disabled"
                    v-bind="props.hardwareKeyProps"
                    v-on="props.hardwareKeyEvents"
                    :label="$t('eds.UseSignAgent')"
                  ></v-checkbox>
                  <!-- Выбор файлового ключа -->
                  <v-text-field
                    class="pt-0"
                    dark
                    readonly
                    color="white"
                    v-if="!props.hardwareKey"
                    :disabled="props.disabled"
                    browser-autocomplete="off"
                    :label="$t('eds.PrivateKey')"
                    @click="pickFile"
                    :value="props.fileKeyName"

                  ></v-text-field>
                  <input
                    type="file"
                    style="display: none"
                    ref="hardwareKeyInput"
                    v-on="props.hardwareKeyInputEvents"
                  >

                  <!-- Список устройств -->

                  <v-select
                    v-if="props.hardwareKey"
                    class="pt-0"
                    dark
                    color="white"
                    :no-data-text="$t('NoDevices')"
                    :label="$t('eds.DeviceName')"
                    :disabled="props.disabled"
                    :items="props.devices"
                    v-bind="props.hardwareDeviceProps"
                    v-on="props.hardwareDeviceEvents"
                    :placeholder="props.devices.length > 0 ? '' : $t('eds.ChooseDeviceType')"
                    :append-icon="'sync'"
                    @click:append="props.refreshDevicesEvents.click"
                  ></v-select>

                  <!-- Пароль -->
                  <v-text-field
                    class="pt-0"
                    dark
                    color="white"
                    browser-autocomplete="off"
                    :disabled="props.disabled"
                    :label="$t('eds.Password')"
                    type="password"
                    v-on="props.keyPasswordEvents"
                    v-bind="props.keyPasswordProps"
                    placeholder
                  />

                  <v-text-field v-model="budgetId" dark class="pt-0" pt-1 :label="$t('eds.BudgetCode')" required color="white"></v-text-field>
                  <v-text-field v-model="exchequerId" class="pt-0" dark :label="$t('eds.TreasuryCode')" required color="white"></v-text-field>

                  <!-- Кнопка Подписать -->

                  <v-btn
                    type="submit"
                    class="minfin-bnt"
                    dark
                    color="orange"
                    :disabled="props.submitButtonProps.disabled || localLoading"
                  >
                  <!-- v-on="props.submitButtonEvents" -->
                    <template v-if="props.loading || localLoading">
                      <v-progress-circular indeterminate color="white"></v-progress-circular>
                    </template>
                    <span>{{$t('eds.SigIn')}}</span>
                  </v-btn>
                </form>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-container>
  </Eds-view-DigitalSignature>
</template>
<script>
import image from './chart.png'
import api from './api'
export default {
  name: 'minfin-login',
  data() {
    return {
      hidden: true,
      image,
      requestId: null,
      stringToSign: null,
      budgetId: null,
      exchequerId: null,
      localWarning: null,
      localLoading: false
    }
  },
  methods: {
    pickFile() {
      this.$refs.hardwareKeyInput.click()
    },
    processed(ret) {
      this.localWarning = null
      if(!ret.success){
        return
      }
      this.localLoading = true
      api.authBySign(this.requestId, ret.success.Sign, this.budgetId, this.exchequerId).then(ret => {
        this.localLoading = false
        if(!ret.success){
          this.localWarning = ret.errorReason
          api.getIdForSign().then(resp => {
            this.requestId = resp.requestId
            this.stringToSign = resp.stringToSign
          })
          return
        }

        this.$store.commit('setCurrentUser', ret )
        this.$router.replace({path: this.routeToBack})

        this.$store.dispatch('minfin/setUserData', ret)
      })
    }
  },
  computed: {
    routeToBack() {
      return this.$route.params.routeToBack
    }
  },
  created() {

    let user = sessionStorage.getItem('minfinUser')
    if(user){
      user = JSON.parse(user)

      if(user.ticket){
        api.pingTiket(user.ticket).then(resp=>{

          if(resp == 'WRONG_TICKET'){
            this.hidden = false
            sessionStorage.removeItem('minfinUser')
            return
          }
          this.$store.commit('setCurrentUser', user )
          this.$router.replace({path: this.routeToBack})

          this.$store.dispatch('minfin/setUserData', user)
        })
      }
    } else {
      this.hidden = false
    }
    api.getIdForSign().then(resp => {
      this.requestId = resp.requestId
      this.stringToSign = resp.stringToSign
    })
  }
}
</script>
<style >
.login-dialog {
  background: #fff;
  padding: 0px;
}
.content-panel {
  padding: 40px 0;
  /* height: 600px; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.rignt-panel {
  background: linear-gradient(153deg, #2984b3, #42409d);
  align-items: stretch;
  padding-right: 20px;
  padding-left: 20px;
}
.left-panel {
  background: linear-gradient(
      0,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0.85)
    ),
    var(--login-logo-img);
  background-size: cover;
}
.header {
  color: white;
}
.minfin-bnt {
  font-weight: 300;
}
.it-label {
  color: #16146e;
  padding: 10px;
}
.eds-allert {
  position: fixed;
  z-index: 1000;
  top: 0;
}
</style>


