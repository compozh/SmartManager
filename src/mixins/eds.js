import auth from '@/utils/auth'
import { DigitalSignature, Models } from '@it-enterprise/digital-signature'

export default {
  data: () => ({
    ds: null,
    isPrivateKey: false,
    keyType: {
      name: 'fileKey',
      value: 0
    },
    isJKSContainer: false,
    JKSPrivateKeys: [],
    JKSPrivateKey: null,
    needPrivateKeyCertificates: false,
    privateKeyCertificates: null,
    signatureInfo: null,
    signResult: null,
    keyMedias: [],
    loading: false,
    error: null
  }),

  computed: {
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

    keyType (type, oldType) {
      if (type.value === oldType.value) return
      this.initLocalState()
      this.setLibraryType()
    }
  },

  methods: {
    initLocalState () {
      this.password = null
      this.needPrivateKeyCertificates = false
      this.privateKeyCertificates = []
      this.signatureInfo = false
      this.isJKSContainer = false
      this.JKSPrivateKeys = []
      this.JKSPrivateKey = null
      this.error = null

      if (Array.isArray(this.issuerCNs) && this.issuerCNs.length > 0) {
        this.issuerCN = this.issuerCNs[0].value
      }
    },

    async setLibraryType () {
      this.loading = true
      try {
        await this.ds.setLibraryType()
        const { SW: hardKey } = Models.DigitalSignatureLibraryType
        if (this.keyType.value === hardKey && !this.keyMedias.length) {
          this.keyMedias = await this.ds.getKeyMedias()
        }
      } catch (e) {
        console.error(e)
        this.error = e
      }
      this.loading = false
    },

    dsInit () {
      const locale = this.$i18n.locale
      const { GqlUrl, WsUrl } = window.appConfig
      const models = new Models.GraphQlSettingProvider(locale, GqlUrl, WsUrl, auth)
      this.ds = new DigitalSignature(models)
    },

    async toSign () {
      this.error = null
      this.loading = true
      try {
        await this.readPrivateKey()
        await this.getSign()
        await this.signAttachment()
        this.$emit('input', false)
      } catch (e) {
        this.error = e
      }
      this.loading = false
    },

    async readPrivateKey () {
      const { JS: fileKey, SW: hardKey } = Models.DigitalSignatureLibraryType
      if (this.keyType.value === fileKey) await this.readFileKey()
      if (this.keyType.value === hardKey) await this.readHardwareKey()
    },

    readFileKey () {
      if (this.isJKSContainer && !this.JKSPrivateKey) return
      const privateKey = this.JKSPrivateKey
        ? this.JKSPrivateKey.privateKey
        : this.fileKey

      return this.ds.readFileKey(privateKey, this.password, this.privateKeyCertificates)
        .then(result => { this.signatureInfo = result })
        .catch(e => { this.needPrivateKeyCertificates = e.code === 51 })
        .catch(e => { throw Error(e.message) })
    },

    readHardwareKey () {
      this.hardwareKey.password = this.password
      return this.ds.readHardwareKey(this.hardwareKey, this.privateKeyCertificates)
        .then(result => { this.signatureInfo = result })
        .catch(e => { this.needPrivateKeyCertificates = e.code === 51 })
        .catch(e => { throw Error(e.message) })
    },

    getSign () {
      return this.ds.signFileEx(this.attachment.fileUrl, false)
        .then(result => { this.signResult = result })
        .catch(e => { throw Error(e.message) })
    },

    signAttachment () {
      const attachment = this.attachment
      const params = JSON.stringify(this.signParams)
      const { taskId, caseId } = this.$route.params
      const payload = { attachment, params, taskId, caseId }
      return this.$store.dispatch('signAttachment', payload)
    },

    async reload () {
      this.loading = true
      try {
        await this.ds.initialise()
        this.initLocalState()
        await this.setLibraryType()
        this.error = null
      } catch (e) {
        console.error(e)
        this.error = e
      }
      this.loading = false
    }
  }
}
