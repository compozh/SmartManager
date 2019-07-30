<template>
  <div class="qr-scanner">
    <QrLoginRl v-slot="props">
      <div class="qr-container">
        </v-text-field>
        <div v-if="props.state" class="qr-state">
          {{props.state}}
        </div>
        <div class="qr-code-stream" v-else-if="props.showScanner">
          {{$t("qrlogin.infoMessage")}}
          <qrcode-stream  @decode="props.readerEvents.onDecode" @init="props.readerEvents.onInit"></qrcode-stream>
        </div>
        <div v-else-if="props.error">
          <div class="qr-error-text">{{props.error}}</div>
          <v-btn color="primary"
          @click="props.readerEvents.tryAgain"
          >{{$t("qrlogin.tryAgain")}}</v-btn>
        </div>
        <v-progress-circular class="qr-loader" v-if="props.processing"
          size="80"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </QrLoginRl>
  </div>
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

export default {
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  name:"QrLogin",
  i18n:{
    messages:{
      ru: {
        qrlogin: {
          infoMessage:"Для входа в систему отсканируйте QR код",
          tryAgain:"Повторить попытку"
        }
      }
    }
  }
}

</script>

<style scoped>

  .qr-code-stream{
    font-size: 1.2em
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
