export default {
  name: "DigitalSignatureRl",


  render(){
    return this.$scopedSlots.default({

      fileKey: this.fileKey,
			hardwareKey: this.hardwareKey,
			hardwareDeviceType: this.hardwareDeviceType,
			hardwareDevice: this.hardwareDevice,
			warning: this.warning,
			error: this.error,
			userCa: this.userCa,
			cas: this.cas,
			needUserCertificates: this.needUserCertificates,
			userCertificates: this.userCertificates,
			keyPassword: this.keyPassword,
			deviceTypes: this.deviceTypes,
			devices: this.devices,
			loading: this.loading,
			requestCa: this.requestCa,
			dataList: this.dataList,
			signedData: this.signedData,
      edsWrapper: this.edsWrapper,
      fileKeyName:this.fileKeyName,

      formEvents:{
        submit:this.onSubmit
      },


      hardwareKeyProps:{
        value: this.hardwareKey
      },
      hardwareKeyEvents:{
        change: (e) => {
          this.hardwareKey = e
        },
      },


      hardwareKeyInputEvents:{
        input: this.onFilePicked
      },


      hardwareDeviceProps:{
        value:this.hardwareDevice,

      },
      hardwareDeviceEvents:{
        change:(e) =>{ this.hardwareDevice = e }
      },
      refreshDevicesEvents:{
        click:this.refreshDevices
      },

      keyPasswordProps:{
        value:this.keyPassword
      },
      keyPasswordEvents:{
        change: e => { this.keyPassword = e }
      },

      submitButtonEvents:{
        click:this.handleClick
      },
      submitButtonProps:{
        disabled: !this.canSign
      },

      /** Ошибки и предупреждения */

      clearWarning:()=>{
        this.warning = null
      },
      clearError(){
        this.error = null
      }
    })
  },

  /** Свойства */
	props: {
		signData: {
			type: [String, Array]
		},
		useInternalSignification: {
			type: Boolean,
			default: function() {
				return false;
			}
		},
		dataType: {
			type: String,
			default: "link",
		},
		disabled: {
			type: Boolean,
			default: false,
		},
  },


  /** Данные */
	data: function () {
		const that = this;
		return {
			fileKey: null,
			hardwareKey: false,
			hardwareDeviceType: null,
			hardwareDevice: null,
			warning: null,
			error: null,
			userCa: null,
			cas: [],
			needUserCertificates: false,
			userCertificates: [],
			keyPassword: "",
			deviceTypes: [],
			devices: [],
			loading: false,

			requestCa: false,
			dataList: null,
			signedData: null,
			edsWrapper: null,
			callbacks: {
				onSuccess(ret) {
					console.log("Signing success:", ret);
					that.$emit("processed", { success: ret });
					if (that.dataList && that.dataList.length > 0) {
						let data = that.dataList[0];
						data.signedData = ret;
						that.signedData.push(data);
						that.dataList.shift();
					}
					if (that.dataList && that.dataList.length > 0) {
						that.execSigning();
					}
					else {
						if (that.signedData && that.signedData.length > 0) {
							that.$emit("sign", that.signedData);
							that.signedData = [];
							that.dataList = null;
						}
						else {
							that.$emit("sign", ret);
						}
					}
				},
				onWarning(e) {
					let error = that.checkfileKey();
					if (error) {
						e = error;
					}
					console.log("Signing warning:", e);
					that.$emit("processed", { warning: e });
					that.warning = e;
					that.$emit("warning", e);
				},
				onError(e) {
					console.log("Signing error:", e);
					that.$emit("processed", { error: e });
					that.error = e;
					that.$emit("error", e);
				},
			}
		};
	},


  /** Вычисляемые свойства */
	computed: {
		canSign() {
			return !this.loading
    },

    fileKeyName(){
      return (this.fileKey||{}).name
    }

  },



	mounted() {
		let self = this;
		if (!window.initEdsWrapper) {
			let interval = setInterval(function(){
				if (window.initEdsWrapper) {
					clearInterval(interval);
					self.initialize();
				}
				console.log("Try init EDS api...");
			}, 500);
		}
		else {
			this.initialize();
		}
  },

  /** Наблюдатели */
	watch: {
		userCa(newValue, oldValue) {
			this.edsWrapper.setCa(newValue);
			this.needUserCertificates = this.edsWrapper.needUserCertificates();
		},
		hardwareKey(newValue, oldValue) {
			if (newValue !== oldValue) {
				if (newValue) {
					this.warning = null;
				}
				this.hardwareChange(newValue);
			}
		},
		signData(newValue, oldValue) {
			if (newValue !== oldValue) {
				this.dataList = null;
				this.signedData = [];
				if (!this.useInternalSignification) {
					let data = newValue;
					if (data && Array.isArray(data) && data.length > 0) {
						this.dataList = data;
					}
				}
			}
		}
  },


  /** Методы */
	methods: {

		onFilePicked (e) {
			const files = e.target.files
			if(files[0] !== undefined) {
				this.fileKey = files[0]
			} else {
				this.fileKey = null
			}
		},
		initialize() {
      const that = this;
      	var params = {
				siteRoot: myConfig.GrapgQlUrl.substring(0, myConfig.GrapgQlUrl.length-1) ,
				//lang: window.locale,
				lang: this.$i18n.locale,
				allowStore: false,
				allowStoreLocal: false,
				windowMode: false,
				customUI: true,
				debugMode: true,
				// handlers
				loadingFunc(show) {
					that.loading = show;
				},
				onInit() {
					that.edsWrapper = window.edsWrapper;
					that.providerChanged();
					that.cas = [];
					for (let i = 0; i < that.edsWrapper.CAsServers.length; i += 1) {
						that.cas.push(that.edsWrapper.CAsServers[i].issuerCNs[0]);
					}
					that.userCa = that.edsWrapper.CAServerIndex;
					console.log("EDS api initialized");
        },
        onWarning(e){
	        if (e) {
						that.warning = e;
					}
        },
				onProviderChanged(e) {
					if (e) {
						that.warning = e;
					}
					that.providerChanged();
				},
				onAutoDetectCaChanged(value) {
					that.requestCa = value;
				}
			};
      window.initEdsWrapper(params);
		},
		onSubmit(evt) {
			evt.preventDefault();
			if (this.$listeners && this.$listeners.submit) {
				this.$emit("submit", this.handleClick, this.canSign);
			}
			else {
				this.handleClick();
			}
		},
		handleUpload(file) {
			this.fileKey = file;
			return false;
		},
		handleClick() {

      this.warning = null;
      if(!this.signData){
        this.warning = "Не заданы данные для подписи!"
        return
      }
      if(!this.fileKey && !this.hardwareKey){
        this.warning = "Не выбран файл ключа!"
        return
      }


			console.log("Signing data...", this.signData, this.dataType);
			this.signedData = [];
			this.execSigning();
		},

		execSigning() {
			if (this.hardwareKey) {
				this.edsWrapper.readHardwarePrivateKey(
					this.hardwareDeviceType,
					this.hardwareDevice,
					this.keyPassword,
					this.userCertificates,
					this.signingFunction,
					this.callbacks
				);
			}
			else {
				this.edsWrapper.readPrivateKey(
					[this.fileKey],
					this.keyPassword,
					this.userCertificates,
					this.signingFunction,
					this.callbacks
				);
			}
		},
		signingFunction() {
			if (this.useInternalSignification) {
				if (Array.isArray(this.signData)) {
					console.log("signDataArray", this.signData);
					this.edsWrapper.signDataArray(this.signData, true, this.callbacks);
				}
				else {
					console.log("signData", this.signData);
					this.edsWrapper.signData(this.signData, true, this.callbacks);
				}
			}
			else {
				let data = this.signData;
				if (this.dataList && this.dataList.length > 0) {
					data = this.dataList[0].link;
				}

				if (!this.dataType || this.dataType === "link") {
					console.log("signFile:", data);
					this.edsWrapper.exec({
						action: "signFile",
						actionParams: {	fileUrl: data }
					});
				}
				else if (this.dataType === "data") {
					console.log("signData:", data);
					this.edsWrapper.exec({
						action: "signData",
						actionParams: { data: data }
					});
				}
			};
		},
		providerChanged() {
      this.hardwareKey = !this.edsWrapper.isJsApi();
      if (this.hardwareKey) {
        this.readDevices(false);
      }
		},
		hardwareChange(hardwareKey) {
			this.edsWrapper.changeProvider(hardwareKey ? "agent" : "web");
		},
		deviceTypeChange() {
			this.hardwareDevice = null;
			this.devices = this.edsWrapper.getDevices(this.hardwareDeviceType);
			if (this.devices.length > 0) {
				this.hardwareDevice = 0;
			}
		},
		handleCertificatesUpload(file) {
			this.userCertificates.push(file);
			return false;
		},
		readDeviceTypes() {
			this.deviceTypes = this.edsWrapper.getDeviceTypes();
		},
		checkfileKey() {
			if (this.fileKey) {
				let fileName = this.fileKey.name;
				if (fileName) {
					if (fileName.trim().toLowerCase() === "key-11.dat") {
						return this.$t("eds.error.fileKey11");
					}
				}
			}
			return null;
		},
		readDevices(readAll) {
      const types = [
        { index: 3, name: 'смарт-карта Автор (318)', popular: true },
        { index: 4, name: 'смарт-карта BIFIT Integra 1.0', popular: false },
        { index: 5, name: 'е.ключ BIFIT iToken', popular: false },
        { index: 6, name: 'е.ключ ІІТ Алмаз-1К', popular: true },
        { index: 7, name: 'е.ключ ІІТ Алмаз-1К (носій)', popular: true },
        { index: 8, name: 'е.ключ ІІТ Кристал-1', popular: true },
        { index: 9, name: 'е.ключ ІІТ Кристал-1 (носій)', popular: true },
        { index: 10, name: 'файлова система (каталоги системи)', popular: false },
        { index: 11, name: 'файлова система (каталоги користувача)', popular: false },
        { index: 12, name: 'ID-карта громадянина (БЕН)', popular: false },
        { index: 13, name: 'криптомод. ІІТ Гряда-61 (PKCS#11)', popular: false },
        { index: 14, name: 'е.ключ ІІТ Алмаз-1К (PKCS#11)', popular: false },
        { index: 15, name: 'е.ключ ІІТ Кристал-1 (PKCS#11)', popular: false },
        { index: 16, name: 'криптомодуль ІІТ Гряда-301 (PKCS#11)', popular: false },
        { index: 17, name: 'е.ключ ІІТ Алмаз-1К (PKCS#11, віртуальний)', popular: false },
        { index: 18, name: 'е.ключ ІІТ Кристал-1 (PKCS#11, віртуальний)', popular: false },
        { index: 19, name: 'е.ключ SafeNet iKey (PKCS#11, RSA)', popular: false },
        { index: 20, name: 'е.ключ чи смарт-карта Avest (PKCS#11)', popular: false },
        { index: 21, name: 'е.ключ Ефіт Key (PKCS#11)', popular: false },
        { index: 22, name: 'е.ключ чи смарт-карта Автор (PKCS#11)', popular: true },
        { index: 23, name: 'смарт-карта Техноконс. TEllipse3 (PKCS#11)', popular: false },
        { index: 24, name: 'криптомод. ІІТ Гряда-61 (PKCS#11, носій)', popular: false },
        { index: 25, name: 'е.ключ ІІТ Алмаз-1К (PKCS#11, носій)', popular: false },
        { index: 26, name: 'е.ключ ІІТ Кристал-1 (PKCS#11, носій)', popular: false },
        { index: 27, name: 'е.ключ Aladdin eToken (PKCS#11, носій)', popular: false },
        { index: 28, name: 'е.ключ Aladdin JaCarta ASE (PKCS#11, носій)', popular: false },
        { index: 29, name: 'е.ключ SafeNet iKey (PKCS#11, носій)', popular: false },
        { index: 30, name: 'е.ключ Ефіт Key (PKCS#11, носій)', popular: false },
        { index: 31, name: 'е.ключ чи с.-карта Aladdin JaCarta (PKCS#11, носій)', popular: false },
        { index: 32, name: 'е.ключ чи с.-карта G&D SafeSign (PKCS#11, носій)', popular: false },
        { index: 33, name: 'е.ключ чи смарт-карта Avest (PKCS#11, носій)', popular: false },
        { index: 34, name: 'е.ключ чи смарт-карта Автор (PKCS#11, носій)', popular: true },
        { index: 35, name: 'смарт-карта Gemalto IDPrime (PKCS#11, носій)', popular: false },
        { index: 36, name: 'смарт-карта Техноконс. TEllipse', popular: false },
        { index: 37, name: 'смарт-карта Техноконс. TEllipse2/3', popular: false }
      ];
      const deviceTypes = readAll ? types : types.filter(i => i.popular);
      const all = this.edsWrapper.getDevicesByTypes(deviceTypes, !readAll);
      const items = [];
      if (all && all.length) {
        for (let i = 0; i < all.length; i++) {
          items.push({ text: all[i].title, value: `${all[i].typeIndex};${all[i].deviceIndex}` });
        }
      }
      this.devices = items;
    },
    refreshDevices() {
      this.readDevices(true);
    },
	},
};