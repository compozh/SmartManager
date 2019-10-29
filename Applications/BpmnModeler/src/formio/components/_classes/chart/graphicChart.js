import HtmlelementComponent from 'formiojs/components/html/HTML';

export default class GraphicChart extends HtmlelementComponent {
	attach(element) {
		const superAttach = super.attach(element);
		var chartElement = document.createElement('div');
		element.appendChild(chartElement);
		var categories = [],
			series = [];

		for (var flowData of this.component.flowData) {
			var serie = {
				name: flowData.name,
				data: []
			};
			for (var flowSeries of flowData.series) {
				serie.data.push(flowSeries.serie);
			}
			series.push(serie);
		}

		for (var category of this.component.categories) {
			categories.push(category.category);
		}

		var options = {
			chart: {
				width: this.component.chartWidth,
				type: this.component.typeChart
			},
			series,
			dataLabels: {
				enabled: false
			},
			stroke: {
				curve: this.component.curve
			},
			title: {
				text: this.component.chartTitle,
				align: 'left'
			},
			grid: {
				row: {
					colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
					opacity: 0.5,
				},
			},
			xaxis: {
				categories
			}
		};
		var chart = new ApexCharts(chartElement, options);
		chart.render();

		return superAttach;
	}

	static editForm() {
		var chartForm = HtmlelementComponent.editForm(),
			chartTitle = {
				type: 'textfield',
				weight: 5,
				input: true,
				key: 'chartTitle',
				label: 'Chart title',
				defaultValue: ''

			},
			chartWidth = {
				type: 'number',
				weight: 10,
				input: true,
				key: 'chartWidth',
				label: 'Chart width',
				defaultValue: 400
			},
			strokeElement = {
				type: 'select',
				input: true,
				weight: 20,
				key: 'curve',
				defaultValue: 'straight',
				label: 'Type of line',
				dataSrc: 'values',
				data: {
					values: [
						{ label: 'Straight', value: 'straight' },
						{ label: 'Smooth', value: 'smooth' },
						{ label: 'Stepline', value: 'stepline' }
					]
				}
			},
			dataElement = {
				weight: 30,
				input: true,
				label: 'Advanced Logic',
				key: 'flowData',
				templates: {
					header: '<div class="row"> \n  <div class="col-sm-6">\n    <strong>{{ value.length }} Advanced Logic Configured</strong>\n  </div>\n</div>',
					row: '<div class="row"> \n  <div class="col-sm-6">\n    <div>{{ row.name }} </div>\n  </div>\n  <div class="col-sm-2"> \n    <div class="btn-group pull-right"> \n      <div class="btn btn-default editRow">Edit</div> \n      <div class="btn btn-danger removeRow">Delete</div> \n    </div> \n  </div> \n</div>',
					footer: ''
				},
				type: 'editgrid',
				addAnother: 'Add Flow Data',
				saveRow: 'Save Flow Data',
				defaultValue: [],
				components: [
					{
						weight: 40,
						input: true,
						inputType: 'text',
						label: 'Flow Name',
						key: 'name',
						validate: {
							required: true
						},
						type: 'textfield'
					},
					{
						type: 'datagrid',
						input: true,
						label: 'Flow Data',
						key: 'series',
						weight: 50,
						reorder: true,
						components: [
							{
								label: 'Serie',
								key: 'serie',
								input: true,
								type: 'number'
							}
						]
					}
				]
			};

		for (var formComponent of chartForm.components) {
			if (formComponent.key === 'tabs') {
				var dataComponent = {};
				dataComponent.components = [];
				dataComponent.components.push(chartTitle);
				dataComponent.components.push(chartWidth);
				if (this.name != 'BarChart') {
					dataComponent.components.push(strokeElement);
				}
				dataComponent.components.push({
					type: 'datagrid',
					input: true,
					label: 'Flow Categories',
					key: 'categories',
					weight: 10,
					reorder: true,
					components: [
						{
							label: 'Categorie',
							key: 'category',
							input: true,
							type: 'textfield'
						}
					]
				})
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
		var schema = super.schema({
			type: 'graphicChart',
			label: 'chartelement',
			strokeElement: 'straight',
			flowData: [],
			categories: [],
			chartWidth: 300
		}, ...extend);

		return schema;
	}

	static get builderInfo() {
		return {
			
		};
	}
}

Formio.registerComponent('graphicchart', GraphicChart);