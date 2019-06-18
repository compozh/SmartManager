<template>
  <div>
    <DigitalSignatureRl @processed="processed" :sign-data="signData" :dataType="dataType" :disabled="disabled">
      <form slot-scope="props" autocomplete="off" v-bind="props.formEvents">
        <v-alert type="warning" :value="props.warning != null" dismissible>
          <div v-html="props.warning"></div>
        </v-alert>
        <v-alert type="error" :value="props.error != null" dismissible>
          <div v-html="props.error"></div>
        </v-alert>

        <!-- Аппаратный ключ -->
        <v-checkbox
          :disabled="props.disabled"
          v-bind="props.hardwareKeyProps"
          v-on="props.hardwareKeyEvents"
          :label="$t('eds.UseSignAgent')"
        ></v-checkbox>

        <!-- Выбор файлового ключа -->
        <v-text-field
          v-if="!props.hardwareKey"
          :disabled="props.disabled"
          browser-autocomplete="off"
          :label="$t('eds.PrivateKey')"
          @click="pickFile"
          :value="props.fileKeyName"
          prepend-icon="attach_file"
        ></v-text-field>
        <input
          type="file"
          style="display: none"
          ref="hardwareKeyInput"
          v-on="props.hardwareKeyInputEvents"
        >

        <!-- Список устройств -->
        <div v-if="props.hardwareKey">
          <v-select
            :no-data-text="$t('NoDevices')"
            :label="$t('eds.DeviceName')"
            :disabled="props.disabled"
            :items="props.devices"
            v-bind="props.hardwareDeviceProps"
            v-on="props.hardwareDeviceEvents"
            :placeholder="props.devices.length > 0 ? '' : $t('eds.ChooseDeviceType')"
          ></v-select>
          <v-btn variant="secondary" v-on="props.refreshDevicesEvents">
            <i class="fal fa-sync-alt"/>
          </v-btn>
        </div>

        <!-- Пароль -->

        <v-text-field
          browser-autocomplete="off"
          :disabled="props.disabled"
          :label="$t('eds.Password')"
          type="password"
          v-on="props.keyPasswordEvents"
          v-bind="props.keyPasswordProps"
          placeholder
        />

        <!-- Кнопка Подписать -->

        <v-btn v-on="props.submitButtonEvents" v-bind="props.submitButtonProps">
          <template v-if="props.loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </template>
          <span>{{ $t("eds.Sign") }}</span>
        </v-btn>
      </form>
    </DigitalSignatureRl>
  </div>
</template>

<script>
export default {
  name: 'ds',
  methods: {
    pickFile() {
      this.$refs.hardwareKeyInput.click()
    },
    processed(ret){
      console.log(ret)
    }
  },
  props: {
    signData: {
      type: [String, Array]
    },
    dataType: {
      type: String,
      default: 'link',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  }
}
</script>

<style>
</style>
