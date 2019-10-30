import GraphicChart from "../_classes/chart/graphicChart";

class AreaChart extends GraphicChart {
	static schema(...extend) {
		return super.schema({
			type: 'areachart',
			typeChart: 'area'
		}, ...extend);
	}

	static get builderInfo() {
		return {
			title: 'Area Chart',
			group: 'customBasic',
			icon: 'area-chart',
			weight: 70,
			schema: this.schema()
		};
	}
}

Formio.registerComponent('areachart', AreaChart);