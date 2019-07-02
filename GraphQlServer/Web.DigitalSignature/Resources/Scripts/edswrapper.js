(function () {

	var translates = {
		en: {
			"CA": "CA",
			"PrivateKey": "Private key",
			"Password": "Password",
			"Certificates": "Certificates",
			"OfflineMode": "Local certificates (offline-mode)",
			"KeyInMemory": "The key will be saved in memory until the browser tab closes",
			"KeyInLocalStorageClient": "The key will be saved in the browser for later use. To delete a key from the browser, you need to call the function \"Tools and settings → EDS → Clear key \"",
			"Sign": "Sign",
			"SignFile": "Sign file",
			"Envelop": "Envelop",
			"Develop": "Develop",
			"RecepientsCertificates": "Recepients certificates",
			"Cancel": "Cancel",
			"UseSignAgent": "Hardware key",
			"SelectFile": "Select",
			"ITAgentNotInstalled": "The signature library is not running or is not installed on the system. To continue, you must run or install the library",
			"ITAgentOldVersion": "An older version of the signature library is used. You must install a new version",
			"ITAgentInstallUrl": "Installation package of the signature library",
			"ITAgentCheckOther": "If signature library is running, check next:",
		},
		uk: {
			"CA": "ЦСК",
			"PrivateKey": "Приватний ключ",
			"Password": "Пароль ключа",
			"Certificates": "Сертифікати",
			"OfflineMode": "Локальні сертифікати (offline-режим)",
			"KeyInMemory": "Ключ буде збережений в пам'яті до закриття вкладки браузера",
			"KeyInLocalStorageClient": "Ключ буде збережений в браузері для майбутнього використання. Для видалення ключа із браузера необхідно викликати функцію \"Інструменти і налаштування → ЕЦП → Очистити ключ\"",
			"Sign": "Підписати",
			"SignFile": "Підписати файл",
			"Envelop": "Зашифрувати",
			"Develop": "Розшифрувати",
			"RecepientsCertificates": "Сертифікати користувачів отримувачів",
			"Cancel": "Відмінити",
			"UseSignAgent": "Апаратний ключ",
			"SelectFile": "Огляд",
			"ITAgentNotInstalled": "Бібліотека підписи не запущена або не встановлена в системі. Для продовження необхідно запустити або встановити бібліотеку",
			"ITAgentOldVersion": "Використовується стара версія бібліотеки підпису. Необхідно встановити нову версію",
			"ITAgentInstallUrl": "Інсталяційний пакет бібліотеки підпису",
			"ITAgentCheckOther": "Якщо бібліотеку запущено, то перевірте наступне:",
		},
		ru: {
			"CA": "ЦСК",
			"PrivateKey": "Приватный ключ",
			"Password": "Пароль ключа",
			"Certificates": "Сертификаты",
			"OfflineMode": "Локальные сертификаты (offline-режим)",
			"KeyInMemory": "Ключ будет сохранен в памяти до закрытия вкладки браузера",
			"KeyInLocalStorageClient": "Ключ будет сохранен в браузере для последующего использования. Для удаления ключа из браузера необходимо вызвать функцию \"Инструменты и настройки → ЭЦП → Очистить ключ\"",
			"Sign": "Подписать",
			"SignFile": "Подписать файл",
			"Envelop": "Зашифровать",
			"Develop": "Расшифровать",
			"RecepientsCertificates": "Сертификаты пользователей получателей",
			"Cancel": "Отменить",
			"UseSignAgent": "Аппаратный ключ",
			"SelectFile": "Обзор",
			"ITAgentNotInstalled": "Библиотека подписи не запущена или не установлена в системе. Для продолжения необходимо запустить или установить библиотеку",
			"ITAgentOldVersion": "Используется старая версия библиотеки подписи. Необходимо установить новую версию",
			"ITAgentInstallUrl": "Инсталляционный пакет библиотеки подписи",
			"ITAgentCheckOther": "Если библиотека запущена, то проверьте следующее:",
		}
	}

	var baseUrl = "";
	var config = {};
	function updateConfig() {
		config = {
			"web": {
				url: baseUrl + "/DigitalSignature/WebEds",
				id: "eds_web"
			},
			"agent": {
				url: baseUrl + "/DigitalSignature/SignAgentEds",
				id: "eds_agent"
			}
		}
	}

	function getErrorMessage(e) {
		var message = "";
		if (!e) {
			return message;
		}
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

	function getErrorCode(e) {
		var code = 0;
		if (!e) {
			return -1;
		}
		if (typeof (e) === "number") {
			code = e;
		}
		if (e.GetErrorCode) {
			code = e.GetErrorCode();
		}
		else if (e.errorCode) {
			code = e.errorCode;
		}
		return code;
	}

	var caVersion = null;

	function byteArrayToBase64(array) {
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
	}

	function base64ToByteArray(str) {
		var raw = window.atob(str);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for (i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}
		return array;
	}

	function loadDataFromServer(path, onSuccess, onError, asByteArray) {
		var pThis = this;
		try {
			var httpRequest;
			var url;

			if (XMLHttpRequest)
				httpRequest = new XMLHttpRequest();
			else
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");

			httpRequest.onload = function () {
				if (httpRequest.readyState != 4)
					return;

				if (httpRequest.status == 200) {
					if (asByteArray) {
						onSuccess(new Uint8Array(this.response));
					} else {
						onSuccess(httpRequest.responseText);
					}
				}
				else {
					onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
				}
			};

			httpRequest.onerror = function () {
				onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
			};

			if (path.indexOf('http://') != 0 &&
					path.indexOf('https://') != 0) {
				if (!location.origin) {
					location.origin = location.protocol +
						"//" + location.hostname +
						(location.port ? ':' + location.port : '');
				}

				url = location.origin + path;
			} else {
				url = path;
			}

			httpRequest.open("GET", url, true);
			if (asByteArray)
				httpRequest.responseType = 'arraybuffer';
			httpRequest.send();
		} catch (e) {
			onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
		}
	}

	function setLocalStorageItem(name, item) {
		try {
			if (typeof item === 'string') {
				window.localStorage.setItem(name, item);
			} else {
				var encoded = byteArrayToBase64(item);
				window.localStorage.setItem(name, encoded);
			}
		} catch (e) {
			return false;
		}
		return true;
	}

	function getLocalStorageItem(name, decode) {
		try {
			var item = window.localStorage.getItem(name);
			if (item == null || item === 'underfined') {
				return null;
			}

			if (!decode) {
				return item;
			} else {
				return base64ToByteArray(item);
			}
		} catch (e) {
			return null;
		}
	}

	function EdsWrapper(params) {
		if (!params.storagePrefix) {
			params.storagePrefix = "";
		}
		this.GlSign = new GlSign();
		this.GlSign.Parse(params.glSign);
		this.Params = params;
		this.CAsServers = null;
		this.Certificates = null;
		this.Providers = {};
		return this;
	}

	EdsWrapper.prototype.init = function () {
		var that = this;

		var init = new Promise(function (resolve, reject) {
			that.showLoading(true);
			that.getVersion(resolve, reject);
		});

		var loadCAs = function () {
			return new Promise(function (resolve, reject) {
				that.loadCA(resolve, reject);
			});
		}

		var loadCertificates = function () {
			return new Promise(function (resolve, reject) {
				that.loadCertificates(resolve, reject);
			});
		}

		var initProvider = function () {
			return new Promise(function (resolve, reject) {
				if (!that.ProviderName && !that.Params.customUI) {
					that.ProviderName = getLocalStorageItem(that.Params.storagePrefix + "EdsProvider");
				}
				if (!that.ProviderName) {
					that.ProviderName = "web";
				}
				that.initProvider(that.ProviderName, resolve, reject);
			});
		}

		var postInitActions = function() {
			return new Promise(function (resolve, reject) {
				that.refreshDevices();
				resolve();
			});
		}
		var initilizeFinished = function (error) {
			that._isInitialized = true;
			that.setProvider(that.ProviderName);
			if (error === undefined) {
				//that.setCa(parseInt(getLocalStorageItem(that.getDebugPrefix() + that.Params.storagePrefix + "CAServerIndex")));
				that.showLoading(false);
				if (that.onInitialize) {
					that.onInitialize();
					that.onInitialize = null;
				}
				if (that.Params.onInit) {
					that.Params.onInit();
				}
			}
			else {
				that.createDialog();
				that.showWarning(getErrorMessage(error));
				that.dialog.setText("Инициализация библиотеки");
				that.form.setItemLabel("btn", "Повторить");
			}
		}

		this.showLoading(true);
		setTimeout(function () {
			init.then(loadCAs).then(loadCertificates).then(initProvider).then(initilizeFinished).then(postInitActions).catch(function (e) {
				if (that.ProviderName === "agent") {
					that.ProviderName = "web";
				} else {
					that.ProviderName = "agent";
				}
				new Promise(function (resolve, reject) {
					that.initProvider(that.ProviderName, resolve, reject);
				}).then(initilizeFinished).catch(function (e) {
					that.showLoading(false);
				});
			});
		}, 10);
	}

	EdsWrapper.prototype.postInitialize = function() {
		
	}

	EdsWrapper.prototype.getDebugPrefix = function () {
		return this.Params.debugMode ? "Test" : "";
	}

	EdsWrapper.prototype.exec = function (params) {
		if (params.onSuccess) {
			this.Params.onSuccess = params.onSuccess;
		}
		if (params.onError) {
			this.Params.onError = params.onError;
		}
		this.setRequestCa(false);
		this.Params.action = params.action;
		this.Params.actionParams = params.actionParams;
		if (this._isInitialized) {
			this.setFieldsVisibility();
			this.performAction();
		} else {
			var that = this;
			this.onInitialize = function () {
				that.performAction();
			}
		}
	}

	EdsWrapper.prototype.getLanguage = function() {
		var lang = null;
		if (this.Params) {
			lang = this.Params.lang;
		}
		if (!lang && this.lang) {
			switch (this.lang) {
				case 1:
					lang = "uk";
					break;
				case 2:
					lang = "ru";
					break;
				case 3:
					lang = "en";
					break;
			}
		}
		if (!lang) {
			lang = "ru";
		}
		return lang;
	}
	
	EdsWrapper.prototype.getPhase = function (key) {
		var lang = this.getLanguage();
		return translates[lang][key];
	}

	EdsWrapper.prototype.initProvider = function (name, success, error) {
		if (!name) {
			name = "web";
		}
		var that = this;
		var successFunc = function () {
			that.initializedProviders[name] = true;
			success();
		}
		if (!this.initializedProviders) {
			this.initializedProviders = {};
		}
		var langCode = 0;
		switch (this.Params.lang) {
			case "uk":
				langCode = 1;
				break;
			case "ru":
				langCode = 2;
				break;
			case "en":
				langCode = 3;
				break;
		}
		var initProps = {
			casServers: this.CAsServers,
			certificates: this.Certificates,
			storagePrefix: this.Params.storagePrefix,
			glSign: this.GlSign,
			glSignStr: this.Params.glSign,
			lang: langCode,
			onSuccess: function (e) {
				that.showLoading(false);
				if (that.form) {
					that.form.setItemValue('recipient_certs', "");
				}
				that.Params.onSuccess(e);
				that.hideDialog();
			},
			onError: function (e, code) {
				that.showLoading(false);
				if (that.form) {
					that.form.setItemValue('recipient_certs', "");
				}
				if (!code) {
					code = getErrorCode(e);
				}
				that.Params.onError(getErrorMessage(e), code);
				that.hideDialog();
			},
			onWarning: function (e) {
				that.showLoading(false);
				that.showWarning(getErrorMessage(e));
			},
			getAutoDetect: function() {
				return that.RequestCa !== true;
			},
			onDetectCaFailed: function () {
				that.setRequestCa(true);
				that.createDialog();
				that.setFieldsVisibility();
				that.showWarning(
					"Не удалось определить центр сертификации, который выдал ключ. Укажите центр сертификации вручную и повторите попытку");
			},
			allowStoreKey: this.Params.allowStore,
			setLocalStorageItem: setLocalStorageItem,
			getLocalStorageItem: getLocalStorageItem
		}

		var frame = document.getElementById(config[name]["id"]);
		if (frame) {
			if (this.initializedProviders[name]) {
				success();
			} else {
				frame.contentWindow.initialize(initProps,
					function() {
						that.postInitialize();
						successFunc();
					}, error);
			}
			return;
		}
		
		
		function loadPageText(url){
			
			return new Promise(function (resolve,reject) {
				var xhr = new XMLHttpRequest();
				xhr.addEventListener("readystatechange", function () {
					if (this.readyState === 4) {
						resolve(this.response)
					}
				});
				xhr.open("GET", url);
				xhr.send(null);
			})
		}
		
		
		var src = config[name]["url"];
		loadPageText(src).then(function(stringPage){
			var frame = document.createElement("iframe");
			frame.id = config[name]["id"];
			frame.style.display = "none";
			
			frame.onload = function () {
				frame.contentWindow.URL_XML_HTTP_PROXY_SERVICE = baseUrl + "/ProxyHandler.ashx",
				frame.contentWindow.initialize(initProps, function () {
					that.postInitialize();
					successFunc();
				}, error);
			}
			
			document.body.appendChild(frame);
			frame.contentDocument.open();
			
			var protocol = window.location.href.split("/")[0];
			stringPage = stringPage.replace(/http:/gi, protocol);
			
			frame.contentDocument.write(stringPage);
			frame.contentDocument.close();
		});
		
		
		
	}

	EdsWrapper.prototype.setRequestCa = function(value) {
		this.RequestCa = value;
		if (this.Params.onAutoDetectCaChanged) {
			this.Params.onAutoDetectCaChanged(value);
		}
		if (this.onAutoDetectCaFailedHandlers) {
			for (var i = 0; i < this.onAutoDetectCaFailedHandlers.length; i++) {
				this.onAutoDetectCaFailedHandlers[i](value);
			}
		}
	}

	EdsWrapper.prototype.setProvider = function (name) {
		this.ProviderName = name;
		if (!this.Params.customUI) {
			setLocalStorageItem(this.Params.storagePrefix + "EdsProvider", name);
		}
	}

	EdsWrapper.prototype.getProviderObject = function () {
		var frame = document.getElementById(config[this.ProviderName]["id"]);
		return frame.contentWindow;
	}

	EdsWrapper.prototype.isJsApi = function() {
		return this.ProviderName === "web";
	}

	EdsWrapper.prototype.getVersion = function (success, error) {
		if (caVersion) {
			success();
			return;
		}
		var that = this;
		var date = new Date();
		loadDataFromServer(baseUrl + "/Data/version.txt?v=" + date.getTime(), function (version) {
			caVersion = version;
			success();
		}, function () {
			var d = new Date();
			caVersion = d.getFullYear() + "" + d.getMonth() + "" + d.getDate();
			success();
		}, false);
	}

	EdsWrapper.prototype.loadCertificates = function (success, error) {
		if (this.Certificates) {
			success();
			return;
		}
		var dbgPrefix = this.getDebugPrefix();
		var certificates = getLocalStorageItem(dbgPrefix + "Certificates", true);
		var certificatesVersion = getLocalStorageItem(dbgPrefix + "CertificatesVersion");
		if (certificates && certificatesVersion === caVersion) {
			this.Certificates = certificates;
		}
		if (this.Certificates) {
			success();
			return;
		}
		var that = this;
		loadDataFromServer(baseUrl + "/Data/CACertificates" + (this.Params.debugMode ? ("." + dbgPrefix) : "") + ".p7b?v=" + caVersion, function (certs) {
			that.Certificates = certs;
			setLocalStorageItem(dbgPrefix + "Certificates", certs);
			setLocalStorageItem(dbgPrefix + "CertificatesVersion", caVersion);
			success();
		}, function (e) {
			error(e);
		}, true);

	}

	EdsWrapper.prototype.loadCA = function (success, error) {
		if (this.CAsServers) {
			success();
			return;
		}
		var dbgPrefix = this.getDebugPrefix();
		var parseCAs = function (str) {
			try {
				return JSON.parse(str);
			} catch (e) {
				return null;
			}
		}
		var casStr = getLocalStorageItem(dbgPrefix + "CA");
		var version = getLocalStorageItem(dbgPrefix + "CAVersion");
		if (casStr && caVersion === version) {
			this.CAsServers = parseCAs(casStr);
		}

		if (!this.CAsServers) {
			var that = this;
			loadDataFromServer(baseUrl + "/Data/CAs" + (this.Params.debugMode ? ("." + dbgPrefix) : "") + ".json?v=" + caVersion,
				function (response) {
					try {
						var casStr = response.replace(/\\'/g, "'");
						that.CAsServers = parseCAs(casStr);
						setLocalStorageItem(dbgPrefix + "CA", casStr);
						setLocalStorageItem(dbgPrefix + "CAVersion", caVersion);
						success();
					} catch (e) {
						error(e);
					}
				},
				function (e) {
					error(e);
				},
				false);
		} else {
			success();
		}
	}

	EdsWrapper.prototype.createDialog = function() {
		if (this.Params.customUI) {
			return;
		}
		if (this.dialog || this.layout) {
			this.form.showItem("btn");
			this.setDialogLabels();
			this.showDialog();
			this.showLoading(false);
			return;
		}
		var that = this;
		createDhtmlxItems();
		var placeholder = document.getElementById(this.Params.placeholder);
		placeholder.innerText = "";
		var jsFormData = [
			{ type: "settings", position: "label-left", labelWidth: "200", inputWidth: "450" },
			{ type: "warning", value: "", name: "agent_warning" }
		];
		
		jsFormData.push({ type: "checkbox", label: this.getPhase("UseSignAgent"), name: "use_agent", checked: this.ProviderName === "agent", position: "label-right" });
		jsFormData.push({
			type: "block",
			name: "devices_block",
			className: "devices-block"
,			list: [
				{ type: "select", label: "Носитель ключа", value: "", name: "device", inputWidth: "450" },
				{ type: "newcolumn" },
				{ type: "button", value: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 438.542 438.542" style="enable-background:new 0 0 438.542 438.542;" xml:space="preserve"><g><path d="M427.408,19.697c-7.803-3.23-14.463-1.902-19.986,3.999l-37.116,36.834C349.94,41.305,326.672,26.412,300.5,15.848   C274.328,5.285,247.251,0.003,219.271,0.003c-29.692,0-58.052,5.808-85.08,17.417c-27.03,11.61-50.347,27.215-69.951,46.82   c-19.605,19.607-35.214,42.921-46.824,69.949C5.807,161.219,0,189.575,0,219.271c0,29.687,5.807,58.05,17.417,85.079   c11.613,27.031,27.218,50.347,46.824,69.952c19.604,19.599,42.921,35.207,69.951,46.818c27.028,11.611,55.388,17.419,85.08,17.419   c32.736,0,63.865-6.899,93.363-20.7c29.5-13.795,54.625-33.26,75.377-58.386c1.52-1.903,2.234-4.045,2.136-6.424   c-0.089-2.378-0.999-4.329-2.711-5.852l-39.108-39.399c-2.101-1.711-4.473-2.566-7.139-2.566c-3.045,0.38-5.232,1.526-6.566,3.429   c-13.895,18.086-30.93,32.072-51.107,41.977c-20.173,9.894-41.586,14.839-64.237,14.839c-19.792,0-38.684-3.854-56.671-11.564   c-17.989-7.706-33.551-18.127-46.682-31.261c-13.13-13.135-23.551-28.691-31.261-46.682c-7.708-17.987-11.563-36.874-11.563-56.671   c0-19.795,3.858-38.691,11.563-56.674c7.707-17.985,18.127-33.547,31.261-46.678c13.135-13.134,28.693-23.555,46.682-31.265   c17.983-7.707,36.879-11.563,56.671-11.563c38.259,0,71.475,13.039,99.646,39.116l-39.409,39.394   c-5.903,5.711-7.231,12.279-4.001,19.701c3.241,7.614,8.856,11.42,16.854,11.42h127.906c4.949,0,9.23-1.807,12.848-5.424   c3.613-3.616,5.42-7.898,5.42-12.847V36.55C438.542,28.558,434.84,22.943,427.408,19.697z" fill="#3399cc"/></g></svg>', name: "refresh", className: "refresh-devices-button", width: "24", inputWidth: "24" }
			]
		});
		jsFormData.push({ type: "select", label: this.getPhase("CA"), value: "", name: "ca", inputWidth: "450" });
		jsFormData.push({ type: "uploaderEx", label: this.getPhase("PrivateKey"), value: "", name: "private_key" });
		jsFormData.push({ type: "password", label: this.getPhase("Password"), value: "", name: "password" });
		jsFormData.push({ type: "uploaderEx", label: this.getPhase("Certificates"), value: "", name: "certificates", multiple: true });

		if (this.Params.allowStore) {
			if (!this.Params.allowStoreLocal) {
				jsFormData.push({ type: "label", label: this.getPhase("KeyInMemory"), value: "", labelWidth: "650", name: "sessionlabel" });
			} else {
				jsFormData.push({ type: "radio", label: this.getPhase("KeyInMemory"), value: "session", position: "label-right", checked: true, labelWidth: "600", name: "save_mode" });
				jsFormData.push({ type: "radio", label: this.getPhase("KeyInLocalStorageClient"), value: "local", position: "label-right", labelWidth: "600", name: "save_mode", style: "white-space: normal;", className: "agent-dialog-radio" });
			}
		}

		jsFormData.push({ type: "uploaderEx", label: this.getPhase("RecepientsCertificates"), value: "", multiple: true, name: "recipient_certs" });
		if (!this.Params.showToolbar) {
			jsFormData.push({ type: "button", name: "btn", value: this.getPhase("SignIn"), className: "button" });
		}

		var toolbarData = {
			items: [
				{ id: "ok", text: "", type: "button" },
				{ id: "cancel", text: this.getPhase("Cancel"), type: "button" }
			]
		};

		if (this.Params.windowMode) {
			
			var windowPlaceholder  = document.createElement("div");
			windowPlaceholder.setAttribute("style","position: absolute; left: 0; top: 0; bottom: 0; right: 0");
			windowPlaceholder.id = 'eds_placeholder';
			
			document.body.appendChild(windowPlaceholder);
			if (!this.dhxWins) {
				this.dhxWins = new dhtmlXWindows();
				this.dhxWins.attachViewportTo(windowPlaceholder);
			}
			this.dialog = this.dhxWins.createWindow("signatureWindow", 0, 0, 700, 400);
			this.dialog.attachEvent("onClose",
				function () {
					that.hideDialog();
					if (that.Params.onClose) {
						that.Params.onClose();
					}
					return false;
				});
			this.dialog.showHeader();
			if (this.Params.showToolbar) {
				this.toolbar = this.dialog.attachToolbar(toolbarData);
			}
			this.form = this.dialog.attachForm(jsFormData);
			this.dialog.denyPark();
			this.dialog.denyResize();
			this.dialog.denyMove();
			this.dialog.show();
			this.dialog.centerOnScreen();
		} else {
			this.layout = new dhtmlXLayoutObject({
				parent: placeholder,
				pattern: "1C"
			});
			this.layout.setSizes(700, 600);
			var cell = this.layout.cells("a");
			cell.hideHeader();
			cell.setHeight(600);
			cell.setText("");
			if (this.Params.showToolbar) {
				this.toolbar = cell.attachToolbar(toolbarData);
			}
			this.form = cell.attachForm(jsFormData);
		}
		this.setDialogLabels();
		if (this.Params.showToolbar) {
			this.toolbar.attachEvent("onClick",
				function (id) {
					switch (id) {
						case "ok":
							that.onActionClick();
							break;
						case "cancel":
							that.hideDialog();
							if (that.Params.onClose) {
								that.Params.onClose();
							}
							break;
					}
				});
		}
		this.form.attachEvent("onChange", function (name, value, isChecked) {
			if (name === "ca") {
				that.setCa(value);
			} else if (name === "use_agent") {
				that.changeProvider(isChecked ? "agent" : "web");
			}
		});
		this.form.attachEvent("onKeyUp",function(inp, ev, name, value){
			if (name === "password" && ev.keyCode === 13) {
				that.onActionClick();
			}
		});
		this.form.attachEvent("onButtonClick", function (name) {
			if (name === "btn") {
				if (that.dialogMode === 1) {
					var deviceId = that.devicesTree.getSelectedItemId();
					var obj = that.getProviderObject();
					var zones = deviceId.split('_');
					obj.readkeySilently(parseInt(zones[0]),
						parseInt(zones[1]),
						that.form.getItemValue("password"),
						function() {
							that.onActionClick();
						},
						function(e) {
							that.showWarning(getErrorMessage(e));
						});
				} else {
					that.onActionClick();
				}
			}
			else if (name === "refresh") {
				that.showLoading(true);
				setTimeout(function() {
						that.refreshDevices();
						that.showLoading(false);
					},
					10);

			}
		});

		var casCount = this.CAsServers.length;
		var options = [];
		for (var i = 0; i < this.CAsServers.length; i++) {
			options.push({
				text: this.CAsServers[i].issuerCNs[0],
				value: i
			});
		}
		options.push({
			text: this.getPhase("OfflineMode"),
			value: casCount
		});
		this.form.reloadOptions("ca", options);
		this.form.setItemValue("ca", this.CAServerIndex);
		this.setFieldsVisibility();
		this.showLoading(false);
	}

	EdsWrapper.prototype.envelopPartialFileData = function (blob, certUrl, callback) {
		var that = this;
		if (!this.certsUrlCache) {
			this.certsUrlCache = {};
		}
		if (!this.certsUrlCache[certUrl]) {
			loadDataFromServer(certUrl, function (cert) {
				that.certsUrlCache[certUrl] = cert;
				that.envelopPartialFileData(blob, certUrl, callback);
			}, function () {
				callback(null);
			}, true);
			return;
		}
		var provider = this.getProviderObject();
		var certBytes = this.certsUrlCache[certUrl];
		this.readBlobBytes(blob,
			function(data) {
				var crypted = null;
				try {
					if (provider.euSign.EnvelopToRecipientsWithDynamicKey) {
						crypted = provider.euSign.BASE64Decode(
							provider.euSign.EnvelopToRecipientsWithDynamicKey([certBytes],
								false,
								false,
								new Uint8Array(data),
								false));
					} else {
						crypted = provider.euSign.EnvelopDataToRecipientsWithDynamicKey([certBytes],
							false,
							false,
							new Uint8Array(data),
							false);
					}
				} catch (e) {

				}
				callback(crypted);
			});
	}

	EdsWrapper.prototype.readBlobBytes = function (blob, callback) {
		var reader = new FileReader();
		reader.onload = function () {
			var content = reader.result;
			callback(content);
		};
		reader.readAsArrayBuffer(blob);
	}

	EdsWrapper.prototype.setDialogLabels = function () {
		var captionKey = "Sign";
		switch (this.Params.action) {
			case "signData":
			case "signFile":
				captionKey = "Sign";
				break;
			case "envelopFile":
				captionKey = "Envelop";
				break;
			case "developFile":
				captionKey = "Develop";
				break;
		}
		var caption = this.getPhase(captionKey);
		if (this.Params.actionCaption) {
			caption = this.Params.actionCaption;
		}
		if (this.Params.showToolbar) {
			this.toolbar.setItemText("ok", caption);
		} else {
			this.form.setItemLabel("btn", caption);
		}
		if (this.dialog) {
			this.dialog.setText(caption);
		}
	}

	EdsWrapper.prototype.setFieldsVisibility = function () {
		if (!this.form) {
			this.createDialog();
		}
		if (this.Params.customUI) {
			return;
		}
		var provider = this.getProviderObject();
		if (this.RequestCa) {
			this.form.showItem("ca");
		} else {
			this.form.hideItem("ca");
		}
		if (this.ProviderName === "web" && !provider.needProvideKey()) {
			this.form.hideItem("use_agent");
		} else {
			this.form.showItem("use_agent");
		}
		if (this.ProviderName === "agent") {
			this.form.showItem("devices_block");
			this.form.showItem("device");
		} else {
			this.form.hideItem("devices_block");
			this.form.hideItem("device");
		}
		if (this.ProviderName === "web") {
			this.form.showItem("private_key");
			
		} else {
			this.form.hideItem("private_key");
		}
		if (provider.needPrivateKeyCertificates() && provider.needProvideKey() && this.RequestCa) {
			this.form.showItem("certificates");
		} else {
			this.form.hideItem("certificates");
		}
		if (this.ProviderName === "web") {
			if (provider.needProvideKey()) {
				if (this.Params.allowStoreLocal) {
					this.form.showItem("save_mode", "local");
					this.form.showItem("save_mode", "session");
					this.form.hideItem("sessionlabel");
				} else {
					this.form.hideItem("save_mode", "local");
					this.form.hideItem("save_mode", "session");
					this.form.showItem("sessionlabel");
				}
			} else {
				this.form.hideItem("save_mode", "local");
				this.form.hideItem("save_mode", "session");
				this.form.hideItem("sessionlabel");
			}
		} else {
			this.form.hideItem("save_mode", "local");
			this.form.hideItem("save_mode", "session");
			this.form.hideItem("sessionlabel");
		}

		if (this.Params.action === "envelopFile" && this.ProviderName === "web") {
			this.form.showItem("recipient_certs");
		} else {
			this.form.hideItem("recipient_certs");
		}
		this.adjustWindowSize();
	}

	EdsWrapper.prototype.adjustWindowSize = function (repeat) {
		var contentHeight;
		var toolbarHeight = 0;
		var margin = 20;
		if (this.layout) {
			var cell = this.layout.cells("a").cell;
			contentHeight = cell.querySelector(".dhxform_base").clientHeight;
			if (this.Params.showToolbar) {
				toolbarHeight = cell.querySelector(".dhx_cell_toolbar_def").clientHeight;
			}
			document.getElementById(this.Params.placeholder).style.height = contentHeight + toolbarHeight + margin +"px";
			
			this.layout.setSizes();
			if (!repeat) {
				this.adjustWindowSize(true);
			}
		} else if (this.dialog) {
			var dialogWidth = this.dialog.getDimension()[0];
			contentHeight = this.dialog.cell.querySelector(".dhxform_base").clientHeight;
			if (this.Params.showToolbar) {
				toolbarHeight = this.dialog.cell.querySelector(".dhx_cell_toolbar_def").clientHeight;
			}
			var headerHeight = 50;
			this.dialog.setDimension(dialogWidth, contentHeight + toolbarHeight + headerHeight + margin);
			if (!repeat) {
				this.adjustWindowSize(true);
			} else {
				this.dialog.centerOnScreen();
			}
		}
	}

	EdsWrapper.prototype.showWarning = function (msg) {
		this.showLoading(false);
		if (this.Params.customUI) {
			this.Params.onWarning(msg);
			return;
		}
		if (!msg) {
			if (this.form) {
				this.form.setItemValue("agent_warning", null);
				this.adjustWindowSize();
			}
		} else {
			this.createDialog();
			this.form.setItemValue("agent_warning", msg);
			this.adjustWindowSize();
		}
	}

	EdsWrapper.prototype.showDialog = function () {
		this.showLoading(false);
		if (this.dialog) {
			document.getElementById("eds_placeholder").style.display ="block";
			this.dialog.show();
		} else {
			this.layout.base.style.display ="block";
		}
		this.setFieldsVisibility();
	}

	EdsWrapper.prototype.hideDialog = function () {
		if (this.Params.dontHideDialog) {
			return;
		}
		if (this.dialog) {
			document.getElementById("eds_placeholder").style.display ="none";
			this.dialog.hide();
		} else if (this.layout) {
			this.layout.base.style.display ="none";
		}
	}

	EdsWrapper.prototype.showLoading = function (show) {
		if (this.Params.loadingFunc) {
			this.Params.loadingFunc(show);
		}
	}

	EdsWrapper.prototype.changeProvider = function(name) {
		if (!this.Params.customUI) {
			this.form.setItemValue("agent_warning", null);
		}
		
		this.adjustWindowSize();
		var that = this;
		this.showLoading(true);
		this.initProvider(name,
			function () {
				that.isCaSet = false;
				that.setProvider(name);
				that.setFieldsVisibility();
                that.showLoading(false);
                that.onProviderChanged();
			},
			function (e) {
				that.showLoading(false);
                if (name === "agent") {
                    if (!that.Params.customUI) {
                        that.form.setItemValue("use_agent", false);
                        that.form.setItemValue("agent_warning", e.message);
                    }
                    that.showWarning(getErrorMessage(e));
                    that.adjustWindowSize();
                } else if (!that.Params.customUI) {
                    that.form.setItemValue("use_agent", true);
                }
                that.onProviderChanged(getErrorMessage(e));
			});
    }

	EdsWrapper.prototype.addOnProviderChangedHandler = function(f) {
		if (!this.onProviderChangedHandlers) {
			this.onProviderChangedHandlers = [];
		}
		this.onProviderChangedHandlers.push(f);
	}

	EdsWrapper.prototype.addOnAutoDetectCaFailedHandler = function (f) {
		if (!this.onAutoDetectCaFailedHandlers) {
			this.onAutoDetectCaFailedHandlers = [];
		}
		this.onAutoDetectCaFailedHandlers.push(f);
	}

	EdsWrapper.prototype.onProviderChanged = function (e) {
		this.refreshDevices();
		this.setRequestCa(false);
        if (this.Params.onProviderChanged) {
            this.Params.onProviderChanged(e);
        }
        if (this.onProviderChangedHandlers) {
	        for (var i = 0; i < this.onProviderChangedHandlers.length; i++) {
		        this.onProviderChangedHandlers[i](e);
	        }
        }
	}

	EdsWrapper.prototype.refreshDevices = function () {
		if (this.ProviderName !== "agent" || this.Params.customUI) {
			return;
		}

		this.createDialog();
		var types = this.getAllAvailableDevices();

		var items = [];
		if (types && types.length) {
			for (var i = 0; i < types.length; i++) {
				items.push({ text: types[i].title, value: types[i].typeIndex + ";" + types[i].deviceIndex });
			}
		} else {
			items.push({ text: "Не обнаружено доступных носителей", value: "-1" });
		}
		this.form.reloadOptions("device", items);
		this.form.setItemValue("device", items[0].value);
	}

	EdsWrapper.prototype.onActionClick = function () {
		var that = this;
		this.form.setItemValue("agent_warning", null);
		switch (this.Params.action) {
			case "signFile":
			case "signData":
			case "envelopFile":
			case "developFile":
			case "getKeyInfo":
				var provider = this.getProviderObject();
				if (this.ProviderName === "web") {
					if (this.Params.allowStoreLocal && this.form.getItemValue("save_mode") === "local") {
						provider.setLocalStorage(true);
					} else {
						provider.setLocalStorage(false);
					}
					this.doAction();
				} else {
					var device = that.form.getItemValue('device');
					if (device === "-1") {
						return;
					}
					var keyInfo = device.split(";");
					provider.readHardwarePrivateKey(keyInfo[0],
						keyInfo[1],
						that.form.getItemValue('password'),
						[],
						function () {
							that.performAction();
						});
				}
				break;
			case "verifyFile":
			case "verifyData":
				this.performAction();
				break;
		}
	}

	EdsWrapper.prototype.setCa = function (index) {
		var obj = this.getProviderObject();
		if (!index || isNaN(index) || index >= this.CAsServers.length) {
			index = 0;
        }
        if (this.CAServerIndex === index && this.isCaSet) {
            return;
        }
		this.isCaSet = obj.setCa(index);
		if (this.isCaSet) {
			this.CAServerIndex = index;
		}
		if (this.form) {
			if (obj.needPrivateKeyCertificates()) {
				this.form.showItem("certificates");
			} else {
				this.form.hideItem("certificates");
			}
		}
		this.adjustWindowSize();
    }

    EdsWrapper.prototype.needUserCertificates = function() {
        var obj = this.getProviderObject();
        return obj.needPrivateKeyCertificates();
    }

	EdsWrapper.prototype.clearKey = function (onlyLocalStorage) {
		var storageKeys = [
			"PrivateKey", "PrivateKeyCertificatesChain", "PrivateKeyName", "PrivateKeyPassword", "EdsProvider"
		];
		this.setRequestCa(false);
		for (var i = 0; i < storageKeys.length; i++) {
			var key = this.Params.storagePrefix + storageKeys[i];
			if (!onlyLocalStorage) {
				window.sessionStorage.removeItem(key);
				window.sessionStorage.removeItem("Test" + key);
			}
			window.localStorage.removeItem(key);
			window.localStorage.removeItem("Test" + key);
		}
		if (!onlyLocalStorage) {

			var frames = document.querySelectorAll("#eds_web, #eds_agent");
			for (var i = 0; i < frames.length; i++) {
				frames[i].contentWindow.clearKey();
			}
		}
	}

	EdsWrapper.prototype.replaceCallbacks = function(callbacks) {
		if (callbacks) {
			this.Params.onSuccess = callbacks.onSuccess;
			this.Params.onError = callbacks.onError;
			this.Params.onWarning = callbacks.onWarning;
		}
	}

	EdsWrapper.prototype.readPrivateKey = function (privateKey, password, certificates, success, callbacks) {
		this.replaceCallbacks(callbacks);
		var obj = this.getProviderObject();
        this.showLoading(true);
        var that = this;
        setTimeout(function() {
            obj.readPrivateKey(function() {
                success();
            },
            privateKey,
            password,
            certificates);
        }, 0);

    }

	EdsWrapper.prototype.doAction = function () {
		var that = this;
		if (this.RequestCa) {
			this.setCa(this.CAServerIndex);
		}
        this.readPrivateKey(that.form.getItemValue('private_key'),
            that.form.getItemValue('password'),
            that.form.getItemValue("certificates"),
            function() {
                that.performAction();
            }
        );
    }

    EdsWrapper.prototype.signData = function(data, internal, callbacks) {
        this.Params.action = "signData";
        this.Params.actionParams = {
            data: data,
			internal: internal
        };
        this.replaceCallbacks(callbacks);

        this.performAction();
	}

	EdsWrapper.prototype.signDataArray = function (data, internal, callbacks) {
		this.Params.action = "signDataArray";
		this.Params.actionParams = {
			data: data,
			internal: internal
		};
		this.replaceCallbacks(callbacks);
		this.performAction();
	}

    EdsWrapper.prototype.verifyData = function(signedData, data, internal) {
        this.Params.action = "verifyData";
        this.Params.actionParams = {
            data: data,
            signedData: signedData,
            internal: internal
        };
        this.performAction();
    }

    EdsWrapper.prototype.getDevicesByTypes = function (types, allowCache) {
	    if (this.ProviderName !== "agent") {
		    return [];
	    }
	    var obj = this.getProviderObject();
	    return obj.getDevicesByTypes(types, allowCache);
    }

    EdsWrapper.prototype.getAllAvailableDevices = function() {
	    if (this.ProviderName !== "agent") {
		    return [];
	    }
	    var preferedTypes = [];
	    if (this.GlSign && this.GlSign.DeviceType) {
		    preferedTypes = this.GlSign.DeviceType.split("|");
	    }
	    var obj = this.getProviderObject();
	    return obj.getAllAvailableDevices(preferedTypes);
    }

    EdsWrapper.prototype.getDeviceTypes = function() {
        if (this.ProviderName !== "agent") {
            return [];
        }
        var preferedTypes = [];
		if (this.GlSign && this.GlSign.DeviceType) {
			preferedTypes = this.GlSign.DeviceType.split("|");
		}
		var obj = this.getProviderObject();
		return obj.getDeviceTypes(preferedTypes);
    }

    EdsWrapper.prototype.getDevices = function(typeIndex) {
        if (this.ProviderName !== "agent") {
            return [];
        }
        var obj = this.getProviderObject();
        return obj.getDevices(typeIndex);
    }

    EdsWrapper.prototype.readHardwarePrivateKey = function (deviceType, device, password, certificates, callback, callbacks) {
	    if (callbacks) {
		    this.Params.onSuccess = callbacks.onSuccess;
		    this.Params.onError = callbacks.onError;
		    this.Params.onWarning = callbacks.onWarning;
	    }
	    var obj = this.getProviderObject();
        this.showLoading(true);
	    var that = this;
	    setTimeout(function() {
            obj.readHardwarePrivateKey(deviceType, device, password, certificates, function() {
	            that.showLoading(false);
	            callback();
            });
	    }, 10);
    }
	
	EdsWrapper.prototype.performAction = function () {
		this.showLoading(true);
		var obj = this.getProviderObject();
		var that = this;
		switch (this.Params.action) {
			case "verifyFile":
				loadDataFromServer(that.Params.actionParams.fileUrl,
					function (fileData) {
						loadDataFromServer(that.Params.actionParams.signedFileUrl,
							function (signData) {
								obj.verifyFile(fileData, signData, that.Params.actionParams.hash);
							},
							function () {
								//TODO: error
							},
							true);
					},
					function () {
						//TODO: error
					},
					true);
				break;
			case "verifyData":
				obj.verifyData(this.Params.actionParams.signedData, this.Params.actionParams.data, this.Params.actionParams.internal, null);
				break;
			case "signData":
			case "signFile":
			case "envelopFile":
			case "developFile":
			case "signDataArray":
			case "getKeyInfo":
				var action = function () {
					if (that.Params.action === "signData") {
						obj.signData(that.Params.actionParams.data, that.Params.actionParams.internal);
					} else if (that.Params.action === "signDataArray") {
						obj.signDataArray(that.Params.actionParams.data, that.Params.actionParams.internal);
					} else if (that.Params.action === "getKeyInfo") {
						obj.getKeyInfo(function (info) {
							var str = info.isFilled ? "+" : "-";
							for (var i in info) {
								if (info.hasOwnProperty(i) && typeof info[i] !== "function") {
									str += "\r\n" + i + "=" + info[i];
								}
							}
							return str;
						});
					} else {
						loadDataFromServer(that.Params.actionParams.fileUrl,
							function(data) {
								switch (that.Params.action) {
								case "signFile":
									obj.signFile(data, that.Params.actionParams.hash);
									break;
								case "envelopFile":
									var certs = null;
									if (that.form) {
										certs = that.form.getItemValue('recipient_certs');
									}
									obj.envelopFile(data, certs);
									break;
								case "developFile":
									obj.developFile(data);
									break;
								}

							},
							function() {
								//TODO: error
							},
							true);
					}
				}
				var needRecipientCerts = that.Params.action === "envelopFile" &&
							that.ProviderName === "web" &&
							(!that.form || that.form.getItemValue('recipient_certs').length === 0);
				if (!obj.needProvideKey() && !needRecipientCerts) {
					setTimeout(action, 10);
				} else {
					setTimeout(function () {
						obj.readStoredPrivateKey(function (readed) {
							if (readed && !needRecipientCerts) {
								action();
							} else {
								that.createDialog();
							}
						});
					},
						10);
				}
				break;
		}
	}

	function createDhtmlxItems() {
		if (dhtmlXForm.prototype.items.uploaderEx) {
			return;
		}
		dhtmlXForm.prototype.items.uploaderEx = {
			render: function (item, data) {
				item._type = "uploaderEx";
				item._enabled = true;
				if (data.label) {
					var labelContainer = document.createElement("div");
					
					labelContainer.classList.add("dhxform_label", "dhxform_label_align_left");
					if (data.labelWidth) {
						labelContainer.style.width =  data.labelWidth;
					}
					labelContainer.innerHTML = "<label>"+data.label+"</label>";
					item.appendChild(labelContainer);
				}

				
				var input = document.createElement("input");
				input.type = "file";
				input.className = "upload";
				input.setAttribute("style", "opacity:0 !important");
				
				
				input.style.width = data.inputWidth;
				if (data.multiple) {
					input.setAttribute("multiple", "multiple");
				}
				var container = document.createElement("div");
				container.className="filecontainer";
				container.style.width = data.inputWidth;
				
				var label = document.createElement("div");
				label.className="filecontainer_label";
				var button = document.createElement("div");
				button.className="selectbutton";
				button.innerHTML = window.edsWrapper.getPhase("SelectFile");
				

				input.addEventListener("change",function () {
					var text = "";
					var files = input.files;
					for (var i = 0; i < files.length; i++) {
						var fullName = files[i].name;
						var index;
						if (fullName.lastIndexOf('\\')) {
							index = fullName.lastIndexOf('\\') + 1;
						} else {
							index = fullName.lastIndexOf('/') + 1;
						}
						var filename = fullName.slice(index);
						text += filename + ", ";
					}
					if (text.length > 0) {
						text = text.substring(0, text.length - 2);
					}
					label.innerText = text;
				});

				container.appendChild(label);
				container.appendChild(button);
				container.appendChild(input);

				item._input = input;
				item._label = label;
				item.appendChild(container);

				return this;
			},
			destruct: function (item) {
				item.innerHTML = "";
			},
			enable: function (item) {
			},
			disable: function (item) {
			},
			setValue: function (item, val) {
				item._input.value = val;
				item._label.text(val);
			},
			getValue: function (item) {
				return item._input.files;
			},
			getInput: function (item) {
				return item._input;
			}
		};

		dhtmlXForm.prototype.setFormData_uploaderEx = function (name, value) {
			return this.doWithItem(name, "setValue", value);
		};

		dhtmlXForm.prototype.getFormData_uploaderEx = function (name) {
			return this.doWithItem(name, "getValue");
		};

		dhtmlXForm.prototype.items.warning = {
			render: function (item, data) {
				item._type = "warning";
				item._enabled = true;

				var p = document.createElement("p");
				p.className = "signature-warning";
				p.style.display = "none";
				
				var container = document.createElement(div);
				container.appendChild(p);
				item.container = container;
				item.appendChild(container);
				return this;
			},
			destruct: function (item) {
				item.innerHTML = "";
			},
			enable: function (item) {
			},
			disable: function (item) {
			},
			setValue: function (item, val) {
				if (!val) {
					item.container.find("p").hide();
				} else {
					item.container.find("p").html(val);
					item.container.find("p").show();
				}
			},
			getValue: function (item) {
			},
			getInput: function (item) {
			}
		}

		dhtmlXForm.prototype.setFormData_warning = function (name, value) {
			return this.doWithItem(name, "setValue", value);
		};

		dhtmlXForm.prototype.getFormData_warning = function (name) {
			return this.doWithItem(name, "getValue");
		};
	}


	window.initEdsWrapper = function (params) {
		console.log("init eds");
		if (window.edsWrapper) {
			window.edsWrapper.addOnAutoDetectCaFailedHandler(params.onAutoDetectCaChanged);
			window.edsWrapper.addOnProviderChangedHandler(params.onProviderChanged);
			var interval = setInterval(function() {
				if (window.edsWrapper._isInitialized) {
					clearInterval(interval);
					params.onInit();
				}
			});
			return;
		}
		baseUrl = params.siteRoot;
		updateConfig();
		window.edsWrapper = new EdsWrapper(params);
		window.edsWrapper.init();
	}

	function GlSign() {
		return this;
	}

	GlSign.prototype.Parse = function (value) {
		if (!value) {
			value = "";
		}
		var settingArray = value.split(';');
		this.AllowSavePassword = this.getZoneValue(settingArray, 1) !== "1";
		// AutoSetParam
		this.AutoSetParams = this.getSubZoneValue(settingArray, 2, ',', 1) === "+";
		// Provider
		this.ProviderName = this.getSubZoneValue(settingArray, 2, ',', 2);
		// SaveCert
		this.SaveCert = this.getZoneValue(settingArray, 3) === "+";
		// crl
		this.CheckCrls = this.getSubZoneValue(settingArray, 4, ',', 1) === "+";
		this.OwnCrlsOnly = this.getSubZoneValue(settingArray, 4, ',', 2) === "+";
		this.FullAndDeltaCrls = this.getSubZoneValue(settingArray, 4, ',', 3) === "+";
		this.AutoDownloadCrls = this.getSubZoneValue(settingArray, 4, ',', 4) === "+";
		// tsp
		this.UseTsp = this.getSubZoneValue(settingArray, 5, ',', 1) === "+";
		this.TspAddress = this.getSubZoneValue(settingArray, 5, ',', 2);
		this.TspPort = parseInt(this.getSubZoneValue(settingArray, 5, ',', 3));
		// ocsp
		this.UseOcsp = this.getSubZoneValue(settingArray, 6, ',', 1) === "+";
		this.OcspAddress = this.getSubZoneValue(settingArray, 6, ',', 2);
		this.OcspPort = parseInt(this.getSubZoneValue(settingArray, 6, ',', 3));
		this.OcspBeforeStore = this.getSubZoneValue(settingArray, 6, ',', 4) === "+";
		this.UseOcspAccess = this.getSubZoneValue(settingArray, 6, ',', 5) === "+";
		// cmp
		this.UseCmp = this.getSubZoneValue(settingArray, 7, ',', 1) === "+";
		this.CmpAddress = this.getSubZoneValue(settingArray, 7, ',', 2);
		this.CmpPort = parseInt(this.getSubZoneValue(settingArray, 7, ',', 3));
		// ldap
		this.UseLdap = this.getSubZoneValue(settingArray, 8, ',', 1) === "+";
		this.LdapAddress = this.getSubZoneValue(settingArray, 8, ',', 2);
		this.LdapPort = parseInt(this.getSubZoneValue(settingArray, 8, ',', 3));

		this.ValidateOwner = this.getZoneValue(settingArray, 9) === "+";
		this.StrongCheck = this.getZoneValue(settingArray, 10) === "+";
		this.DontEraseKey = this.getZoneValue(settingArray, 11) === "+";
		this.IdleTimeout = parseInt(this.getZoneValue(settingArray, 12));
		this.DeviceType = this.getZoneValue(settingArray, 13);
	}

	GlSign.prototype.getZoneValue = function (zones, zone) {
		if (zones.length >= zone) {
			var zoneValue = zones[zone - 1];
			return zoneValue ? zoneValue : "";
		}
		return "";
	}

	GlSign.prototype.getSubZoneValue = function (zones, zone, separator, subzone) {
		var zoneValue = this.getZoneValue(zones, zone);
		if (!zoneValue) {
			return "";
		}
		var subZones = zoneValue.split(separator);
		return this.getZoneValue(subZones, subzone);
	}

})();