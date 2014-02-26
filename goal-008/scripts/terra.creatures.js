;( function ( exports ) {

  // Imports...
  randomElement = terra.util.randomElement;
  registerCreatureType = terra.util.registerCreatureType;
  findDirections = terra.util.findDirections;
  directions = terra.util.directions;
  forEach = terra.util.forEach;

  function Wall () {
    this.currentColor = [ 0, 0, 0 ];
  }
  Wall.prototype.color = [ 0, 0, 0 ];
  registerCreatureType( Wall, '#' );

  function Lichen () {
    this.energy = 5;
    this.currentColor = [ 191, 255, 191 ]; // 5/20
  }
  Lichen.prototype.color = [ 0, 255, 0 ];
  Lichen.prototype.maxEnergy = 20;
  Lichen.prototype.efficiency = 0.5;

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
    this.energy = 8;
    this.direction = 'ne';
    this.currentColor = [ 214, 214, 255 ]; // 8/50
  }
  LineBug.prototype.color = [ 0, 0, 255 ];
  LineBug.prototype.maxEnergy = 50;
  LineBug.prototype.moveCost = -2;

  LineBug.prototype.act = function ( surroundings ) {
    var emptySpace = findDirections( surroundings, ' ' ); // FIXME: just needs the one direction
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
    this.currentColor = [ 255, 204, 204 ]; // 10/50
  }
  StupidBug.prototype.color = [ 255, 0, 0 ];
  StupidBug.prototype.maxEnergy = 50;

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
    this.energy = 1; //Math.random() < 0.5 ? 0 : 1;
    this.currentColor = [ 0, 0, 0 ]; // 1/1
  }
  GameOfLifeBug.prototype.color = [ 0, 0, 0 ];
  GameOfLifeBug.prototype.maxEnergy = 1;

  GameOfLifeBug.prototype.act = function( surroundings ) {
    var numNeighbors = 0;
    directions.each( function ( name ) {
      if ( surroundings[ name ].character === this.character && surroundings[ name ].object.energy === 1 ) {
        numNeighbors++;
      }
    });
    if ( this.energy ) {
      if ( !( numNeighbors === 2 || numNeighbors === 3 ) ) {
        this.energy = 0;
      }
    } else if ( numNeighbors === 3 ) {
      this.energy = 1;
    }
    return {
      type: 'skip'
    };
  };
  registerCreatureType( GameOfLifeBug, 'L' );

})( terra.creatures = terra.creatures || {} );
