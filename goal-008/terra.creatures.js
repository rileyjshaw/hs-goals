;( function ( exports ) {

  // Imports...
  randomElement = terra.util.randomElement;
  registerCreatureType = terra.util.registerCreatureType;
  findDirections = terra.util.findDirections;
  directions = terra.util.directions;

  function Wall () {}
  registerCreatureType( Wall, '#' );

  function Lichen () {
    this.energy = 5;
  }
  Lichen.prototype.act = function ( surroundings ) {
    var emptySpace = findDirections( surroundings, ' ' );
    if ( this.energy >= 13 && emptySpace.length > 0 ) {
      return {
        type: 'reproduce',
        direction: randomElement( emptySpace )
      };
    } else if ( this.energy < 20 ) {
      return {
        type: 'photosynthesize'
      };
    } else {
      return {
        type: 'wait'
      };
    }
  };
  registerCreatureType( Lichen, '*' );

  function LineBug () {
    this.energy = 10;
    this.direction = 'ne';
  }
  LineBug.prototype.act = function ( surroundings ) {
    var emptySpace = findDirections( surroundings, ' ' );
    var lichen = findDirections( surroundings, '*' );
    if ( this.energy >= 30 && emptySpace.length > 0 ) {
      return {
        type: 'reproduce',
        direction: randomElement( emptySpace )
      };
    } else if ( lichen.length > 1 ) {
      return {
        type: 'eat',
        direction: randomElement( lichen )
      };
    } else if ( emptySpace.length > 1 ) {
      return {
        type: 'move',
        direction: this.direction
      };
    } else {
      return {
        type: 'wait'
      };
    }
  };
  registerCreatureType( LineBug, 'c' );

  function StupidBug () {
    this.energy = 10;
  }
  StupidBug.prototype.act = function ( surroundings ) {
    var emptySpace = findDirections( surroundings, ' ' );
    var lichen = findDirections( surroundings, '*' );
    if ( this.energy >= 30 && emptySpace.length > 0 ) {
      return {
        type: 'reproduce',
        direction: randomElement( emptySpace )
      };
    } else if ( lichen.length > 1 ) {
      return {
        type: 'eat',
        direction: randomElement( lichen )
      };
    } else if ( emptySpace.length > 0 ) {
      return {
        type: 'move',
        direction: randomElement( directions.names() )
      };
    } else {
      return {
        type: 'wait'
      };
    }
  };
  registerCreatureType( StupidBug, 'C' );

})( terra.creatures = terra.creatures || {} );