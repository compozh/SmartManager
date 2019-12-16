import ChartComponent from "../_classes/chart/chart";

class PieChart extends ChartComponent {
	static schema(...extend) {
		return super.schema({
			type: 'piechart',
			typeChart: 'pie',
		}, ...extend);
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
