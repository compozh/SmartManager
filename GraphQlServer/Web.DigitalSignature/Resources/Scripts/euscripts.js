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

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
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

//=============================================================================

var URL_EMAIL_PARAM = "@EMAIL_PARAM";
var URL_GET_KEP_CERTIFICATE_BY_EMAIL = "http://ca.iit.com.ua/services-cmp-getcert?eUserEMail=" +
		URL_EMAIL_PARAM + "&certType=2&respType=2";

var euSignUkLang = 1;
var euSignRuLang = 2;
var euSignEnLang = 3;

var locale = {
    "uk": {
        "CanNotImportToLocalStorage": "Виникла помилка при імпорті завантажених з сервера сертифікатів до файлового сховища",
        "CanNotLoadCertificates": "Виникла помилка при завантаженні сертифікатів з сервера. HTTP статус - ",
        "SpecifyPrivateKey": "Необхідно вказати приватний ключ",
        "SpecifyPrivateKeyPassword": "Необхідно вказати пароль приватного ключа",
        "NoPublicCertSelected": "Виникла помилка при зчитуванні особистого ключа. Опис помилки: не обрано жодного сертифіката відкритого ключа",
        "NoRecipientCerts": "Не обрано жодного сертифіката отримувача"
    },
    "ru": {
        "CanNotImportToLocalStorage": "Не удалось импортировать загруженные с сервера сертификаты в файловое хранилище",
        "CanNotLoadCertificates": "Не удалось загрузить сертификаты с сервера. HTTP статус - ",
        "SpecifyPrivateKey": "Необходимо указать приватный ключ",
        "SpecifyPrivateKeyPassword": "Необходимо указать пароль приватного ключа",
        "NoPublicCertSelected": "Не удалось считать приватный ключ. Необходимо указать сертификаты открытого ключа",
        "NoRecipientCerts": "Не выбрано ни одного сертификата получателя"
    },
    "en": {
        "CanNotImportToLocalStorage": "An error occurred while loading certificates from the server to the file storage",
        "CanNotLoadCertificates": "An error occurred while loading certificates from the server. HTTP status - ",
        "SpecifyPrivateKey": "You must specify a private key",
        "SpecifyPrivateKeyPassword": "You must specify a private key password",
        "NoPublicCertSelected": "An error occurred while reading the private key. Error Description: not selected any public key certificate",
        "NoRecipientCerts": "Recipients certificates not selected"
    }
}

//=============================================================================

