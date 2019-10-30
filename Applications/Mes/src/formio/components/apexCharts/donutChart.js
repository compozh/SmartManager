/* eslint-disable */
import ChartComponent from "../_classes/chart/chart";

class DonutChart extends ChartComponent {
	static schema(...extend) {
		return ChartComponent.schema({
			type: 'donutchart',
			typeChart: 'donut'
		});
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