import HtmlelementComponent from 'formiojs/components/html/HTML';

export default class PercentageChart extends HtmlelementComponent {
	attach(element) {
		const superAttach = super.attach(element);
		var percentageChartElement = document.createElement('div');
		element.appendChild(percentageChartElement);
		var chartData = this.component.chartData,
			labels = [],
			series = [];

		for (var item of chartData) {
			labels.push(item.label);
			series.push(item.serie);
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
			labels: labels
		};

		var chart = new ApexCharts(percentageChartElement, options);
		chart.render();

		return superAttach;
	}

	static editForm() {
		var chartForm = HtmlelementComponent.editForm(),
			chartHeight = {
				type: 'number',
				weight: 10,
				input: true,
				key: 'chartHeight',
				label: 'Chart height',
				defaultValue: 350
				//tooltip: 'The name of the indexeddb database.',
			},
			dataElement = {
				type: 'datagrid',
				input: true,
				label: 'Chart data',
				key: 'chartData',
				//tooltip: 'Values to use as the data source. Labels are shown in the select field. Values are the corresponding values saved with the submission.',
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
			chartHeight: 350
		}, ...extend);
	}

	static get builderInfo() {
		return {
		};
	}
}

Formio.registerComponent('percentagechart', PercentageChart);