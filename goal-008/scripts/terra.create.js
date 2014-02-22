// consider changing name, adding ability to pause, reset, etc.

terra.create = function ( selector, map ) {

  // Imports...
  Terrarium = terra.util.Terrarium;

  if ( typeof selector !== 'string' ) {
    throw new Error( 'You need to pass an element selector (string) as the first argument of terra.create (received "' + selector + '")');
  }

  map = map || terra.maps.mSmall( [ '*', 'C', ' ', '#' ] );

  var startTick = function ( fn ) {
    var tick = function () {
      fn();
      requestAnimationFrame( tick );
    };

    requestAnimationFrame( tick );
  };

  var level = new Terrarium( map, selector );

  startTick( function () {
    level.step();
    level.toDom();
  });

};
