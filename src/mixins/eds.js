import auth from '@/utils/auth'
import { DigitalSignature, Models } from '@it-enterprise/digital-signature'

export default {
  data: () => ({
    ds: null,
    isPrivateKey: false,
    keyType: 0,
    isJKSContainer: false,
    JKSPrivateKeys: [],
    JKSPrivateKey: null,
    needPrivateKeyCertificates: false,
    privateKeyCertificates: null,
    signatureInfo: null,
    signResult: null,
    keyMedias: [],
    loading: false
  }),
  async created () {
    if (window.ds) {
      this.isPrivateKey = await window.ds.isPrivateKeyReaded()
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
  methods: {
    dsInit () {
      this.ds = new DigitalSignature(new Models.GraphQlSettingProvider(
        this.$i18n.locale,
        window.appConfig.GrapgQlUrl,
        'https://m.it.ua/ws/',
        auth))
    },
    async readPrivateKey () {
      console.log('readPrivateKey')
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
          // Calling sign method after getting signatureInfo
          await this.sign()
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
      this.loading = true
      await this.getSign()
      await this.signAttachment()
      this.loading = false
      this.$emit('input', false)
    },
    async getSign () {
      this.signResult = await this.ds.signFileEx(this.attachment.fileUrl, false)
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
