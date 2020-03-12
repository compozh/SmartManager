<template>
  <v-dialog
    v-model="dialogVisible"
    @input="dialogInput"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-btn outlined class="mes-arrow-back" @click="closeDialog" color="#326DA8" v-on="on"><v-icon dark>clear</v-icon></v-btn>
      </template>
      <span>{{this.$t('mes.buttons.Close')}}</span>
    </v-tooltip>
    <div v-if="state" class="qr-state">
      {{state}}
      <div class="qrcode-capture pt-5">
        <qrcode-capture @decode="onDecode" />
      </div>
    </div>
    <div class="qr-code-stream" v-else-if="showScanner">
      <qrcode-stream @decode="onDecode" @init="onInit" />
    </div>
  </v-dialog>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
/* eslint-disable */
export default {
  name: 'mes-qr-scaner',
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  i18n: {
    messages: {
      ru: {
        qrScaner: {
          tryAgain: 'Повторить попытку',
          loginError: 'По данному коду не удалось войти в систему',
          notAllowedError: 'Для входа вам нужно дать разрешение на доступ к камере',
          notFoundError: 'На этом устройстве камера не обнаружена',
          streamApiNotSupportedError: 'Stream API не поддерживается в этом браузере. Попробуйте использовать GoogleChrome'
        }
      }
    }
  },
  data: () => ({
    error: '',
    state: '',
    result: '',
    dialogVisible: true
  }),
  computed: {
    showScanner() {
      return !this.error && !this.result
    },
    routeToBack() {
      return this.$router.currentRoute.query.to
    }
  },
  methods: {
    dialogInput() {
      this.$emit('changeQrScanerVisible', false)
    },
    tryAgain() {
      this.error = ''
      this.result = ''
    },
    closeDialog() {
      this.$emit('changeQrScanerVisible', false)
    },
    onDecode (qrCodeValue) {
      this.result = qrCodeValue
      this.$emit('changeQrScanerVisible', false)
      this.$emit('submitQrCode', qrCodeValue)
    },
    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.state = this.$t('qrScaner.notAllowedError')
        } else if (error.name === 'NotFoundError') {
          this.state = this.$t('qrScaner.notFoundError')
        } else if (error.name === 'NotSupportedError') {
          this.state = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.state = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.state = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.state = this.$t('qrScaner.streamApiNotSupportedError')
        }
      }
    },
  }
}
</script>

<style scoped>
  .qrcode-capture {
    color: black;
    line-height: 25px;
    font-size: 17px;
  }
  .qr-scanner {
    max-width: 100%;
    max-height: 100%;
  }
  .qr-code-stream {
    font-size: 1.2em;
    margin: 0 auto;
  }
  .qr-loader{
    margin: 40px;
  }
  .qr-error-text, .qr-state{
    padding: 40px;
    color: red;
    font-size: 1.2em;
    text-align: center;
  }
  .mes-arrow-back {
    display: flex;
    margin: 0 auto;
    max-width: 60px;
    min-width: 60px !important;
    height: 60px !important;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 35px);
    z-index: 10;
    top: 25px;
    border: 2px solid white;
  }
  .mes-arrow-back i {
    color: white !important;
  }
  .wrapper {
    display: flex;
    justify-content: center;
  }
</style>
