import TextFieldComponent from 'formiojs/components/textfield/TextField'

var textfieldAttach = TextFieldComponent.prototype.attach;
TextFieldComponent.prototype.attach = function (element) {
	var me = this;
	var superAttach = textfieldAttach.call(me, element);
	if (me.component.qrScaner) {
		var prefixElement = element.querySelector('[ref="prefix"]');
		prefixElement.innerHTML = "";
		var qrScanerEleement = document.createElement('span');
		qrScanerEleement.className = "input-group-text";
		qrScanerEleement.innerHTML = '<i class="fa fa-qrcode" ref="icon"></i>';
		prefixElement.appendChild(qrScanerEleement);
		qrScanerEleement.addEventListener('click', () => {
			me.emit('qrScaner', { callback: value => {
				me.setValue(value);
			} });
		});
	}
	return superAttach;
};

var textfieldInit = TextFieldComponent.prototype.init;
TextFieldComponent.prototype.init = function () {
	var superInit = textfieldInit.call(this);
	if (this.component.qrScaner) {
		this.component.prefix = 'qrScaner';
	}
	return superInit;
};

var baseTextfieldEditForm = TextFieldComponent.editForm;
TextFieldComponent.editForm = function () {
	var textfieldForm = baseTextfieldEditForm();

	for (var formComponent of textfieldForm.components) {
		if (formComponent.key === 'tabs') {
			for (var tabComponent of formComponent.components) {
				if (tabComponent.key === 'display') {
					tabComponent.components.push({
						weight: 1502,
						type: 'checkbox',
						label: 'Visible Qr Scaner',
						key: 'qrScaner',
						input: true
					});
				}
			}
		}
	}

	return textfieldForm;
}
