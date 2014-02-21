;( function ( exports ) {

  // Imports...
  randomElement = terra.util.randomElement;
  registerCreatureType = terra.util.registerCreatureType;
  findDirections = terra.util.findDirections;
  directions = terra.util.directions;
  forEach = terra.util.forEach;

  function Wall () {
    this.currentColor = [];
  }
  Wall.prototype.color = [ 0, 0, 0 ];
  registerCreatureType( Wall, '#' );

  function Lichen () {
    this.energy = 5;
    this.currentColor = [];
  }
  Lichen.prototype.color = [ 0, 255, 0 ];
  Lichen.prototype.act = function ( surroundings ) {
    var emptySpace = findDirections( surroundings, ' ' );
    if ( this.energy >= 13 && emptySpace.length > 0 ) {
      return {
        type: 'reproduce',
        direction: randomElement( emptySpace )
      };
    } else {
      return {
        type: 'photosynthesize'
      };
    }
  };
  registerCreatureType( Lichen, '*' );

  function LineBug () {
    this.energy = 10;
    this.direction = 'ne';
    this.currentColor = [];
  }
  LineBug.prototype.color = [ 0, 0, 255 ];
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
  registerCreatureType( LineBug, '/' );

  function StupidBug () {
    this.energy = 10;
    this.currentColor = [];
  }
  StupidBug.prototype.color = [ 255, 0, 0 ];
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

  // Example of a bug that doesn't depend on standard actions
  function GameOfLifeBug () {
    this.energy = Math.random() < .5 ? 0 : 1;
    this.currentColor = [];
  }
  GameOfLifeBug.prototype.color = [ 0, 0, 0 ];
  GameOfLifeBug.prototype.act = function( surroundings ) {
    var numNeighbors = 0;
    var neighbors = findDirections( surroundings, this.character ).length;

    if ( this.energy ) {
      if ( !( numNeighbors === 2 || numNeighbors === 3 ) ) {
        this.energy = 0;
      }
    } else if ( numNeighbors === 3 ) {
      this.energy = 1;
    }
  };
  registerCreatureType( GameOfLifeBug, 'L' );

})( terra.creatures = terra.creatures || {} );
