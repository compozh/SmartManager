import ChartComponent from "../_classes/chart/graphicChart";

class LineChart extends ChartComponent {
	static schema(...extend) {
		return super.schema({
			type: 'linechart',
			typeChart: 'line',
		}, ...extend);
	}

	static get builderInfo() {
		return {
			title: 'Line Chart',
			group: 'customBasic',
			icon: 'line-chart',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('linechart', LineChart);