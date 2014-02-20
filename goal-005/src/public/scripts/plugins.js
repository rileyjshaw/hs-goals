var createHiDPICanvas = (function (_w, _h, id, _ratio) {
  var _pixel_ratio = (function () {
    var _ctx = document.createElement("canvas").getContext("2d"),
        _dpr = window.devicePixelRatio || 1,
        _bsr = _ctx.webkitBackingStorePixelRatio ||
               _ctx.mozBackingStorePixelRatio ||
               _ctx.msBackingStorePixelRatio ||
               _ctx.oBackingStorePixelRatio ||
               _ctx.backingStorePixelRatio || 1;
    return _dpr / _bsr;
  })();

  if (!_ratio) {
    _ratio = _pixel_ratio;
  }
  var canvas = document.createElement("canvas");
  canvas.width = _w * _ratio;
  canvas.height = _h * _ratio;
  canvas.style.width = _w + "px";
  canvas.style.height = _h + "px";
  canvas.getContext("2d").setTransform(_ratio, 0, 0, _ratio, 0, 0);
  canvas.id = id;
  return canvas;
});

var relMouseCoords = function (event) {
  var total_offset_x = 0;
  var total_offset_y = 0;
  var canvas_x = 0;
  var canvas_y = 0;
  var current_element = this;

  do {
    total_offset_x += current_element.offsetLeft - current_element.scrollLeft;
    total_offset_y += current_element.offsetTop - current_element.scrollTop;
    current_element = current_element.offsetParent;
  } while (current_element);

  canvas_x = event.pageX - total_offset_x;
  canvas_y = event.pageY - total_offset_y;

  return {
    x: canvas_x,
    y: canvas_y
  };
};
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
