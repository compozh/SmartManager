import auth from '@/utils/auth'
import { DigitalSignature, Models } from '@it-enterprise/digital-signature'

export default {
  data: () => ({
    ds: null,
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
    error: null,
    progressBarValue: 0
  }),

  computed: {
    keyParams () {
      const ds = this.ds || window.ds
      const sign = ds.readedKey.ownerInfo
      return {
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
    },

    privateKeyIsSaved () {
      return this.$store.state.app.privateKeyIsSaved
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
      if (type === oldType) return
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

    async postInitActions () {
      const preferKeyType = await this.ds.initialise()
      this.keyType = this.signItems.find(type => type.value === preferKeyType)

      const getCAsResult = await this.ds.getCAs()
      const issuerCNs = getCAsResult.map(ca => ({ text: ca.issuerCNs[0], value: ca }))
      const autoDetect = { text: this.$t('eds.autoDetect'), value: null }

      this.issuerCNs = [autoDetect, ...issuerCNs]
      this.issuerCN = this.issuerCNs[0].value
    },

    async toSign () {
      this.error = null
      this.loading = true
      try {
        if (!this.privateKeyIsSaved) {
          await this.readPrivateKey()
        }

        if (this.multipleSign) {
          await this.runMultipleSign()
        } else {
          await this.getSign(this.attachment.fileUrl)
          await this.signAttachment()
        }

        this.$emit('input', false)
      } catch (e) {
        this.resetPrivateKey()
        this.error = e
      }
      this.loading = false
    },

    async readPrivateKey () {
      const { JS: fileKey, SW: hardKey } = Models.DigitalSignatureLibraryType
      if (this.keyType.value === fileKey) await this.readFileKey()
      if (this.keyType.value === hardKey) await this.readHardwareKey()
      // Save key in current session
      if (this.saveKeyOption === 'saveInSession') {
        window.ds = this.ds
        this.$store.commit('SET_PRIVATE_KEY', true)
      }
    },

    readFileKey () {
      if (this.isJKSContainer && !this.JKSPrivateKey) return
      const privateKey = this.JKSPrivateKey
        ? this.JKSPrivateKey.privateKey
        : this.fileKey

      return this.ds.readFileKey(privateKey, this.password, this.privateKeyCertificates)
        .then(result => { this.signatureInfo = result.ownerInfo })
        .catch(e => {
          this.needPrivateKeyCertificates = e.code === 51
          throw Error(e.message)
        })
    },

    readHardwareKey () {
      this.hardwareKey.password = this.password
      return this.ds.readHardwareKey(this.hardwareKey, this.privateKeyCertificates)
        .then(result => { this.signatureInfo = result.ownerInfo })
        .catch(e => {
          this.needPrivateKeyCertificates = e.code === 51
          throw Error(e.message)
        })
    },

    async runMultipleSign () {
      this.progressBar = true
      const keyParams = JSON.stringify(this.keyParams)
      for (const attachment of this.attachments) {
        const result = await this.$store.dispatch('beforeSignAttachment', {
          attachment, keyParams
        })
        if (result?.FileUrl) {
          await this.getSign(result.FileUrl)
          await this.signAttachmentMultiple(result.Id)
        }
        if (result === null) {
          await this.getSign(attachment.url)
          await this.signAttachmentMultiple(attachment.id)
        }
        this.progressBarValue++
      }
      // Timeout for show progress bar end
      await new Promise(resolve => {
        setTimeout(() => resolve(this.$emit('sign-done')), 500)
      })
    },

    getSign (fileUrl) {
      const ds = this.ds || window.ds
      return ds.signFileEx(fileUrl, false)
        .then(result => { this.signResult = result })
        .catch(e => { throw Error(e.message) })
    },

    signAttachment (attachmentParams) {
      const attachment = attachmentParams || this.attachment
      const signParams = JSON.stringify(this.signParams)
      const { taskId, caseId } = this.$route.params
      const payload = { attachment, signParams, taskId, caseId, needUpdate: true }
      return this.$store.dispatch('signAttachment', payload)
    },

    signAttachmentMultiple (fileId) {
      const signParams = JSON.stringify(this.signParams)
      return this.$store.dispatch('signAttachment', { fileId, signParams })
    },

    async reload () {
      this.loading = true
      this.ds || this.dsInit()
      try {
        await this.postInitActions()
        this.initLocalState()
        await this.setLibraryType()
        this.error = null
      } catch (e) {
        console.error(e)
        this.error = e
      }
      this.loading = false
    },

    resetPrivateKey () {
      if (window.ds) {
        window.ds.resetPrivateKey()
      }
      this.$store.commit('SET_PRIVATE_KEY', false)
    }
  }
}
