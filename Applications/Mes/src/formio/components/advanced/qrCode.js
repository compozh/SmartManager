import TextFieldComponent from 'formiojs/components/textfield/TextField';

/* eslint-disable */
class QrCode extends TextFieldComponent {
	attach(element) {
        var me = this,
            superAttach = super.attach(element);

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
        return superAttach;
    }

    static get builderInfo() {
		return {
			title: 'QR Code Input',
			group: 'advanced',
			icon: 'qrcode',
			weight: 1000,
			schema: QrCode.schema()
		}
	}

    static schema(...extend) {
		return TextFieldComponent.schema({
            label: 'QR Code Input',
            key: 'qrcode',
            type: 'qrcode',
            prefix: 'qr',
            mask: false,
            inputType: 'text',
            inputFormat: 'plain',
            inputMask: '',
            tableView: true,
            validate: {
                minLength: '',
                maxLength: '',
                pattern: ''
            }
		});
    }
    
    static editForm() {
        var qrCodeForm = TextFieldComponent.editForm();

        for(var formComponent of qrCodeForm.components) {
            if (formComponent.key === 'tabs') {
                for(var tabComponent of formComponent.components)  {
					if (tabComponent.key === 'display') {
                        for(var dataComponent of tabComponent.components) {
                            if(dataComponent.key === 'prefix') {
                                dataComponent.hidden = true;
                            }
                        }
                    }
                }
            }
        }

        return qrCodeForm;
    }
}

Formio.registerComponent('qrcode', QrCode);