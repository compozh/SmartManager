/* eslint-disable */
import HtmlelementComponent from 'formiojs/components/html/HTML';

/* eslint-disable */
class PieChart extends HtmlelementComponent {
    attach(element) {
        const superAttach = super.attach(element);
        var chartElement = document.createElement('div');
        chartElement.id = 'piechart';
        element.appendChild(chartElement);
        var pieData = this.component.pieData,
            labels = [],
            series = [];

        for (var item of pieData) {
            labels.push(item.label);
            series.push(item.serie);
        }
		var options = {
			chart: {
				width: this.component.chartWidth,
				type: 'pie'
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
        var pieChartForm = HtmlelementComponent.editForm(),
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
                key: 'pieData',
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
                        { label: 'top', value: 'top' },
                        { label: 'bottom', value: 'bottom' },
                        { label: 'left', value: 'left' },
                        { label: 'right', value: 'right' }
                    ]
                }
            };

        for (var formComponent of pieChartForm.components) {
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

        return pieChartForm;
    }
	static schema(...extend) {
		return super.schema({
			type: 'piechart',
            label: 'chartelement',
            pieData: [{ label: '', serie: 1 }],
            legendPosition: 'top',
            chartWidth: 300
		});
	}
     
	static get builderInfo() {
		return {
			title: 'Pie Chart',
			group: 'customBasic',
			icon: 'pie-chart',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('piechart', PieChart)