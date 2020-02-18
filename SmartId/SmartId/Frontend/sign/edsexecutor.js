function EdsExecutor(model) {
	if (EdsExecutor.instance) {
		return EdsExecutor.instance;
	}
	EdsExecutor.instance = this;
	this.viewModel = model;
	this.initialize(model);
}
window.EdsExecutor = EdsExecutor;

// private объект
const data = {
	keyType: 'soft',
	userCa: null,
	needUserCertificates: false,
	userCertificates: [],
	keyFile: null,
	keyPasword: null,
	useInternalSignification: true,
	warning: null,
	error: null,

	/* Подпись */
	execSigning (e) {
		var that = EdsExecutor.instance;
		if (that.keyType === 'hard') {
			console.log('execSigning: 1', that.keyType);
			let device = that.hardwareDevice;
			if (!device) {
				return;
			}
			let keyInfo = device.split(';');
			that.edsWrapper.readHardwarePrivateKey(
				keyInfo[0],
				keyInfo[1],
				data.keyPassword,
				data.userCertificates,
				data.signingFunction,
				data.callbacks
			);
		}
		else if (that.keyType === 'soft') {
			console.log('execSigning: 2', that.keyType);
			that.edsWrapper.readPrivateKey(
				[data.keyFile],
				data.keyPassword,
				data.userCertificates,
				data.signingFunction,
				data.callbacks
			);
		}
		else {
			console.log('execSigning: 3', that.keyType);
			data.signingFunction();
		}
	},
	signingFunction() {
		let signData = EdsExecutor.instance.viewModel.initialData;
		// TODO: добавить подпись mobile
		this.edsWrapper.exec({
			action: 'signData',
			actionParams: { data: signData }
		});
	},
	callbacks: {
		onSuccess(ret) {
			var that = EdsExecutor.instance;
			if (ret.Success) {
				that.viewModel.postResult(ret.Sign);
			}
			console.log('Signing success:', ret);
		},
		onWarning(e) {
			var that = EdsExecutor.instance;
			let msg = e;//that.checkKeyFile() || e; //TODO
			that.warning = msg;
		},
		onError(e) {
			var that = EdsExecutor.instance;
			let msg = e || 'administration.errors.serverError';
			that.error = msg;
		}
	}
};

// инициализация
EdsExecutor.prototype.initialize = function (model) {
	var that = EdsExecutor.instance;
	function init() {
		if (model.debugMode) console.log('EDS API: try init');
		window.initEdsWrapper({
			siteRoot: window.location.origin + model.siteRoot,
			lang: model.language,
			allowStore: model.allowStore,
			allowStoreLocal: model.allowStoreLocal,
			windowMode: false,
			customUI: true,
			debugMode: model.debugMode,
			// handlers
			/*loadingFunc(show) {
				that.loading = show;
			},*/
			onInit() {
				that.edsWrapper = window.edsWrapper;
				that.providerChanged();
				that.cas = [];
				for (let i = 0; i < that.edsWrapper.CAsServers.length; i += 1) {
					that.cas.push(that.edsWrapper.CAsServers[i].issuerCNs[0]);
				}
				that.userCa = that.edsWrapper.CAServerIndex;
				if (model.debugMode) console.log('EDS API: initialized');
			},
			onProviderChanged: that.providerChanged
			/*
			onAutoDetectCaChanged: this.onAutoDetectCaChanged,
			onWarning: this.callbacks.onWarning,*/
		});
	}

	if (!window.initEdsWrapper) {
		let interval = setInterval(function () {
			if (window.initEdsWrapper) {
				clearInterval(interval);
				init();
			}
			if (model.debugMode) console.log('EDS API: wait library load...');
		}, 500);
	} else {
		init();
	}
};

// смена провайдера
EdsExecutor.prototype.providerChanged = function (e) {
	var that = EdsExecutor.instance;
	if (e) {
		that.warning = e;
	}
	let hardwareKey = !that.edsWrapper.isJsApi();
	if (that.viewModel.debugMode) console.log('EDS API: Provider changed:', hardwareKey ? 'agent' : 'web');
	if (hardwareKey && (!that.devices || !that.devices.length)) {
		try {
			that.readDevices(true);
		}
		catch (e) {
			that.emitFail(e, 'error');
			hardwareKey = false;
		}
	}
	that.keyType = hardwareKey ? 'hard' : 'soft';
	that.wait = false;
},

// запустить процедуру подписи
EdsExecutor.prototype.handleSignClick = function (keyFile, keyPassword) {
	console.log("handleSignClick ", keyFile);
	data.keyFile = keyFile;
	data.keyPassword = keyPassword;
	// TODO Проверка на обязательность заполнения
	data.execSigning();
},

// тип ключа
Object.defineProperty(EdsExecutor.prototype, 'keyType', {
	get: function () {
		return data.keyType;
	},
	set: function (val) {
		console.log("temp3 " + val);
		data.keyType = val;
		this.viewModel.setKeyType(val);
	}
});

// ЦА
Object.defineProperty(EdsExecutor.prototype, 'userCa', {
	get: function () {
		return data.userCa;
	},
	set: function (val) {
		data.userCa = val;
		this.edsWrapper.setCa(val);
		data.needUserCertificates = this.edsWrapper.needUserCertificates();
		this.viewModel.setUserCa(val);
	}
});

Object.defineProperty(EdsExecutor.prototype, 'warning', {
	get: function () {
		return data.warning;
	},
	set: function (val) {
		data.warning = val;
		this.viewModel.setWarning(val);
	}
});

Object.defineProperty(EdsExecutor.prototype, 'error', {
	get: function () {
		return data.error;
	},
	set: function (val) {
		data.error = val;
		this.viewModel.setError(val);
	}
});