<template>
  <dialog-card :value="showDialog"
               width="400px" height="500px"
               :title="$t('eds.sign')"
               :loading="loading"
               persistent
               @input="$emit('input', $event)">
    <template #text>
      <v-row class="mt-6">
        <v-col v-if="signType === 0">

          <!-- Sign type selection -->
          <v-select v-model="signType"
                    :label="$t('eds.signType')"
                    :items="signItems"
                    item-text="name"
                    menu-props="offsetY"
                    outlined dense
                    :disabled="loading"
                    class="body-1 mb-4">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-key</v-icon>
            </template>
          </v-select>

          <!-- Key center selection -->
          <v-autocomplete :items="issuerCNs"
                          v-model="issuerCN"
                          outlined dense
                          class="body-1 mb-4"
                          autocomplete="off"
                          :disabled="loading"
                          :label="$t('eds.serviceProvider')"
                          :placeholder="$t('eds.providerPlaceholder')">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-passport</v-icon>
            </template>
          </v-autocomplete>

          <!-- File key input -->
          <v-file-input v-model="fileKey"
                        :label="$t('eds.privateKey')"
                        :placeholder="$t('eds.selectKey')"
                        outlined dense
                        prepend-icon=""
                        :clearable="false"
                        :show-size="1000"
                        :disabled="loading"
                        autocomplete="off"
                        class="body-1 clearable mb-4">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-paperclip</v-icon>
            </template>
            <template #selection="{ text }">
              <v-chip label small color="primary">{{ text }}</v-chip>
            </template>
            <template #append>
              <v-btn icon small class="clear-btn"
                     @click="fileKey = null">
                <fa-icon icon="times" type="fal" size="lg"/>
              </v-btn>
            </template>
          </v-file-input>

          <!-- Key password input -->
          <v-text-field v-model="password"
                        :label="$t('login.password')"
                        :placeholder="$t('login.passwordPlaceholder')"
                        outlined dense
                        name="password"
                        type="password"
                        hide-details
                        :disabled="loading"
                        autocomplete="off"
                        @keyup.enter="readPrivateKey"
                        class="body-1 clearable mb-4">
            <template #prepend-inner>
              <v-icon small class="pt-1 pr-2">fas fa-unlock</v-icon>
            </template>
            <template #append>
              <v-btn icon small class="clear-btn"
                     @click="password = null">
                <fa-icon icon="times" type="fal" size="lg"/>
              </v-btn>
            </template>
          </v-text-field>

          <!-- Sign info -->
          <eds-read-info v-if="showSignatureInfo"
                         v-model="showSignatureInfo"
                         :signature="signatureInfo"
                         @sign="sign"/>
        </v-col>
<!-- Other sign types -->
<!--        <v-col v-if="signType === 1">-->
<!--          {{ $t('eds.hardwareKey') }}-->
<!--        </v-col>-->
<!--        <v-col v-if="signType === 2">-->
<!--          {{ $t('eds.mobileId') }}-->
<!--        </v-col>-->
<!--        <v-col v-if="signType === 3">-->
<!--          {{ $t('eds.widget') }}-->
<!--        </v-col>-->
<!--        <v-col v-if="signType === 4">-->
<!--          {{ $t('eds.depositSign') }}-->
<!--        </v-col>-->
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
      <outlined-btn v-if="!signatureInfo"
                    x-small
                    color="primary"
                    icon="inbox-in"
                    :disabled="!fileKey || !password || loading"
                    :handler="readPrivateKey">
        <span>{{ $t('eds.readEds') }}</span>
      </outlined-btn>
    </template>
  </dialog-card>
</template>

<script>
import auth from '@/utils/auth'
import DialogCard from '@/components/DialogCard'
import OutlinedBtn from '@/components/OutlinedBtn'

import {
  DigitalSignature,
  Models,
  Utils
} from '@it-enterprise/digital-signature'

const EdsReadInfo = () => import('./EdsReadInfo')

