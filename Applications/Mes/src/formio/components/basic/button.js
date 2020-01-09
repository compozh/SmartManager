import ButtonComponent from 'formiojs/components/button/Button'

var baseButtonEditForm = ButtonComponent.editForm;
ButtonComponent.editForm = function () {
	var buttonForm = baseButtonEditForm();
	
	for (var formComponent of buttonForm.components) {
		if (formComponent.key === 'tabs') {
			for (var tabComponent of formComponent.components) {
				if (tabComponent.key === 'display') {
					
					tabComponent.components.splice(5, 0, {
						weight: 1503,
						type: 'checkbox',
						label: 'Display loading',
						key: 'displayLoading',
						input: true
					});
				}
			}
		}
	}

	return buttonForm;
}