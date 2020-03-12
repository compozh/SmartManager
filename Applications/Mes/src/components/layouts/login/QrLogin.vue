<template>
  <div class="qr-scanner">
    <QrLoginRl v-slot="props">
      <div class="qr-container">
        <div v-if="props.state" class="qr-state py-3">
          {{props.state}}
          <div class="qrcode-capture">
            <qrcode-capture @decode="props.readerEvents.onDecode" />
          </div>
        </div>
        <div class="qr-code-stream" v-else-if="props.showScanner">
          {{$t("qrlogin.infoMessage")}}
          <qrcode-stream @decode="props.readerEvents.onDecode" @init="props.readerEvents.onInit" />
        </div>
        <div v-else-if="props.error">
          <div class="qr-error-text">{{props.error}}</div>
          <v-btn class="cyan white--text text-xs-right"
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
import { QrcodeStream, QrcodeDropZone, QrcodeCapture  } from 'vue-qrcode-reader'
// Добавил импорт на компонент без отрисовки
import QrLoginRl from './renderless/QrLogin'
export default {
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture,
    QrLoginRl
  },
  name: 'QrLogin',
  i18n: {
    messages: {
      ru: {
        qrlogin: {
          infoMessage: 'Для входа в систему отсканируйте QR код',
          tryAgain: 'Повторить попытку'
        }
      }
    }
  },
}

</script>

<style scoped lang="scss">
  .qrcode-capture {
    color: black;
    line-height: 25px;
    font-size: 17px;

  }
  .qr-scanner {
    max-width: 100%;
    max-height: 100%;
    
  }
  .qr-code-stream{
    font-size: 1.2em;
    line-height: 30px;
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
