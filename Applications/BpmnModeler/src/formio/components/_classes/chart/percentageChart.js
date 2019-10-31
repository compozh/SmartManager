import HtmlelementComponent from 'formiojs/components/html/HTML';

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
			colors.push(color.color)
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

		for (var formComponent of chartForm.components) {
			if (formComponent.key === 'tabs') {
				var dataComponent = {};
				dataComponent.components = [];
				dataComponent.components.push(chartHeight);
				dataComponent.components.push(colorsElement);
				dataComponent.components.push(dataElement);
				dataComponent.key = 'data';
				dataComponent.label = 'Data';
				dataComponent.weight = 20;
				formComponent.components.push(dataComponent);

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