var EUSignCPHelper = NewClass({
    "ClassName": "EUSignCPHelper",
    "CertsLocalStorageName": "Certificates",
    "CRLsLocalStorageName": "CRLs",
    "recepientsCertsIssuers": null,
    "recepientsCertsSerials": null,
    "DefaultPrivateKeyNameSessionStorageName": "PrivateKeyName",
    "DefaultPrivateKeySessionStorageName": "PrivateKey",
    "DefaultPrivateKeyPasswordSessionStorageName": "PrivateKeyPassword",
    "DefaultPrivateKeyCertificatesSessionStorageName": "PrivateKeyCertificates",
    "DefaultPrivateKeyCertificatesChainSessionStorageName": "PrivateKeyCertificatesChain",
    "PrivateKeyNameSessionStorageName": "PrivateKeyName",
    "PrivateKeySessionStorageName": "PrivateKey",
    "PrivateKeyPasswordSessionStorageName": "PrivateKeyPassword",
    "PrivateKeyCertificatesSessionStorageName": "PrivateKeyCertificates",
    "PrivateKeyCertificatesChainSessionStorageName": "PrivateKeyCertificatesChain",
    "CACertificatesSessionStorageName": "CACertificates",
    "DefaultCAServerIndexSessionStorageName": "CAServerIndex",
    "CAServerIndexSessionStorageName": "CAServerIndex",
    "CAsServers": null,
    "CAServer": null,
    "offline": false,
    "useCMP": false,
    "loadPKCertsFromFile": false,
    "privateKeyCerts": null,
    "errorCallback": undefined,
    "successCallback": undefined,
    "useLocalStorage": false,
    "showPKCertsSelector": undefined
},
function () {
},
{
    initialize: function(params, success, error) {
    	var pThis = this;
		//TODO:
	    //if (utils.GetLocalStorageItem(this.CACertificatesSessionStorageName, true, false) != undefined) {
	    //    this.useLocalStorage = true;
	    //} else {
	    //    this.useLocalStorage = false;
    	//}
    	this.CAsServers = params.casServers;
    	euSign.SetErrorMessageLanguage(params.lang);
    	this.detectCaFailed = params.onDetectCaFailed;
        this.getAutoDetect = params.getAutoDetect;
    	this.PrivateKeyNameSessionStorageName = params.storagePrefix + this.DefaultPrivateKeyNameSessionStorageName;
    	this.PrivateKeySessionStorageName = params.storagePrefix + this.DefaultPrivateKeySessionStorageName;
    	this.PrivateKeyPasswordSessionStorageName = params.storagePrefix + this.DefaultPrivateKeyPasswordSessionStorageName;
    	this.PrivateKeyCertificatesSessionStorageName = params.storagePrefix + this.DefaultPrivateKeyCertificatesSessionStorageName;
    	this.PrivateKeyCertificatesChainSessionStorageName = params.storagePrefix + this.DefaultPrivateKeyCertificatesChainSessionStorageName;
    	this.CAServerIndexSessionStorageName = params.storagePrefix + this.DefaultCAServerIndexSessionStorageName;
    	this.allowStoreKey = params.allowStoreKey;
    	this.recepientsCertsIssuers = undefined;
    	this.recepientsCertsSerials = undefined;
	    this.successCallback = function(obj) {
		    pThis.clearKey();
		    params.onSuccess(obj);
	    }
	    this.errorCallback = params.onError;
	    this.warningCallback = params.onWarning;
	    //this.showPKCertsSelector = onShowPKCertsSelector;
	    try {
		    euSign.Initialize();
		    euSign.SetJavaStringCompliant(true);
		    euSign.SetCharset("UTF-16LE");
		    if (euSign.DoesNeedSetSettings()) {
			    pThis.setDefaultSettings();
		    }
		    euSign.SaveCertificates(params.certificates);
		    success();
	    } catch (e) {
		    error(e);
	    }
    },
    getLocale: function() {
        switch(euSign.errorLangCode) {
            case 1:
                return "uk";
            case 3:
                return "en";
        }
        return "ru";
    },
    setDefaultSettings: function () {
        try {
            euSign.SetXMLHTTPProxyService(URL_XML_HTTP_PROXY_SERVICE);

            var settings = euSign.CreateFileStoreSettings();
	        settings.SetPath("/certificates");
	        settings.SetSaveLoadedCerts(true);
            settings.SetCheckCRLs(true);
	        euSign.SetFileStoreSettings(settings);

            settings = euSign.CreateProxySettings();
            euSign.SetProxySettings(settings);

            settings = euSign.CreateTSPSettings();
            euSign.SetTSPSettings(settings);

            settings = euSign.CreateOCSPSettings();
            euSign.SetOCSPSettings(settings);

            settings = euSign.CreateCMPSettings();
            euSign.SetCMPSettings(settings);

            settings = euSign.CreateLDAPSettings();
            euSign.SetLDAPSettings(settings);

            settings = euSign.CreateOCSPAccessInfoModeSettings();
            settings.SetEnabled(true);
            euSign.SetOCSPAccessInfoModeSettings(settings);

            var CAs = this.CAsServers;
            settings = euSign.CreateOCSPAccessInfoSettings();
            for (var i = 0; i < CAs.length; i++) {
                settings.SetAddress(CAs[i].ocspAccessPointAddress);
                settings.SetPort(CAs[i].ocspAccessPointPort);

                for (var j = 0; j < CAs[i].issuerCNs.length; j++) {
                    settings.SetIssuerCN(CAs[i].issuerCNs[j]);
                    euSign.SetOCSPAccessInfoSettings(settings);
                }
            }
        } catch (e) {
            this.onError(e);
        }
    },
    setCASettings: function (caIndex) {
        try {
            var caServer = (caIndex < this.CAsServers.length) ?
				this.CAsServers[caIndex] : null;
            var offline = ((caServer == null) ||
				(caServer.address == "")) ?
				true : false;
            var useCMP = (!offline && (caServer.cmpAddress != ""));
            var loadPKCertsFromFile = (caServer == null) || (!useCMP && !caServer.certsInKey);
            if (this.showPKCertsSelector != undefined) {
                this.showPKCertsSelector(loadPKCertsFromFile);
            }
            euSignHelper.CAServer = caServer;
            euSignHelper.offline = offline;
            euSignHelper.useCMP = useCMP;
            euSignHelper.loadPKCertsFromFile = loadPKCertsFromFile;

            euSignHelper.setPrivateKeyCerts(null);

            var settings = euSign.CreateTSPSettings();
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
            this.cpIndex = caIndex;
            this.caServer = caServer;
            return true;
        } catch (e) {
            this.onError(e);
        }
	    return false;
    },
	setCmpSettings: function(useCMP, cmpAddress) {
		var settings = euSign.CreateCMPSettings();
		settings.SetUseCMP(useCMP);
		if (useCMP) {
			settings.SetAddress(cmpAddress);
			settings.SetPort("80");
		}
		euSign.SetCMPSettings(settings);
	},
	setOfflineMode: function(mode) {
		var settings = euSign.CreateModeSettings();
		settings.SetOfflineMode(mode);
		euSign.SetModeSettings(settings);
	},
    storePrivateKey: function (keyName, key, password, certificates) {
        if (!this.setStorageItem(euSignHelper.PrivateKeyNameSessionStorageName, keyName, false) ||
			!this.setStorageItem(euSignHelper.PrivateKeySessionStorageName, key, false) ||
			!this.setStorageItem(euSignHelper.PrivateKeyPasswordSessionStorageName, password, true)) {
            return false;
        }

        if (certificates) {
	        if (Array.isArray(certificates)) {
		        if (!this.setStorageItems(euSignHelper.PrivateKeyCertificatesSessionStorageName,
			        certificates, false)) {
			        return false;
		        }
	        } else {
	        	if (!this.setStorageItem(euSignHelper.PrivateKeyCertificatesChainSessionStorageName,
		            certificates, false)) {
			        return false;
		        }
	        }
        }

        return true;
    },
    removeStoredPrivateKey: function () {
        this.removeStorageItem(euSignHelper.PrivateKeyNameSessionStorageName);
        this.removeStorageItem(euSignHelper.PrivateKeySessionStorageName);
        this.removeStorageItem(euSignHelper.PrivateKeyPasswordSessionStorageName);
        this.removeStorageItem(euSignHelper.PrivateKeyCertificatesChainSessionStorageName);
        this.removeStorageItem(euSignHelper.PrivateKeyCertificatesSessionStorageName);
    },
    //-----------------------------------------------------------------------------
    getPrivateKeyCertificatesByCMP: function (key, password, onSuccess, onError, tryAll) {
    	try {
		    var cmp = [];
		    var cas = [this.caServer];
			if (tryAll) {
				cas = this.CAsServers;
			}
			for (var i = 0; i < cas.length; i++) {
				var ca = cas[i];
				if (ca.cmpAddress) {
					if (ca.cmpPort) {
						cmp.push(ca.cmpAddress + ":" + ca.cmpPort);
					} else {
						cmp.push(ca.cmpAddress);
					}
				}
		    }
            var keyInfo = euSign.GetKeyInfoBinary(key, password);
            onSuccess(euSign.GetCertificatesByKeyInfo(keyInfo, cmp));
    	} catch (e) {
            onError(e);
        }
    },
    getPrivateKeyCertificates: function (key, password, fromCache, onSuccess, onError) {
        if (this.CAServer != null &&
            this.CAServer.certsInKey) {
            onSuccess([]);
            return;
        }

		if (this.useCMP) {
            this.getPrivateKeyCertificatesByCMP(key, password, onSuccess, onError, false);
        } else if (this.loadPKCertsFromFile) {
            var _onSuccess = function (files) {
                var certificates = [];
                for (var i = 0; i < files.length; i++) {
                    certificates.push(files[i].data);
                }

                onSuccess(certificates);
            };

            euSign.ReadFiles(this.privateKeyCerts, _onSuccess, onError);
		}
    },
    readPrivateKey: function (keyName, key, password, certificates, fromCache, onSuccess, onError) {
        var pThis = this;
        var _onError = function (e) {

			if (onError) {
				onError(e);
			} else {
				pThis.onWarning(e);
			}
        };

        if (keyName && keyName.toLowerCase().indexOf(".jks") >= 0) {
        	var jksCerts = this.getJksCertificates(keyName, key);
            if (jksCerts.length) {
            	this.saveCertificates(jksCerts);
            }
        }

        var that = this;
        if (certificates == null && this.getAutoDetect()) {
			this.setOfflineMode(true);
			this.readPrivateKeyBinary(key, password, certificates, function () {
				if (utils.IsSessionStorageSupported() && euSignHelper.allowStoreKey) {
					if (!euSignHelper.storePrivateKey(keyName, key, password, certificates)) {
						euSignHelper.removeStoredPrivateKey();
					}
				}
		        onSuccess(true);
	        }, function(e) {
				if (e.errorCode === 51) {
					that.getPrivateKeyCertificatesByCMP(key,
						password,
						function (certificates) {
							that.setOfflineMode(true);
							that.readPrivateKeyBinary(key,
								password,
								certificates,
								function () {
									if (utils.IsSessionStorageSupported() && euSignHelper.allowStoreKey) {
										if (!euSignHelper.storePrivateKey(keyName, key, password, certificates)) {
											euSignHelper.removeStoredPrivateKey();
										}
									}
									onSuccess(true);
								},
								function(e) {
									if (e.errorCode === 51) {
										that.detectCaFailed();
									} else {
										_onError(e);
									};
								});
						},
						function (e) {
							that.setOfflineMode(false);
							if (e.errorCode === 51) {
								that.detectCaFailed();
							} else {
								_onError(e);
							}
						},
						true);
				} else {
					_onError(e);
				}
	        });
	        return;
        }

        if (certificates == null) {
            var _onGetCertificates = function (certs) {
                if (certs == null) {
                    _onError(euSign.MakeError(EU_ERROR_CERT_NOT_FOUND));
                    return;
                }
                euSignHelper.readPrivateKey(keyName, key, password, certs, fromCache, onSuccess);
            }

            euSignHelper.getPrivateKeyCertificates(key, password, fromCache, _onGetCertificates, _onError);
            return;
        }

        this.setOfflineMode(true);
        this.readPrivateKeyBinary(key,
	        password,
	        certificates,
	        function() {
		        if (utils.IsSessionStorageSupported() && euSignHelper.allowStoreKey) {
			        if (!euSignHelper.storePrivateKey(keyName, key, password, certificates)) {
				        euSignHelper.removeStoredPrivateKey();
			        }
		        }
		        onSuccess(true);
	        },
	        function(e) {
		        _onError(e);
	        });
    },
    getJksCertificates: function (keyName, key) {
	    var certificates = [];
		if (keyName && keyName.toLowerCase().indexOf(".jks") >= 0) {
			var pkIndex = 0;
			var pk = "";
			var jksCerts = [];
			do {
				try {
					pk = euSign.EnumJKSPrivateKeys(key, pkIndex);
				} catch (e) {
					pk = null;
				}
				pkIndex++;
				if (pk) {
					var pkInfo = euSign.GetJKSPrivateKey(key, pk);
					if (pkInfo) {
						for (var i = 0; i < pkInfo.certificates.length; i++) {
							jksCerts.push(pkInfo.certificates[i]);
						}
					}
				}
			} while (pk)
			if (jksCerts.length) {
				certificates = jksCerts;
			}
		}
		return certificates;
    },
    readPrivateKeyBinary: function (key, password, certificates, success, error) {
	    if (certificates) {
		    this.saveCertificates(certificates);
	    }
	    try {
	    	euSign.ReadPrivateKeyBinary(key, password);
	        this.setOfflineMode(false);
	        if (this.getAutoDetect()) {
		        var info = euSign.GetPrivateKeyOwnerInfo();
		        for (var i = 0; i < this.CAsServers.length; i++) {
			        var ca = this.CAsServers[i];
			        if (ca.issuerCNs.indexOf(info.GetIssuerCN()) >= 0) {
			        	this.setCASettings(i);
				        break;
			        }
		        }
	        }

	        success();
	        return;
	    } catch (e) {
		    this.setOfflineMode(false);
			error(e);
		}
	},
	saveCertificates(certificates) {
		if (Array.isArray(certificates)) {
			for (var i = 0; i < certificates.length; i++) {
				euSign.SaveCertificate(certificates[i]);
			}
		} else {
			euSign.SaveCertificates(certificates);
		}
	},
    readPrivateKeyAsStoredFile: function (onReadFromCache) {
    	var keyName = this.getStorageItem(euSignHelper.PrivateKeyNameSessionStorageName, false, false);
    	var key = this.getStorageItem(euSignHelper.PrivateKeySessionStorageName, true, false);
    	var password = this.getStorageItem(euSignHelper.PrivateKeyPasswordSessionStorageName, false, true);
        if (keyName == null || key == null || password == null) {
            if (onReadFromCache != undefined) {
                onReadFromCache(false);
            }
            return;
        }
		
        var certificates = this.getStorageItem(this.PrivateKeyCertificatesChainSessionStorageName, true, false);
        if (!certificates) {
	        certificates = this.getStorageItems(this.PrivateKeyCertificatesSessionStorageName, true, false);
        }
        var _readPK = function () {
        	euSignHelper.readPrivateKey(keyName, key, password, certificates, true, function() {
	            onReadFromCache(true);
            }, function(e) {
            	euSignHelper.removeStoredPrivateKey();
                onReadFromCache(false);
            });
        }
        setTimeout(_readPK, 10);

        return;
    },
    isCertificateExtension: function (fileName) {
        if ((fileName.indexOf(".cer") >= 0) ||
				(fileName.indexOf(".p7b") >= 0))
            return true;
        return false;
    },
    isCRLExtension: function (fileName) {
        if ((fileName.indexOf(".crl") >= 0))
            return true;
        return false;
    },
    setPrivateKeyCerts: function (certs) {
        this.privateKeyCerts = certs;
    },
    hasPrivateKey: function() {
    	return euSign.IsPrivateKeyReaded();
    },
    verifyFile: function (fileUrl, signFileUrl, hash) {
    	this.verifyData(signFileUrl, fileUrl, hash, false, null);
    },
    verifyData: function (signedData, data, hash, internal, dateTime) {
	    try {
		    var signerInfo = euSign.CtxGetSignerInfo(this.getContext(), 0, signedData);

		    var offline = isCAOfflineOnly(this.CAsServers, signerInfo.infoEx.issuerCN);

		    var that = this;
		    var f = function () {
			    var info;
			    if (hash) {
				    info = euSign.VerifyHashOnTimeEx(data, 0, signedData, dateTime, offline);
			    } else {
				    if (internal) {
					    info = euSign.VerifyDataInternalOnTimeEx(0, signedData, dateTime, offline);
				    } else {
					    info = euSign.VerifyDataOnTimeEx(data, 0, signedData, dateTime, offline);
				    }
			    }
			    var owner = info.GetOwnerInfo();
			    if (owner.fields) {
			    	delete owner.fields;
				    owner.fields = null;
			    }
			    var cert = euSign.CtxGetSignerInfo(that.getContext(), 0, signedData);
			    var beginTime = cert.GetInfoEx().GetCertBeginTime();
			    var endTime = cert.GetInfoEx().GetCertEndTime();
			    var d = info != null ? info.GetData() : null;
			    that.successCallback({
				    Success: true,
				    DateTimeStr: info != undefined ? formatDate(info.GetTimeInfo().GetTime()) : null,
				    CertBeginTimeStr: formatDate(beginTime),
				    CertEndTimeStr: formatDate(endTime),
				    Signer: info != undefined ? info.GetOwnerInfo().GetSubjFullName() : "",
				    FailReason: "",
				    OwnerInfo: info != undefined ?  owner: null,
				    Result: d != null ? euSign.ArrayToString(d) : null
			    });
		    }
		    if (!window.crlUrlCache) {
			    window.crlUrlCache = [];
		    }
		    var inCache = window.crlUrlCache.indexOf(signerInfo.infoEx.crlDistribPoint1) > -1;
		    if (offline && signerInfo.infoEx.crlDistribPoint1 && !inCache) {
			    window.crlUrlCache.push(signerInfo.infoEx.crlDistribPoint1);
				utils.GetDataFromServerAsync(URL_XML_HTTP_PROXY_SERVICE + "?no64=1&address=" + signerInfo.infoEx.crlDistribPoint1, function (data) {
		    		try {
					    try {
					    	euSign.SaveCRL(true, data);
					    } catch (e) {
					    	euSign.SaveCRL(false, data);
					    }
					    f();
				    } catch (ex) {
					    that.onError(ex);
				    }
			    }, function(e) {
			    	try {
			    		f();
			    	} catch (ex) {
			    		that.onError(ex);
			    	}
			    }, true);
		    } else {
			    f();
		    }
	    } catch (e) {
		    this.onError(e);
	    }
    },
	getContext: function() {
		if (!window.euSignCtx) {
			window.euSignCtx = euSign.CtxCreate();
		}
		return window.euSignCtx;
	},
	readKeyAndDoAction: function (keyFiles, password, onSuccess, certificates) {
		this.privateKeyCerts = certificates;
    	var certificatesFiles = certificates;
    	var that = this;
        var _onSuccess = function(keyName, key) {
            that.readPrivateKey(keyName, new Uint8Array(key),
                password, null, false, onSuccess);
        }
        if (euSign.IsPrivateKeyReaded()) {
            onSuccess();
            return;
        }

        try {
            if (keyFiles == undefined || keyFiles.length == 0) {
            	this.onWarning(locale[that.getLocale()]["SpecifyPrivateKey"]);
                return;
            }
            var keyFile = keyFiles[0];
            if (password == "") {
            	this.onWarning(locale[that.getLocale()]["SpecifyPrivateKeyPassword"]);
                return;
            }

            if (euSignHelper.loadPKCertsFromFile &&
            (certificatesFiles == null ||
                certificatesFiles.length <= 0)) {
            	this.onWarning(locale[that.getLocale()]["NoPublicCertSelected"]);
                return;
            }

            var _onFileRead = function(readedFile) {
                _onSuccess(readedFile.file.name, readedFile.data);
            };

            euSign.ReadFile(keyFile, _onFileRead, this.onWarning);
        } catch (e) {
        	this.onWarning(e);
        }
	},
	isRSAKey: function (crypt) {
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
    signFile: function (fileData, hash) {
    	this.signFileInternal(fileData, hash);
    },
    signData: function(data, internal, keyFiles, password) {
        var pThis = this;
        var func = function() {
        	try {
        		euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_BES);
		        var sign = pThis.signDataInternal(data, internal);
	            pThis.successCallback({ Success: true, Sign: sign, FailReason: "" });
			} catch (e) {
			    pThis.onError(e);
			    pThis.removeStoredPrivateKey();
			}
        }
        this.readKeyAndDoAction(keyFiles, password, func);
    },
	getKeyInfo: function(convertFunc, keyFiles, password) {
		var pThis = this;
		var func = function () {
			try {
				pThis.successCallback(convertFunc(euSign.privKeyOwnerInfo));
			} catch (e) {
				pThis.onError(e);
				pThis.removeStoredPrivateKey();
			}
		}
		this.readKeyAndDoAction(keyFiles, password, func);
	},
    signDataArray: function (data, internal, keyFiles, password) {
	    var pThis = this;
		var func = function () {
			var results = [];
			euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_BES);
            for (var i = 0; i < data.length; i++) {
	            var current = data[i];
				try {
					if (current.emulateError) {
						throw { message: "fail to sign", code: 0 };
					}
					var sign = pThis.signDataInternal(current.data, internal);
					results.push({ success: true, sign: sign, failReason: "", id: current.id, signer: euSign.privKeyOwnerInfo });
                } catch (e) {
					pThis.onError(e);
					return;
				}
			}
			pThis.successCallback(results);
		}
	    this.readKeyAndDoAction(keyFiles, password, func);
	},
	signDataInternal: function(data, internal) {
		var rsa = this.isRSAKey(false);
		if (!rsa) {
			if (!internal) {
				return base64String(euSign.SignData(data, false));
			} else {
				return base64String(euSign.SignDataInternal(true, data, false));
			}
		} else {
			return euSign.SignDataRSA(data, true, !internal, true);
		}
	},
    signFileInternal: function(data, hash) {
	    var pThis = this;
    	try {
    		euSign.SetRuntimeParameter(EU_SIGN_TYPE_PARAMETER, EU_SIGN_TYPE_CADES_X_LONG);
    		var rsa = pThis.isRSAKey(false);
    		var sign;
		    var info;
		    if (hash) {
		    	sign = base64String(euSign.SignHash(data, false));
			    try {
				    info = euSign.VerifyHash(data, sign);
			    } catch (err) {
			    }
		    } else {
			    if (!rsa) {
				    sign = base64String(euSign.SignData(data, false));
			    } else {
				    sign = euSign.SignDataRSA(data, true, true, true);
			    }
			    try {
				    info = euSign.VerifyData(data, sign);
			    } catch (err) {
			    }
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
		    pThis.successCallback({ Success: true, Sign: sign, FailReason: "", SignatureInfo: signatureInfo });
	    } catch (e) {
		    pThis.onError(e);
		    pThis.removeStoredPrivateKey();
	    }
    },
	onError: function(e) {
		var error = this.processError(e);
		if (this.errorCallback != undefined) {
			this.errorCallback(error.message, error.code);
		}
	},
	processError: function(e) {
		var message = "";
		var code = 0;
		if (typeof (e) === "string") {
			message = e;
		}
		if (e.message != undefined) {
			message = e.message;
		}
		else if (e.GetMessage != undefined) {
			message = e.GetMessage();
		}
		if (e.GetErrorCode) {
			code = e.GetErrorCode();
		}
		else if (e.errorCode) {
			code = e.errorCode;
		}
		return {
			message: message,
			code: code
		};
	},
	onWarning: function(e) {
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
		if (this.warningCallback != undefined) {
			this.warningCallback(message);
		}
	},
	setLocalStorage: function(local) {
		this.useLocalStorage = local;
	},
    getStorageItems: function(key, decode, protect) {
        return utils.GetLocalStorageItems(key, decode, protect) || utils.GetSessionStorageItems(key, decode, protect);
    },
    setStorageItems: function(key, value, protect) {
        var storeItemMethod = !this.useLocalStorage ? utils.SetSessionStorageItems : utils.SetLocalStorageItems;
         return storeItemMethod.call(utils, key, value, protect);
    },
    getStorageItem: function(key, decode, protect) {
        return utils.GetLocalStorageItem(key, decode, protect) || utils.GetSessionStorageItem(key, decode, protect);
    },
    setStorageItem: function(key, value, protect) {
         var storeItemMethod = !this.useLocalStorage ? utils.SetSessionStorageItem : utils.SetLocalStorageItem;
         return storeItemMethod.call(utils, key, value, protect);
    },
    removeStorageItem: function (key) {
        var removeItemMethod = !this.useLocalStorage ? utils.RemoveSessionStorageItem : utils.RemoveLocalStorageItem;
        return removeItemMethod.call(utils, key);
    },
    removeStorageItems: function (key) {
        var removeItemMethod = !this.useLocalStorage ? utils.RemoveSessionStorageItems : utils.RemoveLocalStorageItems;
        return removeItemMethod.call(utils, key);
    },
    clearKey: function() {
        euSign.ResetPrivateKey();
    },
    moveSettingsToLocalStorage: function () {
        if (this.useLocalStorage) {
            return;
        }
        this.useLocalStorage = true;
        var certificates = utils.GetSessionStorageItem(this.CACertificatesSessionStorageName, true, false);
        utils.RemoveSessionStorageItem(this.CACertificatesSessionStorageName);
        utils.SetLocalStorageItem(this.CACertificatesSessionStorageName, certificates, false);
    },
    setRecepientsCertificates: function(files) {
        if (files.length <= 0) {
            return;
        }
        euSignHelper.recepientsCertsLoading = true;
        euSignHelper.recepientsCertsIssuers = undefined;
        euSignHelper.recepientsCertsSerials = undefined;
        var fileReader = new FileReader();
        fileReader.onloadend = euSignHelper.recepientCertLoaded(
            files, 0, []);
        fileReader.readAsArrayBuffer(files[0]);
    },
    recepientCertLoaded: function (files, curIndex, processedFiles) {
        return function (evt) {
            if (evt.target.readyState != FileReader.DONE)
                return;

            var file = new Object();
            file.name = files[curIndex].name;
            file.isCertificate = euSignHelper.isCertificateExtension(file.name);
            if (file.isCertificate) {
                file.data = new Uint8Array(evt.target.result);
            }

            processedFiles.push(file);
            curIndex++;

            if (curIndex < files.length) {
                var fileReader = new FileReader();
                fileReader.onloadend = euSignHelper.recepientCertLoaded(files, curIndex, processedFiles);
                fileReader.readAsArrayBuffer(files[curIndex]);
                return;
            }
            euSignHelper.recepientCertsLoaded(processedFiles);
        };
    },
    recepientCertsLoaded: function (processedFiles) {
        var issuers = [];
        var serials = [];

        for (var i = 0; i < processedFiles.length; i++) {
            var file = processedFiles[i];
            if (!file.isCertificate) {
            } else {
                try {
                    var certInfo = euSign.ParseCertificate(file.data);
                    issuers.push(certInfo.issuer);
                    serials.push(certInfo.serial);
                    euSign.SaveCertificate(file.data);
                } catch (e) {
                }
            }
        }

        euSignHelper.recepientsCertsIssuers = issuers;
        euSignHelper.recepientsCertsSerials = serials;
	    euSignHelper.recepientsCertsLoading = false;
    },
    envelopFile: function(fileUrl, keyFiles, password) {
	    if (euSignHelper.recepientsCertsLoading === true) {
		    setTimeout(function() {
				    euSignHelper.envelopFile(fileUrl, keyFiles, password);
			    },
			    100);
		    return;
	    }
    
		var issuers = euSignHelper.recepientsCertsIssuers;
	    var serials = euSignHelper.recepientsCertsSerials;

	    if (issuers == null ||
		    serials == null ||
		    issuers.length <= 0 ||
		    serials.length <= 0) {
		    this.onWarning(locale[this.getLocale()]["NoRecipientCerts"]);
		    return;
	    }
	    var pThis = this;
	    var func = function() {
	    	try {
	    		var rsa = pThis.isRSAKey(true);
			    var envelopedFileData;
			    if (!rsa) {
				    envelopedFileData = euSign.EnvelopDataEx(issuers, serials, true, fileUrl, false);
			    } else {
				    var kepAlg = 7; //AES
				    envelopedFileData = euSign.EnvelopDataRSAEx(kepAlg, issuers, serials, true, fileUrl, false);
			    }

			    pThis.successCallback({ Success: true, Result: base64String(envelopedFileData) });
		    } catch (e) {
			    pThis.onError(e);
			    pThis.removeStoredPrivateKey();
		    }
	    }
	    this.readKeyAndDoAction(keyFiles, password, func);
    },
    developFile: function(fileUrl, keyFiles, password) {
		var pThis = this;
		var func = function() {
			try {
				var info = euSign.DevelopData(fileUrl);
				pThis.successCallback({ Success: true, Result: base64String(info.GetData()) });
			} catch (e) {
				pThis.onError(e);
				pThis.removeStoredPrivateKey();
			}
		};
		this.readKeyAndDoAction(keyFiles, password, func);
	}
});

