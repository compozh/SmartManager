import HtmlelementComponent from '../../../../../../node_modules/formiojs/components/html/HTML';
//todo: переписать на es6
function PieChart(component, options, data) {
	HtmlelementComponent.prototype.constructor.call(this, component, options, data);
}

PieChart.prototype = Object.create(HtmlelementComponent.prototype);
PieChart.prototype.constructor = PieChart;

PieChart.prototype.redraw = () => { return true; };
PieChart.schema = function () {
	return HtmlelementComponent.schema({
		type: 'piechart',
		label: 'chartelement',
		content: '<div id="piechart"/>',
		attrs: [
			{
				attr: "labels",
				value: "[]"
			},
			{
				attr: "series",
				value: "[]"
			}
		],
		logic: [
			{
				name: "Chart logic",
				trigger: {
					type: "javascript",
					javascript: "var labels = [],\n  series = [];\nif(component.attrs) {\n  component.attrs.forEach(attribute => {\n    switch(attribute.attr) {\n      case 'labels':\n        labels = JSON.parse(attribute.value);\n        break;\n      case 'series':\n        series = JSON.parse(attribute.value);\n        break;\n    }\n  });\n}\nvar options = {\n            chart: {\n                width: 380,\n                type: 'pie',\n            },\n            labels: labels,\n            series: series,\n            responsive: [{\n                breakpoint: 480,\n                options: {\n                    chart: {\n                        width: 200\n                    },\n                    legend: {\n                        position: 'bottom'\n                    }\n                }\n            }]\n        }\n        \n        var chart = new ApexCharts(\n            document.querySelector(\"#piechart\"),\n            options\n        );\n        \n        chart.render();"
				},
				actions: []
			}
		]
	});
};

PieChart.builderInfo = {
	title: 'Pie Chart',
	group: 'basic',
	icon: 'pie-chart',
	weight: 70,
	schema: PieChart.schema()
};

PieChart.editForm = HtmlelementComponent.editForm;
Formio.registerComponent('piechart', PieChart);