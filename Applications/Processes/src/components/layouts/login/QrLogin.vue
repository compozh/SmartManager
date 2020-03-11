<template>
  <div class="qr-scanner">
    <QrLoginRl v-slot="props">
      <div class="qr-container">
        <div v-if="props.state" class="qr-state">
          {{props.state}}
        </div>
        <div class="qr-code-stream" v-else-if="props.showScanner">
          {{$t("processes.login.infoMessage")}}
          <qrcode-stream  @decode="props.readerEvents.onDecode" @init="props.readerEvents.onInit"></qrcode-stream>
        </div>
        <div v-else-if="props.error">
          <div class="qr-error-text">{{props.error}}</div>
          <v-btn class="cyan white--text text-xs-right"
          @click="props.readerEvents.tryAgain"
          >{{$t('processes.login.tryAgain')}}</v-btn>
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
import { QrcodeStream } from 'vue-qrcode-reader'
// Добавил импорт на компонент без отрисовки
import QrLoginRl from './renderless/QrLogin'
export default {
  components: {
    QrcodeStream,
    QrLoginRl
  },
  name: 'QrLogin'
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
