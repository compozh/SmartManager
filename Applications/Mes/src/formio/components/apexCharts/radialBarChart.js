import PercentageChart from "../_classes/chart/percentageChart";

class RadialBarChart extends PercentageChart {
	static schema(...extend) {
		return super.schema({
			type: 'radialbarchart',
			typeChart: 'radialBar'
		}, ...extend);
	}

	static get builderInfo() {
		return {
			title: 'Radial Bar Chart',
			group: 'customBasic',
			icon: 'percent',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('radialbarchart', RadialBarChart);