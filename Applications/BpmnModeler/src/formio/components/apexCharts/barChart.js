import ChartComponent from "../_classes/chart/graphicChart";

class BarChart extends ChartComponent {
	static schema(...extend) {
		return super.schema({
			type: 'barchart',
			typeChart: 'bar',
		}, ...extend);
	}

	static get builderInfo() {
		return {
			title: 'Bar Chart',
			group: 'customBasic',
			icon: 'bar-chart',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('barchart', BarChart);