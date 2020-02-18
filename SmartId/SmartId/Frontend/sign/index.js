import './edsexecutor';

let edsExecutor = new EdsExecutor({
	...window.edsModel,
	/* Обработчики событий модуля ЭЦП */
	setKeyType: keyType => {
		$("select#key-type-select-digital-signature").val(keyType);
	},
	setUserCa: userCa => {
		console.log("ui: User CA set", userCa, edsExecutor.needUserCertificates);
	},
	// предупреждение
	setWarning: warning => {
		setMessage('w', warning);
	},
	// ошибка
	setError: error => {
		setMessage('d', error);
	},
	postResult: result => {
		$('input#signedData').val(result);
		$('form#wrapper-result').submit();
	}
});

/* Обработчики событий формы */
$("select#key-type-select-digital-signature").change(function () {
	edsExecutor.keyType = this.value;
});
$('input#key-file-digital-signature').change(function () {
	var filename = $('input#key-file-digital-signature').prop('files')[0].name;
	$('label#key-file-digital-signature-label').html(filename);
});
$('input#key-password-digital-signature').change(function () {

});
// Подписать
$("button#exec-digital-signature").click(function () {
	if ($('button#exec-digital-signature').hasClass("disabled")) {
		return;
	}
	setMessage('c');
	var filename = $('input#key-file-digital-signature').prop('files')[0];
	var pwd = $('input#key-password-digital-signature').val();
	$('button#exec-digital-signature').addClass("disabled");
	edsExecutor.handleSignClick(filename, pwd);
});
// Enter на форме, подписать
$("form#wrapper-digital-signature").submit(function (event) {
	event.preventDefault();
	$("button#exec-digital-signature").click();
});

window.edsModel = undefined;
history.replaceState(null, document.title, window.location.href.split('?')[0]);

function setMessage(type, message) {
	$('button#exec-digital-signature').removeClass("disabled");
	$('#danger-message').html(type === 'd' ? message : '');
	if ($('#danger-message').html()) {
		$('#danger-wrapper').removeClass("d-none");
	} else {
		$('#danger-wrapper').addClass("d-none");
	}
	$('#warning-message').html(type === 'w' ? message : '');
	if ($('#warning-message').html()) {
		$('#warning-wrapper').removeClass("d-none");
	} else {
		$('#warning-wrapper').addClass("d-none");
	}
}