export default {
  name: 'EdsCreate',
  model: {
    prop: 'showDialog'
  },
  props: {
    attachment: Object,
    showDialog: Boolean
  },
  components: {
    DialogCard,
    OutlinedBtn,
    EdsReadInfo
  },
  data: () => ({
    signType: 0,
    ds: null,
    loading: false,
    step: 1,
    keyType: 0,
    fileKey: null,
    issuerCN: null,
    issuerCNs: [],
    isJKSContainer: false,
    JKSPrivateKeys: [],
    JKSPrivateKey: null,
    password: null,
    needPrivateKeyCertificates: false,
    privateKeyCertificates: null,
    signatureInfo: null,
    file: null,
    signResult: null,
    keyMedias: [],
    hardwareKey: null,
    showSignatureInfo: false
  }),
  computed: {
    signItems () {
      return [
        {
          name: this.$t('eds.fileKey'),
          value: 0
        }
        // {
        //   name: this.$t('eds.hardwareKey'),
        //   value: 1
        // },
        // {
        //   name: this.$t('eds.mobileId'),
        //   value: 2
        // },
        // {
        //   name: this.$t('eds.widget'),
        //   value: 3
        // },
        // {
        //   name: this.$t('eds.depositSign'),
        //   value: 4
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
          // verification: sign.subj,
          // verificationDate: sign.subj
        }
      }
      return null
    }
  },
  watch: {
    fileKey (key) {
      if (!key || !(key instanceof File)) {
        this.isJKSContainer = false
        return
      }
      this.isJKSContainer = this.ds.isJKSContainer(key)
    },
    async isJKSContainer (value) {
      if (!value) {
        this.JKSPrivateKeys = []
        this.JKSPrivateKey = null
        return
      }
      this.JKSPrivateKeys = await this.ds.getJKSPrivateKeys(this.fileKey)
      this.JKSPrivateKey = this.JKSPrivateKeys[0]
    },
    async issuerCN (CA) {
      await this.ds.setCA(CA)
      this.needPrivateKeyCertificates = this.ds.needPrivateKeyCertificates()
    },
    async keyType (value, oldValue) {
      if (value === oldValue) {
        return
      }
      this.loading = true
      this.password = null
      this.needPrivateKeyCertificates = false
      this.privateKeyCertificates = []
      this.signatureInfo = false
      this.password = null
      // this.issuerCN = this.issuerCNs[0].value
      this.isJKSContainer = false
      this.JKSPrivateKeys = []
      this.JKSPrivateKey = null

      try {
        await this.ds.setLibraryType(value)
        if (value === Models.DigitalSignatureLibraryType.SW && !this.keyMedias.length) {
          this.keyMedias = await this.ds.getKeyMedias()
          this.hardwareKey = this.keyMedias[0]
        }
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    }
  },
  created () {
    this.$emit('update:loading', false)
  },
  async mounted () {
    this.loading = true
    this.ds = new DigitalSignature(new Models.GraphQlSettingProvider(this.$i18n.locale,
      window.appConfig.GrapgQlUrl, 'https://m.it.ua/ws/', auth))

    await this.ds.initialise()
    const getCAsResult = await this.ds.getCAs()
    const issuerCNs = getCAsResult.map(ca => ({ text: ca.issuerCNs[0], value: ca }))
    const autoDetect = { text: this.$t('eds.autoDetect'), value: null }
    this.issuerCNs = [autoDetect, ...issuerCNs]
    this.issuerCN = this.issuerCNs[0].value
    this.loading = false
  },
  methods: {
    async readPrivateKey () {
      this.loading = true
      if (this.keyType === Models.DigitalSignatureLibraryType.JS) {
        let privateKey

        if (this.isJKSContainer) {
          if (!this.JKSPrivateKey) {
            this.loading = false
            return
          }
          privateKey = this.JKSPrivateKey.privateKey
        } else {
          privateKey = this.fileKey
        }
        try {
          this.signatureInfo = await this.ds.readFileKey(
            privateKey,
            this.password,
            this.privateKeyCertificates)
          this.showSignatureInfo = true
        } catch (e) {
          console.error(e)
          if (e.code === 51) {
            this.needPrivateKeyCertificates = true
            this.loading = false
            return
          }
        }
      } else if (this.keyType === Models.DigitalSignatureLibraryType.SW) {
        try {
          this.hardwareKey.password = this.password
          this.signatureInfo = await this.ds.readHardwareKey(
            this.hardwareKey,
            this.privateKeyCertificates)
          this.showSignatureInfo = true
        } catch (e) {
          console.error(e)
          if (e.code === 51) {
            this.needPrivateKeyCertificates = true
            this.loading = false
            return
          }
        }
      }
      this.loading = false
    },
    async sign () {
      this.showSignatureInfo = false
      this.loading = true
      await this.getSign()
      await this.signAttachment()
      this.loading = false
      this.$emit('input', false)
    },
    async getSign () {
      const data = await Utils.downloadData(this.attachment.url)
      this.signResult = await this.ds.signDataEx(data)
    },
    signAttachment () {
      const attachment = this.attachment
      const params = JSON.stringify(this.signParams)
      const { taskId, caseId } = this.$route.params
      const payload = { attachment, params, taskId, caseId }
      this.$store.dispatch('signAttachment', payload)
    }
  }
}
</script>
