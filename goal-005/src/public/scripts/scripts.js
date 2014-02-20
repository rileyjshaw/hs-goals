;(function (exports) {
  var Game = function(canvasId) {
    this.WIDTH = 400;
    this.HEIGHT = 400;
    this.domNodes = {
      "scores": document.getElementById('scores'),
      "score1": this.scores.getElementById('score1'),
      "score2": this.scores.getElementById('score2'),
      "canvas": createHiDPICanvas(this.WIDTH, this.HEIGHT, "canvas");
    };
    document.body.insertBefore(this.domNodes.canvas, this.domNodes.scores);

    this.context = canvas.getContext('2d');

    this.line_width = 8;
    this.player_radius = 40;
    this.turn = 0;
    this.moves = [];

    this.context.lineWidth = line_width;
    this.context.strokeStyle = '#2c3e50';

var clearCanvas = function _clearCanvas () {
  ctx.clearRect(0, 0, width, height);
};

var paintBoard = function _paintBoard () {
  clearCanvas();

  ctx.beginPath();

  for(var i = 0; i <= 3; i++) {
    ctx.moveTo((width / 3) * i, 0);
    ctx.lineTo((width / 3) * i, height);

    ctx.moveTo(0, (height / 3) * i);
    ctx.lineTo(width, (height / 3) * i);
  }

  ctx.stroke();
  ctx.closePath();
};

var paintWaiting = function _paintWaiting (message) {
  clearCanvas();
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#9b59b6';
  ctx.font = "18px sans-serif";
  ctx.fillText(message, 5, 20);
};

paintBoard();

var drawX = function _drawX ( x, y ) {
  ctx.moveTo(x - player_radius, y - player_radius);
  ctx.lineTo(x + player_radius, y + player_radius);
  ctx.moveTo(x - player_radius, y + player_radius);
  ctx.lineTo(x + player_radius, y - player_radius);
};

var drawO = function _drawO ( x, y ) {
  ctx.beginPath();
  ctx.arc(x, y, player_radius, 0, 2 * Math.PI);
  ctx.stroke();
};

var clickHandler = function _clickHandler ( event ) {
  var coords = board.relMouseCoords(event);
  var x = Math.floor(coords.x * 3 / width);
  var y = Math.floor(coords.y * 3 / height);
  var idx = x + y * 3;

  if( typeof( moves[idx] ) === 'undefined' ) {
    var x_px = width * (2 * x + 1) / 6;
    var y_px = height * (2 * y + 1) / 6;

    if( turn % 2 ) {
      moves[idx] = 0;
      drawO(x_px, y_px);
    } else {
      moves[idx] = 1;
      drawX(x_px, y_px);
    }

    ctx.stroke();

    if (++turn === 9) {
      turn = 0;
      moves = [];

      paintBoard();
    }

  }
};

board.addEventListener( 'click', clickHandler );
/*
  window.onload = function () {
    new Game(createHiDPICanvas(width, height, "board"));
  };
})(this);
*/