import TextFieldComponent from 'formiojs/components/textfield/TextField'

var textfieldAttach = TextFieldComponent.prototype.attach;
TextFieldComponent.prototype.attach = function (element) {
	var me = this;
	var superAttach = textfieldAttach.call(this, element);
	if (this.component.qrScaner) {
		var prefixElement = element.querySelector('[ref="prefix"]');
		prefixElement.innerHTML = "";
		var qrScanerEleement = document.createElement('span');
		qrScanerEleement.className = "input-group-text";
		qrScanerEleement.innerHTML = '<i class="fa fa-qrcode" ref="icon"></i>';
		prefixElement.appendChild(qrScanerEleement);
		qrScanerEleement.addEventListener('click', () => {
			window.qrScaner(value => {
				me.setValue(value);
			});
		});
	}
	return superAttach;
};

var textfieldInit = TextFieldComponent.prototype.init;
TextFieldComponent.prototype.init = function () {
	if (this.component.qrScaner) {
		this.widget.addPrefix('qrScaner');
		this.component.prefix = 'qrScaner';
	}
	return textfieldInit.call(this);
};

var baseTextfieldEditForm = TextFieldComponent.editForm;
TextFieldComponent.editForm = function () {
	var textfieldForm = baseTextfieldEditForm();

	for (var formComponent of textfieldForm.components) {
		if (formComponent.key === 'tabs') {
			for (var tabComponent of formComponent.components) {
				if (tabComponent.key === 'display') {
					for (var dataComponent of tabComponent.components) {
						if (dataComponent.key === 'prefix') {
							dataComponent.hidden = true;
						}
					}

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
