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
	spinner: 'init',

	devices: [],
	hardwareDevice: null,

	/* Подпись */
	execSigning (e) {
		var that = EdsExecutor.instance;
		if (that.keyType === 'hard') {
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
			that.edsWrapper.readPrivateKey(
				[data.keyFile],
				data.keyPassword,
				data.userCertificates,
				data.signingFunction,
				data.callbacks
			);
		}
		else {
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
		},
		onWarning(e) {
			var that = EdsExecutor.instance;
			let msg = checkKeyFile() || e;
			that.warning = msg;
		},
		onError(e) {
			var that = EdsExecutor.instance;
			let msg = e || 'administration.errors.serverError';
			that.error = msg;
		}
	}
};

/* публичные интерфейсы */
// инициализация
EdsExecutor.prototype.initialize = function (model) {
	var that = EdsExecutor.instance;
	function init() {
		window.initEdsWrapper({
			siteRoot: window.location.origin + model.siteRoot,
			lang: model.language,
			allowStore: model.allowStore,
			allowStoreLocal: model.allowStoreLocal,
			windowMode: false,
			customUI: true,
			debugMode: model.debugMode,
			// handlers
			loadingFunc(show) {
				if (show) model.showSpinner(data.spinner);
				else model.hideSpinner();
			},
			onInit() {
				that.edsWrapper = window.edsWrapper;
				that.providerChanged();
				let cas = [];
				for (let i = 0; i < that.edsWrapper.CAsServers.length; i += 1) {
					cas.push(that.edsWrapper.CAsServers[i].issuerCNs[0]);
				}
				that.userCa = that.edsWrapper.CAServerIndex;
				EdsExecutor.instance.viewModel.setCaList(cas);
				if (model.debugMode) console.log('EDS API: initialized');
			},
			onAutoDetectCaChanged: value => EdsExecutor.instance.viewModel.setRequestCa(value),
			onProviderChanged: that.providerChanged, //TODO
			onWarning: data.callbacks.onWarning
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
	if (hardwareKey && (!data.devices || !data.devices.length)) {
		try {
			EdsExecutor.instance.viewModel.showSpinner('hard');
			readDevices(true);
			that.viewModel.setDevices(data.devices);
			EdsExecutor.instance.viewModel.hideSpinner();
		}
		catch (e) {
			that.error = e;
			hardwareKey = false;
		}
		EdsExecutor.instance.viewModel.hideSpinner();
	}
	// не сбрасывать предупреждения, потому не через 
	data.keyType = hardwareKey ? 'hard' : 'soft';
	that.viewModel.setKeyType(data.keyType);
};

	// обновить девайсы
EdsExecutor.prototype.refreshDevices = function () {
	var that = EdsExecutor.instance;
	try {
		EdsExecutor.instance.viewModel.showSpinner('hard');
		setTimeout(function () {
			self.readDevices(true, true);
			self.wait = false;
		}, 50);
		that.viewModel.setDevices(data.devices);
		EdsExecutor.instance.viewModel.hideSpinner();
	}
	catch (e) {
		that.error = e;
		hardwareKey = false;
	}
};

// запустить процедуру подписи
EdsExecutor.prototype.handleSignClick = function (keyFile, keyPassword) {
	data.keyFile = keyFile;
	data.keyPassword = keyPassword;
	// TODO Проверка на обязательность заполнения
	data.spinner = 'sign';
	data.execSigning();
};

/* публичные свойства */
// тип ключа
Object.defineProperty(EdsExecutor.prototype, 'keyType', {
	get: function () {
		return data.keyType;
	},
	set: function (val) {
		if (data.keyType !== val) {
			data.keyType = val;
			this.warning = null;
			data.spinner = val;
			let provider = val === 'hard' ? "agent" : "web";
			try {
				this.edsWrapper.changeProvider(provider);
			}
			catch (e) {
				this.error = e;
			}
			this.viewModel.setKeyType(val);
		}
	}
});

// текущий железный
Object.defineProperty(EdsExecutor.prototype, 'hardwareDevice', {
	get: function () {
		return data.hardwareDevice;
	},
	set: function (val) {
		data.hardwareDevice = val;
		//data.needUserCertificates = this.edsWrapper.needUserCertificates();
	}
});
// текущий ЦА
Object.defineProperty(EdsExecutor.prototype, 'userCa', {
	get: function () {
		return data.userCa;
	},
	set: function (val) {
		var oldValue = data.userCa;
		data.userCa = val;
		this.edsWrapper.setCa(val);
		data.needUserCertificates = this.edsWrapper.needUserCertificates();
		if (oldValue !== val) {
			this.viewModel.setUserCa(val, data.needUserCertificates);
		}
	}
});

Object.defineProperty(EdsExecutor.prototype, 'userCertificates', {
	get: function () {
		return data.userCertificates;
	},
	set: function (val) {
		data.userCertificates = val;
	}
});

Object.defineProperty(EdsExecutor.prototype, 'warning', {
	get: function () {
		return data.warning;
	},
	set: function (val) {
		data.warning = val;
		this.viewModel.setWarning(val);
		data.spinner = data.keyType;
		EdsExecutor.instance.viewModel.hideSpinner();
	}
});

Object.defineProperty(EdsExecutor.prototype, 'error', {
	get: function () {
		return data.error;
	},
	set: function (val) {
		data.error = val;
		this.viewModel.setError(val);
		data.spinner = data.keyType;
		EdsExecutor.instance.viewModel.hideSpinner();
	}
});

/* вспомогательные функции */
const checkKeyFile = function () {
	if (data.keyFile) {
		let fileName = data.keyFile.name;
		if (fileName) {
			if (fileName.trim().toLowerCase() === "key-11.dat") {
				var lang = EdsExecutor.instance.viewModel.language.substring(0, 2);
				return lang === "uk" ? "Файл Key-11.dat не є файлом приватного ключа, вкажіть файл Кey-6.dat" :
					lang === "ru" ? "Файл Key-11.dat не является файлом приватного ключа, укажите файл Кey-6.dat" :
						"File 'Key-11.dat' is not private key file, specify file 'Key-6.dat'";
			}
		}
	}
	return null;
};

const readDevices = function (readAll, refresh) {
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

	var that = EdsExecutor.instance;
	let deviceTypes = readAll ? types : types.filter(i => i.popular);
	if ((!that.edsWrapper.devices && !that.edsWrapper.devicesLoaded) || refresh) {
		let list = that.edsWrapper.getDevicesByTypes(deviceTypes, !readAll);
		that.edsWrapper.devices = list;
		that.edsWrapper.devicesLoaded = true;
	}

	data.devices = this.edsWrapper.devices;
	if (data.devices && data.devices.length) {
	}
};
