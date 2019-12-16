/* eslint-disable */
import ChartComponent from "../_classes/chart/chart";

class DonutChart extends ChartComponent {
	static schema(...extend) {
		return super.schema({
			type: 'donutchart',
			typeChart: 'donut'
		}, ...extend);
	}

	static get builderInfo() {
		return {
			title: 'Donut Chart',
			group: 'customBasic',
			icon: 'circle-o-notch',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('donutchart', DonutChart);