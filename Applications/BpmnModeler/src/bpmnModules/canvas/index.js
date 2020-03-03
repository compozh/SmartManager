import DrawModule from 'diagram-js/lib/draw';

import Canvas from './Canvas';

export default {
  depends: [ DrawModule ],
  init: [ 'canvas' ],
  canvas: [ 'type', Canvas ],
};
