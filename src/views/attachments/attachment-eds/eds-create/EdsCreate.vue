<template>
  <dialog-card :value="showDialog"
               width="450px" height="500px"
               :title="$t('eds.eds')"
               :loading="loading"
               persistent
               @input="$emit('input', $event)">
    <template #text>
      <v-row>
        <v-col class="pb-0">
          <!-- Sign type selection -->
          <v-select v-model="signType"
                    :label="$t('eds.signType')"
                    :items="signItems"
                    item-text="name"
                    item-value="value"
                    menu-props="offsetY"
                    outlined dense
                    :disabled="loading"
                    class="body-1 mt-4">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-key</v-icon>
            </template>
          </v-select>

          <!-- Key center selection -->
          <v-autocomplete :items="issuerCNs"
                          v-model="issuerCN"
                          outlined dense
                          class="body-1"
                          autocomplete="off"
                          :disabled="loading"
                          :label="$t('eds.serviceProvider')"
                          :placeholder="$t('eds.providerPlaceholder')">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-passport</v-icon>
            </template>
          </v-autocomplete>

          <!-- File key -->
          <eds-file-key v-if="signType === 'fileKey'"
                        v-model="fileKey"
                        :loading="loading"
                        :password.sync="password"
                        @read-key="readPrivateKey"/>

          <!-- Hardware key -->
          <eds-hardware-key v-if="signType === 'hardwareKey'"/>

          <!-- Save key options -->
          <v-radio-group v-model="saveKeyOption"
                         hide-details
                         dense class="eds-save">
            <v-radio :label="$t('eds.notSaveKey')"
                     value="notSave"
                     class="align-start mb-4"/>
            <v-radio :label="$t('eds.saveKeyInSession')"
                     value="saveInSession"
                     class="align-start mb-4"/>
            <v-radio :label="$t('eds.saveKeyInBrowser')"
                     value="saveInBrowser"
                     class="align-start"
                     disabled/>
          </v-radio-group>
        </v-col>
      </v-row>
    </template>
    <template #actions>
      <v-spacer></v-spacer>
      <outlined-btn icon="times"
                    class="mr-2"
                    color="blue-grey"
                    :disabled="loading"
                    :handler="() => $emit('input', false)">
        <span>{{ $t('buttons.cancel') }}</span>
      </outlined-btn>
      <outlined-btn x-small
                    color="success"
                    icon="check"
                    :disabled="!fileKey || !password || loading"
                    :handler="() => readPrivateKey()">
        <span>{{ $t('eds.sign') }}</span>
      </outlined-btn>
    </template>
  </dialog-card>
</template>

<script>
import EdsFileKey from './EdsFileKey'
import EdsHardwareKey from './EdsHardwareKey'
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'
import eds from '@/mixins/eds'

export default {
  name: 'EdsCreate',
  mixins: [eds],
  model: {
    prop: 'showDialog'
  },
  props: {
    attachment: Object,
    showDialog: Boolean
  },
  components: {
    EdsFileKey,
    EdsHardwareKey,
    DialogCard,
    OutlinedBtn
  },
  data: () => ({
    signType: 'fileKey',
    fileKey: null,
    issuerCN: null,
    issuerCNs: [],
    password: null,
    hardwareKey: null,
    saveKeyOption: 'notSave'
  }),
  computed: {
    signItems () {
      return [
        {
          name: this.$t('eds.fileKey'),
          value: 'fileKey'
        },
        {
          name: this.$t('eds.hardwareKey'),
          value: 'hardwareKey'
        }
        // {
        //   name: this.$t('eds.depositSign'),
        //   value: 'depositSign'
        // }
      ]
    },
    signParams () {
      if (this.signResult) {
        const sign = this.signResult.SignatureInfo.OwnerInfo
        const date = this.signResult.SignatureInfo.DateTimeStr
        return {
          signature: this.signResult.Sign,
          signDate: date,
          fio: sign.subjCN || sign.subjFullName,
          email: sign.subjEMail,
          post: sign.subjTitle,
          organization: sign.subjOrg,
          city: sign.subjLocality,
          organizationStateCode: sign.subjEDRPOUCode,
          userStateCode: sign.subjDRFOCode,
          keyCenter: sign.issuerCN,
          keyNumber: sign.serial
        }
      }
      return null
    }
  },
  created () {
    this.$emit('update:loading', false)
  },
  async mounted () {
    this.loading = true
    this.dsInit()
    // Save key in current session
    if (this.saveKeyOption === 'saveInSession') {
      window.ds = this.ds
    }
    await this.ds.initialise()
    const getCAsResult = await this.ds.getCAs()
    const issuerCNs = getCAsResult.map(ca => ({ text: ca.issuerCNs[0], value: ca }))
    const autoDetect = { text: this.$t('eds.autoDetect'), value: null }
    this.issuerCNs = [autoDetect, ...issuerCNs]
    this.issuerCN = this.issuerCNs[0].value
    this.loading = false
  }
}
</script>
