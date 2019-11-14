import HtmlelementComponent from 'formiojs/components/html/HTML';
import DatamapComponent from 'formiojs/components/datamap/DataMap';

export default class PercentageChart extends HtmlelementComponent {
	attach(element) {
		const superAttach = super.attach(element);
		var percentageChartElement = document.createElement('div');
		element.appendChild(percentageChartElement);
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
				height: this.component.chartHeight,
				type: this.component.typeChart
			},
			plotOptions: {
				radialBar: {
					hollow: {
						size: '70%'
					}
				}
			},
			series: series,
			labels: labels,
			colors: colors
		};

		var chart = new ApexCharts(percentageChartElement, options);
		chart.render();

		return superAttach;
	}

	static editForm() {
		var chartForm = super.editForm(),
			chartHeight = {
				type: 'number',
				weight: 10,
				input: true,
				key: 'chartHeight',
				label: 'Chart height',
				defaultValue: 350
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
			},
			dataElement = {
				type: 'datagrid',
				input: true,
				label: 'Chart data',
				key: 'chartData',
				weight: 10,
				reorder: true,
				defaultValue: [{ label: '', serie: 50 }],
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
						defaultValue: 50
					}
				]
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
					components: [chartHeight, colorsElement, dataElement]
				};

				formComponent.components.push(visualizationComponent);

			}
		}

		return chartForm;
	}
	static schema(...extend) {
		return super.schema({
			type: 'percentageChart',
			label: 'chartelement',
			chartData: [{ label: '', serie: 50 }],
			chartHeight: 350,
			colorData: [{ color: '#008FFB' }, { color: '#00E396' }, { color: '#FEB019' }, { color: '#FF4560' }, { color: '#775DD0' }]
		}, ...extend);
	}

	static get builderInfo() {
		return {
		};
	}
}