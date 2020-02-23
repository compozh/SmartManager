import './edsexecutor';

String.prototype.replaceAll = function (search, replace) {
	return this.split(search).join(replace);
};

// Подключение edsexecutor к интерфейсу
let edsExecutor = new EdsExecutor({
	...window.edsModel,
	/* Обработчики событий модуля ЭЦП */
	setKeyType: keyType => {
		$('select#key-type-select').val(keyType);
	},
	// признак необходимости ввести пользовательский сертификат
	setUserCa: (userCa, needCertificate)=> {
		setVisibility('#file-certificat-label-fieldset', needCertificate);
	},
	// необходимо вручную указать ключ
	setRequestCa: requestCa => {
		setVisibility('#key-ca-fieldset', requestCa);
	},
	setCaList: listCa => {
		var ctrl = $('#key-ca');
		listCa.forEach((item, index) => ctrl.append(`<option value="${index}" >${item}</option>`));
	},
	// предупреждение
	setWarning: warning => {
		setMessage('w', warning);
	},
	// ошибка
	setError: error => {
		setMessage('d', error);
	},
	showSpinner: type => {
		setVisibility('#spinner-' + type, true);
		$('.spinner-disabled').prop("disabled", true);
	},
	hideSpinner: () => {
		setVisibility('#spinner-init', false);
		setVisibility('#spinner-soft', false);
		setVisibility('#spinner-hard', false);
		setVisibility('#spinner-sign', false);
		$('.spinner-disabled').prop("disabled", false);
	},
	setDevices: devices => {
		var ctrl = $('#hardware-key');
		$("#hardware-key option").remove();
		if (devices && devices.length) {
			devices.forEach((device) => ctrl.append(`<option value="${device.typeIndex};${device.deviceIndex}" >${device.title}</option>`));
			setInvalid('#hardware-key', false);
			setInvalid('#hardware-key-fieldset', false);
		} else {
			ctrl.append(`<option value="" >Немає носіїв</option>`);
			setInvalid('#hardware-key', true);
			setInvalid('#hardware-key-fieldset', true);
		}
	},
	postResult: result => {
		$('input#signedData').val(result);
		$('form#wrapper-result').submit();
	}
});

/* Обработчики событий формы */
// изменили тип ключа
$("select#key-type-select").change(function () {
	setVisibility('#soft-key-ui', this.value === 'soft');
	setVisibility('#hard-key-ui', this.value === 'hard');
	edsExecutor.keyType = this.value;
});
// Обновить список железных ключей
$('button#hardware-key-refresh-devices').click(function () {
	edsExecutor.refreshDevices();
});
// указали центр сертификации
$("select#key-ca").change(function () {
	edsExecutor.userCa = this.value;
});
// указали носитель 
$("select#hardware-key").change(function () {
	edsExecutor.hardwareDevice = this.value;
});
// указали файл ключа
$('input#file-private-key').change(function () {
	var filename = $('input#file-private-key').prop('files')[0].name;
	$('#file-private-key-hint').html(filename);
});
// указали сертификат
$('input#file-certificat-key').change(function () {
	var files = $('input#file-certificat-key').prop('files');
	var filename = "";
	for (var i = 0; i < files.length; i++) {
		filename = filename + files[i].name + ',';
	}
	$('#file-certificat-key-hint').html(filename.slice(0, -1));
	edsExecutor.userCertificates = files;
});
// ввод пароля ключа
$('input#password-private-key').change(function () {

});
// Подписать
$('button#exec-digital-signature').click(function () {
	if ($('button#exec-digital-signature').hasClass('disabled')) {
		return;
	}
	setMessage('c');
	var filename = $('input#file-private-key').prop('files')[0];
	var pwd = $('input#password-private-key').val();
	$('button#exec-digital-signature').addClass('disabled');
	edsExecutor.handleSignClick(filename, pwd);
});
// Enter на форме, подписать
$('form#wrapper-digital-signature').submit(function (event) {
	event.preventDefault();
	$('button#exec-digital-signature').click();
});

function setMessage(type, message) {
	let msg = '';
	if (message) {
		msg = message.replaceAll(' style="', ' nothing="');
		$('button#exec-digital-signature').removeClass("disabled");
	}
	$('#danger-message').html(type === 'd' ? msg : '');
	setVisibility('#danger-wrapper', $('#danger-message').html());
	$('#warning-message').html(type === 'w' ? msg : '');
	setVisibility('#warning-wrapper', $('#warning-message').html());
}

function setVisibility(elementname, visible) {
	if (visible) {
		$(elementname).removeClass("d-none");
	} else {
		$(elementname).addClass("d-none");
	}
}

function setInvalid(elementname, invalid) {
	if (invalid) {
		$(elementname).addClass("is-invalid");
	} else {
		$(elementname).removeClass("is-invalid");
	}
}

window.edsModel = undefined;
history.replaceState(null, document.title, window.location.href.split('?')[0]);
