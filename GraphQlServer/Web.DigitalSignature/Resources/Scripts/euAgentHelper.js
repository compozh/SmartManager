(function () {
	var euSign = null;

	function getErrorMessage(e) {
		var message = "";
		if (typeof (e) === "string") {
			message = e;
		}
		if (e.message != undefined) {
			message = e.message;
		}
		else if (e.GetMessage != undefined) {
			message = e.GetMessage();
		}
		return message;
	}

	var translates = {
		ru: {
			"RecepientCerts": "Выберите сертификаты получателей",
			"MoreRecepientCerts": "Выбрать следующий сертификат получателя?",
			"NoRecepientCerts": "Не указаны сертификаты получателей",
			"PrivateKeyCerts": "Выберите сертификаты приватного ключа",
			"MorePrivateKeyCerts": "Выбрать следующий сертификат?"
		},
		en: {
			"RecepientCerts": "Select recipients certificates",
			"MoreRecepientCerts": "Select next recipient certificate?",
			"NoRecepientCerts": "No certificate selected",
			"PrivateKeyCerts": "Select the private key certificates",
			"MorePrivateKeyCerts": "Select next certificate?"
		},
		uk: {
			"RecepientCerts": "Виберіть сертифікати одержувачів",
			"MoreRecepientCerts": "Вибрати наступний сертифікат одержувача?",
			"NoRecepientCerts": "Жодного сертифіката не вибрано",
			"PrivateKeyCerts": "Виберіть сертифікати приватного ключа",
			"MorePrivateKeyCerts": "Вибрати наступний сертифікат?"
		}
	}

	var EU_KEY_USAGE_UNKNOWN = 0x0000;
	var EU_KEY_USAGE_DIGITAL_SIGNATURE = 0x0001;
	var EU_KEY_USAGE_KEY_AGREEMENT = 0x0010;
	var EU_CERT_KEY_TYPE_UNKNOWN = 0x00;
	var EU_CERT_KEY_TYPE_DSTU4145 = 0x01;
	var EU_CERT_KEY_TYPE_RSA = 0x02;

	var EU_SIGN_TYPE_UNKNOWN = 0;
	var EU_SIGN_TYPE_CADES_BES = 1;
	var EU_SIGN_TYPE_CADES_T = 4;
	var EU_SIGN_TYPE_CADES_C = 8;
	var EU_SIGN_TYPE_CADES_X_LONG = 16;

	//=============================================================================

	var EU_RESOLVE_OIDS_PARAMETER = 'ResolveOIDs';
	var EU_MAKE_PKEY_PFX_CONTAINER_PARAMETER = 'MakePKeyPFXContainer';
	var EU_SIGN_INCLUDE_CONTENT_TIME_STAMP_PARAMETER = 'SignIncludeContentTimeStamp';
	var EU_SIGN_TYPE_PARAMETER = 'SignType';

	function base64String(array) {
		var bytes;
		var i;
		var bytesLength;
		var base64Str = '';
		var m_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		bytes = new Uint8Array(array);
		bytesLength = bytes.length;

		for (i = 0; i < bytesLength; i += 3) {
			base64Str += m_map[bytes[i] >> 2];
			base64Str += m_map[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			base64Str += m_map[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			base64Str += m_map[bytes[i + 2] & 63];
		}

		if ((bytesLength % 3) === 2) {
			base64Str = base64Str.substring(0, base64Str.length - 1) + '=';
		} else if (bytesLength % 3 === 1) {
			base64Str = base64Str.substring(0, base64Str.length - 2) + '==';
		}

		return base64Str;
	};

	function isCAOfflineOnly(cas, caName) {
		var offline = false;
		for (var i = 0; i < cas.length; i++) {
			var ca = cas[i];
			if (ca.ocspAccessPointAddress === "") {
				for (var j = 0; j < ca.issuerCNs.length; j++) {
					if (caName.indexOf(ca.issuerCNs[j]) >= 0) {
						offline = true;
						break;
					}
				}
			}
		}
		return offline;
	}

	function formatDate(d) {
		return ("00" + d.getDate()).slice(-2) +
			"." +
			("00" + (d.getMonth() + 1)).slice(-2) +
			"." +
			d.getFullYear() +
			" " +
			("00" + d.getHours()).slice(-2) +
			":" +
			("00" + d.getMinutes()).slice(-2) +
			":" +
			("00" + d.getSeconds()).slice(-2);
	}

	function EUAgentHelper() {
		this.caInitialized = false;
	}

	EUAgentHelper.prototype.initialize = function (params, success, error) {
		this.Certificates = params.certificates;
		this.CAServers = params.casServers;
		this.successCallback = function (obj) {
			params.onSuccess(obj);
		}
		this.detectCaFailed = params.onDetectCaFailed;
		this.lang = params.lang;
		this.getAutoDetect = params.getAutoDetect;
		this.errorCallback = params.onError;
		this.warningCallback = params.onWarning;
		this.setLocalStorageItem = params.setLocalStorageItem;
		this.getLocalStorageItem = params.getLocalStorageItem;
		EndUserStrings.DESCRIPTIONS[EndUserStrings.WEB_LIBRARY_NOT_INSTALLED_OR_RUN] =
		[
			'Бібліотеку web-підпису не запущено або не інстальовано у системі. Для продовження необхідно запустити або інсталювати бібліотеку web-підпису.<br/>' +
			'Також необхідно, щоб було встановлене програмне забезпечення для підтримки ключа операційною системою. <br/>'+
			'Користувачі, які мають електронний ключ «Кристал-1», можуть завантажити інсталяційний пакет конфігурації електронного ключа тут: <a target="_blank" href="https://acskidd.gov.ua/kristal_1">https://acskidd.gov.ua/kristal_1</a>',
			'Библиотека web-подписи не запущена или не установлена в системе. Для продолжения необходимо запустить или установить библиотеку web-подписи.<br/>' +
			'Также необходимо установить программное обеспечение для поддержки ключа операционной системой. <br/>' +
			'Пользователи, которые имеют электронный ключ «Кристалл-1», могут скачать установочный пакет конфигурации электронного ключа здесь: <a target="_blank" href="https://acskidd.gov.ua/kristal_1">https://acskidd.gov.ua/kristal_1</a>', ,
			'The library for the web signature isn\'t started or not installed in system. To continue, it is necessary to start or install library for the web signature.<br/>' +
			'It is also necessary to install software that enable supports of the key by operation system. <br/>' +
			'Users who have the Crystal-1 electronic key can download the configuration package for the electronic key here: <a target="_blank" href="https://acskidd.gov.ua/kristal_1">https://acskidd.gov.ua/kristal_1</a>'
		];

		this.initLibrary(success, error);
	}

	EUAgentHelper.prototype.initLibrary = function(success, error) {
		var libraryType = EndUserLibraryLoader.LIBRARY_TYPE_SIGN_AGENT;

		var libraryLoader = new EndUserLibraryLoader(libraryType, "euSign", this.lang);
		EndUserLibraryLoader.isWebExtensionSupported = function () {
			return false;
		}
		libraryLoader.onerror = function (msg, code) {
			error(msg, code);
		};

		var that = this;
		libraryLoader.onload = function (library) {
			window.euSign = euSign = library;
			try {
				euSign.SetCharset("UTF-16LE");
				euSign.SetLanguage(that.lang);
				euSign.Initialize();
				that.setDefaultSettings();
				try {
					var path = euSign.GetFileStoreSettings().GetPath();
					if (path) {
						euSign.WriteFile(path + "\\CACertificates.p7b", that.Certificates);
					}
				} catch (exception) {

				}
				euSign.width = "1px";
				success();
			} catch (e) {
				error(e);
			}
		};

		libraryLoader.load();
	}

	EUAgentHelper.prototype.setDefaultSettings = function () {
		if (!euSign.DoesNeedSetSettings()) {
			return;
		}
		var fileStorageSetting = euSign.CreateFileStoreSettings();
		euSign.SetFileStoreSettings(fileStorageSetting);

		var proxySettings = euSign.CreateProxySettings();
		euSign.SetProxySettings(proxySettings);

		var ocspSettings = euSign.CreateOCSPSettings();
		euSign.SetOCSPSettings(ocspSettings);

		var tspSettings = euSign.CreateTSPSettings();
		euSign.SetTSPSettings(tspSettings);

		var ldapSettings = euSign.CreateLDAPSettings();
		euSign.SetLDAPSettings(ldapSettings);

		var cmpSettings = euSign.CreateCMPSettings();
		euSign.SetCMPSettings(cmpSettings);
	}

	EUAgentHelper.prototype.getPhase = function (key) {
		var lang = "ru";
		switch (this.lang) {
			case 1:
				lang = "uk";
				break;
			case 3:
				lang = "ru";
				break;
		}
		return translates[lang][key];
	}

	EUAgentHelper.prototype.verifyFile = function (fileData, signFileData, hash) {
		this.verifyData(base64String(signFileData), fileData, hash, false, null);
	}

	EUAgentHelper.prototype.verifyData = function (signedData, data, hash, internal, dateTime) {
		var that = this;
		try {
			var info;
			var signerInfo = euSign.GetSignerInfo(0, signedData);
			var offline = isCAOfflineOnly(this.CAServers, signerInfo.GetIssuerCN());
			if (hash) {
				info = euSign.VerifyHashOnTimeEx(base64String(data), 0, signedData, dateTime, offline, false);
			} else {
				if (internal) {
					info = euSign.VerifyDataInternalOnTimeEx(signedData, 0, dateTime, offline, false);
				} else {
					info = euSign.VerifyDataOnTimeEx(data, 0, signedData, dateTime, offline, false);
				}
			}
			var owner = info.GetOwnerInfo();
			if (owner.fields) {
				delete owner.fields;
				owner.fields = null;
			}
			var cert = euSign.ParseCertificate(euSign.GetSignerCertificate(0, signedData));
			var beginTime = cert.GetCertBeginTime();
			var endTime = cert.GetCertEndTime();
			that.successCallback({
				Success: true,
				DateTimeStr: info.GetTimeInfo() != undefined ? formatDate(info.GetTimeInfo().GetTime()) : null,
				CertBeginTimeStr: formatDate(beginTime),
				CertEndTimeStr: formatDate(endTime),
				Signer: info.GetOwnerInfo() != undefined ? info.GetOwnerInfo().GetSubjFullName() : "",
				FailReason: "",
				OwnerInfo: owner,
				Result: info.GetData() ? euSign.BytesToString(info.GetData()) : null
			});
		} catch (e) {
			if (this.needTryReInit(e)) {
				this.initLibrary(function () {
					that.verifyData(signedData, data, hash, internal, dateTime);
				},
					function (ex) {
						that.errorCallback(ex);
					});
			} else {
				this.errorCallback(e);
			}
		}
	}

	EUAgentHelper.prototype.needTryReInit = function(e) {
		if (e.errorCode === 4097) {
			var euSignObj = document.getElementById("euSign");
			if (euSignObj) {
				euSignObj.remove();
			}
			euSign.m_jsonRpcClient.m_session_id = null;
			euSign.m_jsonRpcClient.m_requests = 0;
			return true;
		}
		return false;
	}

	EUAgentHelper.prototype.envelopFile = function (data, files) {
		var that = this;
		var successFunc = function (ret) {
			that.successCallback({
				Success: true,
				Result: ret
			});
		}
		var errorFunc = function(ex) {
			if (that.needTryReInit(ex)) {
				that.initLibrary(function() {
						that.envelopFile(data, files);
					},
					function(e) {
						that.errorCallback(e);
					});
			} else {
				that.errorCallback(ex);
			}
		}
		var envelopFunc = function (ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				var certificates = euSign.CreateArrayList();
				var rsaKey = that.IsRsaKey(true);
				if (rsaKey) {
					while (true) {
						var fileName = euSign.SelectFileEx(true, "", null, null, null, that.getPhase("RecepientCerts"));
						if (fileName === "")
							break;

						certificates.add(euSign.ReadFile(fileName));

						if (!confirm(that.getPhase("MoreRecepientCerts")))
							break;
					}
				} else {
					var infos = euSign.GetReceiversCertificates();
					for (var i = 0; i < infos.length; i++) {
						certificates.add(euSign.GetCertificate(infos[i].issuer, infos[i].serial));
					}
				}
				if (certificates.size() < 1) {
					that.warningCallback(that.getPhase("NoRecepientCerts"));
					return;
				}
				if (!rsaKey) {
					euSign.EnvelopToRecipients(certificates, false, data, successFunc, errorFunc);
				} else {
					var kepAlg = 7; //AES
					euSign.EnvelopToRecipientsRSA(kepAlg, certificates, false, data, successFunc, errorFunc);
				}
			} catch (ex) {
				errorFunc(ex);
			}
		}

		envelopFunc();
	}

	EUAgentHelper.prototype.developFile = function (data) {
		var that = this;
		var successFunc = function (ret) {
			that.successCallback({
				Success: true,
				Result: base64String(ret)
			});
		}
		var errorFunc = function(e) {
			if (that.needTryReInit(e)) {
				that.initLibrary(function() {
						that.developFile(data);
					},
					function(ex) {
						that.errorCallback(ex);
					});
			} else {
				that.errorCallback(e);
			}
		}
		var developFunc = function (ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				euSign.Develop(base64String(data), false, successFunc, errorFunc);
			} catch (e) {
				errorFunc(e);
			}
		}
		developFunc();
	}

	EUAgentHelper.prototype.isKeyReaded = function() {
		try {
			return euSign.IsPrivateKeyReaded();
		} catch (e) {
		}
		return false;
	}

	EUAgentHelper.prototype.clearKey = function () {
		euSign.ResetOperation();
		euSign.ResetPrivateKey();
    }

	EUAgentHelper.prototype.getDeviceTypes = function (preferedTypes) {
		if (this.currentDeviceTypes) {
			return this.currentDeviceTypes;
		}
        var types = [];
        var typeIndex = 0;
		if (!preferedTypes) {
			preferedTypes = [];
		}
		if (preferedTypes.length) {
			var cached = this.checkCacheDeviceTypes(preferedTypes);
			if (cached != null && cached.length) {
				return cached;
			}
		}

        while (true) {
			var result = euSign.EnumKeyMediaTypes(parseInt(typeIndex, 10));
            if (result == "") {
                break;
            }
            if (!preferedTypes.length || preferedTypes.indexOf(result) >= 0) {
	            types.push({ index: typeIndex, name: result });
            }
            typeIndex++;
        }
		if (preferedTypes.length) {
			this.setLocalStorageItem("DEVICES", JSON.stringify(types));
		}
		this.currentDeviceTypes = types;
        return types;
	}

	EUAgentHelper.prototype.getDevicesByTypes = function (types, allowCache) {
		if (allowCache && this.devicesCache) {
			return this.devicesCache;
		}
		var ret = [];
		for (var i = 0; i < types.length; i++) {
			var type = types[i];
			var devices = this.getDevices(type.index);
			if (devices.length) {
				for (var j = 0; j < devices.length; j++) {
					ret.push({
						typeIndex: type.index,
						deviceIndex: devices[j].index,
						title: type.name + ": " + devices[j].name
					});
				}
			}
		}
		this.devicesCache = ret;
		return ret;
	}
	
	EUAgentHelper.prototype.getAllAvailableDevices = function (preferedTypes) {
		var types = this.getDeviceTypes(preferedTypes);
		return this.getDevicesByTypes(types);
	}

    EUAgentHelper.prototype.checkCacheDeviceTypes = function (preferedTypes) {
		if (!window.localStorage) {
			return null;
		}
		//TODO:
		var cachedTypesStr = this.getLocalStorageItem("DEVICES");
		if (!cachedTypesStr) {
			return null;
		}
		var cachedTypes = null;
		try {
			cachedTypes = JSON.parse(cachedTypesStr);
		} catch (e) {
		}
		if (!cachedTypes || !cachedTypes.length || cachedTypes.length !== preferedTypes.length) {
			return null;
		}
		var useCached = true;
		for (var i = 0; i < cachedTypes.length; i++) {
			var iitName = euSign.EnumKeyMediaTypes(cachedTypes[i].index);
			if (iitName === cachedTypes[i].name && preferedTypes.indexOf(iitName) >= 0) {
				continue;
			}
			useCached = false;
			break;
		}
		if (useCached) {
			return cachedTypes;
		}
		return null;
	}

    EUAgentHelper.prototype.getDevices = function(typeIndex) {

        var deviceIndex = 0;
        var devices = [];
		
        while (true) {

            var result = euSign.EnumKeyMediaDevices(parseInt(typeIndex, 10), parseInt(deviceIndex, 10));
            if (result == "") {
                break;
            }
            devices.push({ index: deviceIndex, name: result });
            deviceIndex++;
        }
        return devices;
    }
	
	EUAgentHelper.prototype.readStoredPrivateKey = function (callback) {
		callback(false);
	}

	EUAgentHelper.prototype.signData = function (data, internal) {
		var that = this;
		var successFunc = function (sign) {
			that.successCallback({ Success: true, Sign: sign, FailReason: "" });
		}
		var errorFunc = function(e) {
			if (this.needTryReInit(e)) {
				that.initLibrary(function() {
						that.signData(data, internal);
					},
					function(ex) {
						that.errorCallback(ex);
					});
			} else {
				that.errorCallback(e);
			}
		}
		var signFunc = function (ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				if (that.CAIndex !== undefined || !that.caInitialized) {
					that.setCA(that.CAIndex);
				}
				euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_BES);
				if (!internal) {
					if (!that.IsRsaKey(false)) {
						euSign.Sign(data, successFunc, errorFunc);
					} else {
						euSign.SignRSA(data, true, true, successFunc, errorFunc);
					}
				} else {
					if (!that.IsRsaKey(false)) {
						euSign.SignInternal(true, data, successFunc, errorFunc);
					} else {
						euSign.SignRSA(data, true, false, successFunc, errorFunc);
					}
				}
				
			} catch (e) {
				errorFunc(e);
			}
		}
		signFunc();

	}

	EUAgentHelper.prototype.getKeyInfo = function (convertFunc) {
		var that = this;
		var successFunc = function (info) {
			that.successCallback(convertFunc(info));
		}
		var errorFunc = function (e) {
			if (this.needTryReInit(e)) {
				that.initLibrary(function () {
					that.getKeyInfo(convertFunc);
					},
					function (ex) {
						that.errorCallback("-\r\n" + getErrorMessage(ex));
					});
			} else {
				that.errorCallback("-\r\n" + getErrorMessage(e));
			}
		}
		var func = function (ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_BES);
				successFunc(euSign.GetPrivateKeyOwnerInfo());
			} catch (e) {
				errorFunc(e);
			}
		}
		func();
	}

    EUAgentHelper.prototype.signDataArray = function(data, internal) {
        var that = this;
        var results = [];
		var signFunc = function(ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				if (that.CAIndex !== undefined || !that.caInitialized) {
					that.setCA(that.CAIndex);
				}
				euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_BES);
			} catch (e) {
				that.errorCallback(e);
            }
			that.signDataArrayInternal(data, internal, 0, results);
		}
		signFunc();

    }

    EUAgentHelper.prototype.signDataArrayInternal = function(data, internal, index, results) {
		if (index === data.length) {
			this.successCallback(results);
			return;
		}
        var current = data[index];
	    var that = this;
		var next = function() {
			that.signDataArrayInternal(data, internal, index + 1, results);
		}
		var success = function (sign) {
			results.push({ success: true, sign: sign, failReason: "", id: current.id, signer: euSign.GetPrivateKeyOwnerInfo() });
			next();
		}
		var error = function (e) {
			that.errorCallback(e);
		}
        try {
            if (current.emulateError) {
	            throw { message: "fail to sign" };
            }
			if (!internal) {
				if (!this.IsRsaKey(false)) {
					euSign.Sign(current.data, success, error);
				} else {
					euSign.SignRSA(current.data, true, true, success, error);
				}
			} else {
				if (!this.IsRsaKey(false)) {
					euSign.SignInternal(true, current.data, success, error);
				} else {
					euSign.SignRSA(current.data, true, false, success, error);
				}
			}
        } catch (ex) {
			error(ex);
		}

	}

	EUAgentHelper.prototype.signFile = function (data, hash) {
		var that = this;
		var successFunc = function (signature, hash) {
			var info;
			try {
				if (hash) {
					info = euSign.VerifyHash(base64String(data), signature);
				} else {
					info = euSign.Verify(signature, data);
				}
			} catch (err) {
			}
			var owner = null;
			if (info) {
				owner = info.GetOwnerInfo();
				if (owner.fields) {
					delete owner.fields;
					owner.fields = null;
				}
			}
			var signatureInfo = {
				Success: info != undefined,
				DateTimeStr: info != undefined ? info.GetTimeInfo().GetTime() : null,
				Signer: info != undefined ? info.GetOwnerInfo().GetSubjCN() : "",
				FailReason: "",
				OwnerInfo: info != undefined ? owner : null
			};
			that.successCallback({ Success: true, Sign: signature, FailReason: "", SignatureInfo: signatureInfo });
		}
		var errorFunc = function(e) {
			if (that.needTryReInit(e)) {
				that.initLibrary(function() {
						that.signFile(data, hash);
					},
					function(ex) {
						that.errorCallback(ex);
					});
			} else {
				that.errorCallback(e);
			}
		}
		var signFunc = function (ex) {
			if (ex) {
				that.warningCallback(ex);
				return;
			}
			try {
				if (that.CAIndex !== undefined || !that.caInitialized) {
					that.setCA(that.CAIndex);
				}
				euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_X_LONG);
				if (hash) {
					euSign.SignHash(base64String(data),
						function(signature) {
							successFunc(signature, hash);
						},
						errorFunc);
				} else {
					if (that.IsRsaKey(false)) {
						euSign.SignRSA(data, true, true, function(signature) {
							 successFunc(signature, hash);
						}, errorFunc);
					} else {
						euSign.Sign(data, function (signature) {
							successFunc(signature, hash);
						}, errorFunc);
					}
				}
			} catch (e) {
				errorFunc(e);
			}
		}
		signFunc();
	}

	EUAgentHelper.prototype.IsRsaKey = function (crypt) {
		var i = 0;
		var cert = euSign.EnumOwnCertificates(i);
		while (cert) {
			if (!crypt && (cert.keyUsageType & EU_KEY_USAGE_DIGITAL_SIGNATURE) === EU_KEY_USAGE_DIGITAL_SIGNATURE && cert.publicKeyType === EU_CERT_KEY_TYPE_RSA) {
				return true;
			}
			if (crypt && (cert.keyUsageType & EU_KEY_USAGE_KEY_AGREEMENT) === EU_KEY_USAGE_KEY_AGREEMENT && cert.publicKeyType === EU_CERT_KEY_TYPE_RSA) {
				return true;
			}
			i++;
			cert = euSign.EnumOwnCertificates(i);
		}
		return false;
	},

	EUAgentHelper.prototype.verifyKeyReaded = function(callback) {
		if (this.isKeyReaded()) {
			return true;
		}
		this.readPrivateKey(callback);
		return false;
        }

	EUAgentHelper.prototype.readHardwarePrivateKey = function (deviceType, device, password, certificates, callback) {
		var keyMedia = euSign.CreateKeyMedia();
		keyMedia.SetTypeIndex(parseInt(deviceType, 10));
		keyMedia.SetDevIndex(parseInt(device, 10));
		keyMedia.SetPassword(password);

		var that = this;
		this.readPrivateKeyFromMedia(keyMedia, callback, function(e) {
			that.warningCallback(e);
		});
		//var that = this;
        //try {
        //    euSign.SetUIMode(false);
        //    euSign.ResetOperation();
        //    euSign.ResetPrivateKey();
        //    euSign.ReadPrivateKeySilently(parseInt(deviceType, 10), parseInt(device, 10), password);
        //    callback();
        //} catch (e) {
	    //    that.warningCallback(getErrorMessage(e));
        //}
        //euSign.SetUIMode(true);
    }

	EUAgentHelper.prototype.readPrivateKey = function (callback) {
		var that = this;
		var errorFunc = function(e) {
			if (that.needTryReInit(e)) {
				that.initLibrary(function () {
						that.readPrivateKey(callback);
					},
					function(ex) {
						that.warningCallback(ex);
						if (callback) {
							callback(ex);
						}
					});
			} else {
				that.warningCallback(e);
				if (callback) {
					callback(e);
				}
			}
		}
		try {
			euSign.SetUIMode(true);

			euSign.ResetOperation();
			euSign.ResetPrivateKey();


			euSign.GetPrivateKeyMedia(null,
				function(keyMedia) {
					that.readPrivateKeyFromMedia(keyMedia, callback, errorFunc);
				},
				function(e) {
					errorFunc(e);
				});

			return true;
		} catch (e) {
			errorFunc(e);
		}
		return false;
	}

	EUAgentHelper.prototype.readPrivateKeyFromMedia = function(keyMedia, callback, errorFunc) {
		var that = this;
		euSign.SetUIMode(false);
		var keyInfo;
		try {
			keyInfo = euSign.GetKeyInfo(keyMedia);
		} catch (keyInfoEx) {
			errorFunc(keyInfoEx);
			return;
		}
		
		euSign.ReadPrivateKeySilently(keyMedia.typeIndex,
			keyMedia.devIndex,
			keyMedia.password,
			function () {
				if (!that.getAutoDetect()) {
					callback();
				} else {
					that.setCAFromPrivateKey(callback, errorFunc);
				}
			},
			function (e) {
				if (e.errorCode === 51 && that.getAutoDetect()) {
					var cmp = [];
					var cmpPorts = [];
					for (var i = 0; i < that.CAServers.length; i++) {
						var ca = that.CAServers[i];
						if (ca.cmpAddress) {
							cmp.push(ca.cmpAddress);
							if (ca.cmpPort) {
								cmpPorts.push(ca.cmpPort);
							} else {
								cmpPorts.push("80");
							}
						}
					}
					euSign.GetCertificatesByKeyInfo(keyInfo, cmp, cmpPorts, function (certs) {
						//euSign.SetUIMode(true);
						that.setOfflineMode(true);
						euSign.SaveCertificates(certs);
						euSign.ReadPrivateKeySilently(keyMedia.typeIndex,
							keyMedia.devIndex,
							keyMedia.password,
							function () {
								that.setOfflineMode(false);
								that.setCAFromPrivateKey(callback, errorFunc);
							},
							function (e) {
								that.setOfflineMode(false);
								errorFunc(e);
							});
					}, function (e) {
						euSign.SetUIMode(true);
						if (e.errorCode === 51) {
							that.detectCaFailed();
						} else {
							errorFunc(e);
						}

					});
				} else {
					errorFunc(e);
				}
			});
		
	}

	EUAgentHelper.prototype.setCAFromPrivateKey = function (success, error) {
		var that = this;
		euSign.GetPrivateKeyOwnerInfo(function(info) {
				for (var i = 0; i < euAgentHelper.CAServers.length; i++) {
					var ca = euAgentHelper.CAServers[i];
					if (ca.issuerCNs.indexOf(info.GetIssuerCN()) >= 0) {
						that.setCA(i);
						break;
					}
				}
				if (success) {
					success();
				}
			},
			error);
	}

	EUAgentHelper.prototype.setCA = function (index) {
		this.CAIndex = index;
		var caServer = index >= 0 && index < this.CAServers.length ? this.CAServers[index] : null;
		var offline = ((caServer == null) ||
				(caServer.address == ""))
			? true
			: false;
		var useCMP = (!offline && caServer.cmpAddress !== "");
		var that = this;
		this.loadPKCertsFromFile = caServer == null || (!useCMP && !caServer.certsInKey);
		try {
			var fileSettings;
			try {
				fileSettings = euSign.GetFileStoreSettings();
				fileSettings.SetAutoRefresh(true);
			} catch (exception) {
				fileSettings = euSign.CreateFileStoreSettings();
			}
			var settings = euSign.CreateFileStoreSettings();
			var path = fileSettings.GetPath();
			var needFileSettings = false;
			if (!path) {
				needFileSettings = true;
				path = "c:\\Certificates";
			}
			try {
				euSign.CreateFolder(path);
				euSign.WriteFile(path + "\\CACertificates.p7b", this.Certificates);
			}
			catch (e) {
			}
			settings.SetPath(path);
			settings.SetAutoRefresh(fileSettings.GetAutoRefresh());
			settings.SetOwnCRLsOnly(fileSettings.GetOwnCRLsOnly());
			settings.SetExpireTime(parseInt(fileSettings.GetExpireTime(), 10));
			var isAvtor = !offline && caServer.address === "author.kiev.ua";
			var checkCrl = offline || isAvtor;
			if (fileSettings.GetCheckCRLs() !== checkCrl) {
				settings.SetCheckCRLs(checkCrl);
				needFileSettings = true;
			}
			var fullAndDelta = offline && !isAvtor;
			if (fileSettings.GetFullAndDeltaCRLs() !== fullAndDelta) {
				settings.SetFullAndDeltaCRLs(fullAndDelta);
				needFileSettings = true;
			}
			if (fileSettings.GetAutoDownloadCRLs() !== checkCrl) {
				settings.SetAutoDownloadCRLs(checkCrl);
				needFileSettings = true;
			}
			if (!fileSettings.GetSaveLoadedCerts()) {
				settings.SetSaveLoadedCerts(true);
				needFileSettings = true;
			}
            if (needFileSettings) {
                settings.SetSaveLoadedCerts(true);
				euSign.SetFileStoreSettings(settings);
			}

			settings = euSign.CreateTSPSettings();
			if (!offline || (caServer != null && caServer.certsInKey)) {
				settings.SetGetStamps(true);
				if (caServer != null && caServer.tspAddress != "") {
					settings.SetAddress(caServer.tspAddress);
					settings.SetPort(caServer.tspAddressPort);
				} else {
					settings.SetAddress('acskidd.gov.ua');
					settings.SetPort('80');
				}
			}
			euSign.SetTSPSettings(settings);

			settings = euSign.CreateOCSPSettings();
			if (!offline) {
				settings.SetUseOCSP(true);
				settings.SetBeforeStore(true);
				settings.SetAddress(caServer.ocspAccessPointAddress);
				settings.SetPort(caServer.ocspAccessPointPort);
			}
			euSign.SetOCSPSettings(settings);
			if (useCMP) {
				this.setCmpSettings(useCMP, caServer.cmpAddress);
			} else {
				this.setCmpSettings(false);
			}
			settings = euSign.CreateLDAPSettings();
			if (caServer != null && caServer.ldapAddress) {
				settings.SetUseLDAP(true);
				settings.SetAddress(caServer.ldapAddress);
				settings.SetPort(caServer.ldapAddressPort);
			}
			euSign.SetLDAPSettings(settings);
			that.caInitialized = true;
		} catch (e) {
			if (this.needTryReInit(e)) {
				this.initLibrary(function() {
						that.setCA(index);
					},
					function(ex) {
						that.warningCallback(ex);
					});
			} else {
				that.warningCallback(e);
			}
			return false;
		}
	    return true;
	}

	EUAgentHelper.prototype.setCmpSettings = function(useCMP, cmpAddress) {
		var settings = euSign.CreateCMPSettings();
		settings.SetUseCMP(useCMP);
		if (useCMP) {
			settings.SetAddress(cmpAddress);
			settings.SetPort("80");
		}
		euSign.SetCMPSettings(settings);
	}

	EUAgentHelper.prototype.setOfflineMode = function(mode) {
		var settings = euSign.CreateModeSettings();
		settings.SetOfflineMode(mode);
		euSign.SetModeSettings(settings);
	},

	EUAgentHelper.prototype.needPrivateKeyCertificates = function() {
		return false;
	}

	window.euAgentHelper = new EUAgentHelper();
	window.euSign = euSign;
})();