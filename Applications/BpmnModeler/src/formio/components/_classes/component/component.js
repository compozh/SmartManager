import BaseComponent from 'formiojs/components/_classes/component/Component';
import Components from "formiojs/components/Components";

var baseSchema = BaseComponent.schema;
BaseComponent.schema = function (...sources) {
	var schema = baseSchema.call(this, ...sources);
	return Object.assign(schema, { customStyles: {}, outline: false });
};

var baseAttach = BaseComponent.prototype.attach;
BaseComponent.prototype.attach = function (element) {
	var attach = baseAttach.call(this, element);
	_.each(this.component.customStyles, (value, key) => {
		if (value !== '') {
			element.style[key] = value;
		}
	});

	var componentElement = element.getAttribute('ref') === "component" ? element : element.querySelector('[ref="component"]');
	if (componentElement) {
		if (this.component.outline) {
			componentElement.classList.add("outline");
		} else {
			componentElement.classList.remove("outline");
		}
	}

	return attach;
};

var customStylesElement = {
	label: 'Custom Styles',
	type: 'datamap',
	input: true,
	key: 'customStyles',
	keyLabel: 'Style Name',
	valueComponent: {
		type: 'textfield',
		key: 'value',
		label: 'Style Value',
		input: true
	},
	addAnother: 'Add Style'
};

var components = Components.prototype.constructor.components;
Object.keys(components).forEach(componentKey => {
	var component = components[componentKey];
	var baseEditForm = component.editForm;
	component.editForm = function () {
		var editForm = baseEditForm.call(this);

		for (var formComponent of editForm.components) {
			if (formComponent.key === 'tabs') {
				for (var tabComponent of formComponent.components) {
					if (tabComponent.key === 'display') {
						tabComponent.components.push({
							weight: 1501,
							type: 'checkbox',
							label: 'Outline',
							key: 'outline',
							input: true
						});
					}
					if (tabComponent.key === 'layout') {
						tabComponent.components.push(customStylesElement);
						return editForm;
					}
				}
			}
		}

		return editForm;
	};
});