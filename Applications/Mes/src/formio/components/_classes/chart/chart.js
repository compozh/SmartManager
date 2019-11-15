import HtmlelementComponent from 'formiojs/components/html/HTML';
import DatamapComponent from 'formiojs/components/datamap/DataMap';

export default class Chart extends HtmlelementComponent {
	attach(element) {
		const superAttach = super.attach(element);
		var chartElement = document.createElement('div');
		element.appendChild(chartElement);
		var chartData = this.component.chartData,
			labels = [],
			series = [],
			colors = [];

		for (var item of chartData) {
			labels.push(item.label);
			series.push(item.serie);
		}
		for (var color of this.component.colorData) {
			colors.push(color.color);
		}
		var options = {
			chart: {
				width: this.component.chartWidth,
				type: this.component.typeChart
			},
			labels: labels,
			series: series,
			responsive: [{
				breakpoint: 480,
				options: {
					chart: {
						width: 200
					}
				}
			}],
			legend: {
				position: this.component.legendPosition
			},
			colors: colors
		};

		var chart = new ApexCharts(chartElement, options);
		chart.render();

		return superAttach;
	}

	static editForm() {
		var chartForm = super.editForm(),
			chartWidth = {
				type: 'number',
				weight: 10,
				input: true,
				key: 'chartWidth',
				label: 'Chart width',
				defaultValue: 300
			},
			dataElement = {
				type: 'datagrid',
				input: true,
				label: 'Chart data',
				key: 'chartData',
				weight: 10,
				reorder: true,
				defaultValue: [{ label: '', serie: 1 }],
				components: [
					{
						label: 'Label',
						key: 'label',
						input: true,
						type: 'textfield',
						placeholder: 'Label'

					},
					{
						label: 'Serie',
						key: 'serie',
						input: true,
						type: 'number',
						defaultValue: 1
					}
				]
			},
			legendPositionElement = {
				type: 'select',
				input: true,
				weight: 0,
				key: 'legendPosition',
				defaultValue: 'top',
				label: 'Legend position',
				dataSrc: 'values',
				data: {
					values: [
						{ label: 'Top', value: 'top' },
						{ label: 'Bottom', value: 'bottom' },
						{ label: 'Left', value: 'left' },
						{ label: 'Right', value: 'right' }
					]
				}
			},
			colorsElement = {
				type: 'datagrid',
				input: true,
				label: 'Colors Data',
				key: 'colorData',
				weight: 50,
				reorder: true,
				defaultValue: [{ color: '#008FFB' }, { color: '#00E396' }, { color: '#FEB019' }, { color: '#FF4560' }, { color: '#775DD0' }],
				components: [{
					label: 'Color',
					key: 'color',
					input: true,
					type: 'textfield'
				}]
			};

		var baseEditForm = DatamapComponent.editForm();
		var dataComponent = null;
		for (var baseFormComponent of baseEditForm.components) {
			if (baseFormComponent.key === 'tabs') {
				for (var baseTabComponent of baseFormComponent.components) {
					if (baseTabComponent.key === 'data') {
						dataComponent = baseTabComponent;
					}
				}
			}
		}

		if (dataComponent) {
			for (var component of dataComponent.components) {
				if (component.key === 'persistent' || component.key === 'protected' || component.key === 'dbIndex' || component.key === 'encrypted') {
					component.hidden = true;
				}
			}
		}

		for (var formComponent of chartForm.components) {
			if (formComponent.key === 'tabs') {
				if (dataComponent) {
					formComponent.components.splice(1, 0, dataComponent);
				}

				var visualizationComponent = {
					key: 'visualization',
					label: 'Visualization',
					weight: 20,
					components: [chartWidth, dataElement, legendPositionElement, colorsElement]
				};

				formComponent.components.push(visualizationComponent);
			}
		}

		return chartForm;
	}
	static schema(...extend) {
		return super.schema({
			type: 'chart',
			label: 'chartelement',
			chartData: [{ label: '', serie: 1 }],
			legendPosition: 'right',
			chartWidth: 300,
			colorData: [{ color: '#008FFB' }, { color: '#00E396' }, { color: '#FEB019' }, { color: '#FF4560' }, { color: '#775DD0' }]
		}, ...extend);
	}

	static get builderInfo() {
		return {
		};
	}
}