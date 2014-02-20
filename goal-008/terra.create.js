// consider changing name, adding ability to pause, reset, etc.

terra.create = function ( selector, map, fps ) {

  // Imports...
  Terrarium = terra.util.Terrarium;

  if ( typeof selector !== 'string' ) {
    throw new Error( 'You need to pass an element selector (string) as the first argument of terra.create (received "' + selector + '")');
  }

  map = map || terra.maps.mSmall( [ '*', 'C', ' ', '#' ] );
  fps = fps || 60;

  /*    startTick: function(fn) {
        var tick = function() {
          fn();
          requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
  */

  var period = 1000 / fps;
  var domElement = document.querySelector( selector );
  var level = new Terrarium( map );

  var loop = setInterval( function() {
    domElement.innerHTML = level.toString();
    level.step();
  }, period );

};
