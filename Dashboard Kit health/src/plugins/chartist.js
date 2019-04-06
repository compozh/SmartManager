import Vue from 'vue'
import 'chartist/dist/chartist.min.css'

Vue.use(require('vue-chartist'));
(function(window, document, Chartist) {
    'use strict';
  
    var defaultOptions = {
      class: 'ct-target-line',
      value: null
    };
  
    Chartist.plugins = Chartist.plugins || {};
    Chartist.plugins.ctTargetLine = function(options) {
  
      options = Chartist.extend({}, defaultOptions, options);
  
      return function ctTargetLine(chart) {
          function projectY(chartRect, bounds, value) {
                      return chartRect.y1 - (chartRect.height() / bounds.max * value)
                  }
  
          chart.on('created', function (context) {
            var targetLineY = projectY(context.chartRect, context.bounds, options.value);
  
            context.svg.elem('line', {
              x1: context.chartRect.x1,
              x2: context.chartRect.x2,
              y1: targetLineY,
              y2: targetLineY
            }, options.class);
          });
      };
    };
  }(window, document, require('chartist')));
