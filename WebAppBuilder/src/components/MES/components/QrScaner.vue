<template>
  <v-dialog
    v-model="dialogVisible"
    @input="dialogInput"
  >
    <div v-if="state" class="qr-state">
      {{state}}
    </div>
    <div class="qr-code-stream" v-else-if="showScanner">
      <qrcode-stream  @decode="onDecode" @init="onInit"></qrcode-stream>
    </div>
  </v-dialog>
</template>

<script>
import {mapGetters} from 'vuex'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

export default {
	name: "mes-qr-scaner",
	components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  i18n:{
    messages:{
      ru: {
        qrScaner: {
          tryAgain:"Повторить попытку",
          loginError:"По данному коду не удалось войти в систему",
          notAllowedError:"Для входа вам нужно дать разрешение на доступ к камере",
          notFoundError:"На этом устройстве камера не обнаружена",
          streamApiNotSupportedError:"Stream API не поддерживается в этом браузере. Попробуйте использовать GoogleChrome"
        }
      }
    }
  },
  data:()=>({
    error:"",
    state:"",
    result:"",
    dialogVisible: true
  }),
	computed: {
		showScanner() {
      return !this.error && !this.result
    },
    routeToBack() {
      return this.$route.params.routeToBack
    }
	},
	methods: {
    dialogInput() {
      this.$emit('changeQrScanerVisible', false);
    },
    tryAgain() {
      this.error = ""
      this.result = ""
    },
    onDecode (qrCodeValue) {
      this.result = qrCodeValue
      this.$emit('changeQrScanerVisible', false);
      this.$emit('submitQrCode', { qrCodeValue });
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
          this.state = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.state = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.state = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.state = this.$t('qrScaner.streamApiNotSupportedError')
        }
      }
    }
	}
}
</script>

<style scoped lang="scss">
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
  }
</style>