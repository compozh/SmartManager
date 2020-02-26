import Canvas from 'diagram-js/lib/core/Canvas';
import { transform as svgTransform } from 'tiny-svg';
import { createMatrix as createMatrix } from 'tiny-svg';

function round(number, resolution) {
  return Math.round(number * resolution) / resolution;
}

Canvas.prototype.viewbox = function(box) {

  if (box === undefined && this._cachedViewbox) {
    return this._cachedViewbox;
  }

  var viewport = this._viewport,
    innerBox,
    outerBox = this.getSize(),
    matrix,
    transform,
    scale,
    x, y;

  if (!box) {

    // compute the inner box based on the
    // diagrams default layer. This allows us to exclude
    // external components, such as overlays
    innerBox = this.getDefaultLayer().getBBox();

    transform = svgTransform(viewport);
    matrix = transform ? transform.matrix : createMatrix();
    scale = round(matrix.a, 1000);

    x = round(-matrix.e || 0, 1000);
    y = round(-matrix.f || 0, 1000);

    box = this._cachedViewbox = {
      x: x ? x / scale : 0,
      y: y ? y / scale : 0,
      width: outerBox.width / scale,
      height: outerBox.height / scale,
      scale: scale,
      inner: {
        width: innerBox.width,
        height: innerBox.height,
        x: innerBox.x,
        y: innerBox.y
      },
      outer: outerBox
    };

    return box;
  } else {

    this._changeViewbox(function() {
      scale = Math.min(outerBox.width / box.width, outerBox.height / box.height);

      var matrix = this._svg.createSVGMatrix()
        .scale(box.scale || scale)
        .translate(-box.x, -box.y);

      svgTransform(viewport, matrix);
    });
  }

  return box;
};