//=============================================================================

var euSignHelper = EUSignCPHelper();
var euSign = EUSignCP();
var utils = Utils(euSign);

function initializeEU() {
    try {
        euSign.SetXMLHTTPProxyService(URL_XML_HTTP_PROXY_SERVICE);

        var settings = euSign.CreateFileStoreSettings();
        settings.SetPath("/certificates");
        settings.SetSaveLoadedCerts(true);
        euSign.SetFileStoreSettings(settings);

        settings = euSign.CreateProxySettings();
        euSign.SetProxySettings(settings);

        settings = euSign.CreateTSPSettings();
        euSign.SetTSPSettings(settings);

        settings = euSign.CreateOCSPSettings();
        euSign.SetOCSPSettings(settings);

        settings = euSign.CreateCMPSettings();
        euSign.SetCMPSettings(settings);

        settings = euSign.CreateLDAPSettings();
        euSign.SetLDAPSettings(settings);

        settings = euSign.CreateOCSPAccessInfoModeSettings();
        settings.SetEnabled(true);
        euSign.SetOCSPAccessInfoModeSettings(settings);

        euSign.SetOfflineMode(false);

        var CAs = this.CAsServers;
        settings = euSign.CreateOCSPAccessInfoSettings();
        for (var i = 0; i < CAs.length; i++) {
            settings.SetAddress(CAs[i].ocspAccessPointAddress);
            settings.SetPort(CAs[i].ocspAccessPointPort);
            for (var j = 0; j < CAs[i].issuerCNs.length; j++) {
                settings.SetIssuerCN(CAs[i].issuerCNs[j]);
                euSign.SetOCSPAccessInfoSettings(settings);
            }
        }
    } catch (e) {
    }
}


function base64String(array) {
    var bytes;
    var i;
    var bytesLength;
    var base64Str = '';
    var m_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    bytes = new Uint8Array(array);
    bytesLength = bytes.length;

    for (i = 0; i < bytesLength; i+=3) {
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
