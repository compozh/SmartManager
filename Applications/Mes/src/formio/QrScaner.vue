<template>
  <v-dialog
    v-model="dialogVisible"
    @input="dialogInput"
  >
    <v-btn outlined class="mes-close-layout" @click="closeDialog" color="#326DA8"><v-icon dark>clear</v-icon></v-btn>
    <div v-if="state" class="qr-state">
      {{state}}
    </div>
    <div class="qr-code-stream" v-else-if="showScanner">
      <qrcode-stream  @decode="onDecode" @init="onInit"></qrcode-stream>
    </div>
  </v-dialog>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
/* eslint-disable */
export default {
  name: 'formio-qr-scaner',
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  i18n: {
    messages: {
      ru: {
        qrScaner: {
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
    }
  }
}
</script>

<style scoped>
  .qr-code-stream {
    font-size: 1.2em;
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
  .mes-close-layout {
    cursor: pointer;
    display: flex;
    margin: 0 auto;
    max-width: 60px;
    min-width: 60px !important;
    height: 60px !important;
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 20px);
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
