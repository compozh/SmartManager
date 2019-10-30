import HtmlelementComponent from 'formiojs/components/html/HTML';

export default class Chart extends HtmlelementComponent {
	attach(element) {
		const superAttach = super.attach(element);
		var chartElement = document.createElement('div');
		element.appendChild(chartElement);
		var chartData = this.component.chartData,
			labels = [],
			series = [];

		for (var item of chartData) {
			labels.push(item.label);
			series.push(item.serie);
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
					},
					legend: {
						position: this.component.legendPosition
					}
				}
			}]
		};
		var chart = new ApexCharts(chartElement, options);
		chart.render();

		return superAttach;
	}

	static editForm() {
		var chartForm = HtmlelementComponent.editForm(),
			chartWidth = {
				type: 'number',
				weight: 10,
				input: true,
				key: 'chartWidth',
				label: 'Chart width',
				defaultValue: 300
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
				//tooltip: 'The source to use for the select data. Values lets you provide your own values and labels.',
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
			};

		for (var formComponent of chartForm.components) {
			if (formComponent.key === 'tabs') {
				var dataComponent = {};
				dataComponent.components = [];
				dataComponent.components.push(chartWidth);
				dataComponent.components.push(dataElement);
				dataComponent.components.push(legendPositionElement);
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
			type: 'chart',
			label: 'chartelement',
			chartData: [{ label: '', serie: 1 }],
			legendPosition: 'top',
			chartWidth: 300
		}, ...extend);
	}
}
