var terra = terra || {};

( function ( exports ) {

  var config = {};

  function randomInteger ( below ) {
    return Math.floor( Math.random() * below );
  }

  function randomElement ( array ) {
    var arrLength = array.length;
    if ( !arrLength ) {
      throw new Error( 'The array is empty.' );
    }
    return array[ randomInteger( arrLength ) ];
  }

  //'this' binding
  function method ( object, name ) {
    return function () {
      object[ name ].apply( object, arguments );
    };
  }

  function forEach ( array, action ) {
    for ( var i = 0, _len_i = array.length; i < _len_i; i++ ) {
      action( array[ i ] );
    }
  }

  function forEachIn ( object, action ) {
    for ( var property in object ) {
      if ( Object.prototype.hasOwnProperty.call( object, property ) ) {
        action( property, object[ property ] );
      }
    }
  }

  function Dictionary ( startValues ) {
    this.values = startValues || {};
  }

  Dictionary.prototype.store = function ( name, value ) {
    this.values[ name ] = value;
  };

  Dictionary.prototype.lookup = function ( name ) {
    return this.values[ name ];
  };

  Dictionary.prototype.contains = function ( name ) {
    return Object.prototype.propertyIsEnumerable.call( this.values, name );
  };

  Dictionary.prototype.each = function ( action ) {
    forEachIn( this.values, action );
  };

  Dictionary.prototype.names = function () {
    var names = [];
    this.each( function ( name, value ) {
      names.push( name );
    });
    return names;
  };

  var directions = new Dictionary({
    'n':  new Point(  0, -1 ),
    'ne': new Point(  1, -1 ),
    'e':  new Point(  1,  0 ),
    'se': new Point(  1,  1 ),
    's':  new Point(  0,  1 ),
    'sw': new Point( -1,  1 ),
    'w':  new Point( -1,  0 ),
    'nw': new Point( -1, -1 )
  });

  var creatureTypes = new Dictionary();
  creatureTypes.register = function ( constructor, character ) {
    constructor.prototype.character = character;
    creatureTypes.store( character, constructor ); // FIXME: could use method() or bind() rather than creatureTypes
  };

  function Point ( x, y ) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.add = function ( other ) {
    return new Point( this.x + other.x, this.y + other.y );
  };

  function Grid ( width, height ) {
    this.width = width;
    this.height = height;
    this.cells = new Array( height );
    for ( var i = height - 1; i >= 0; i--) {
      this.cells[ i ] = new Array( width );
    }
  }

  Grid.prototype.isInside = function ( point ) {
    return point.x >= 0 && point.y >= 0 &&
           point.x < this.width && point.y < this.height;
  };

  Grid.prototype.moveValue = function ( from, to ) {
    this.cells[ to.y ][ to.x ] = this.cells[ from.y ][ from.x ];
    this.cells[ from.y ][ from.x ] = undefined;
  };

  Grid.prototype.each = function ( action ) {
    for ( var y = 0; y < this.height; y++ ) {
      for ( var x = 0; x < this.width; x++ ) {
        var point = new Point( x, y );
        action( point, this.cells[ y ][ x ] );
      }
    }
  };

  function Terrarium ( map, selector ) {
    // FIXME: Grid / DOM logic should probably be broken out of here...

    var domElement = document.querySelector( selector );
    var width = map[ 0 ].length;
    var height = map.length;
    var grid = new Grid( width, height );
    for ( var row = 0; row < height; row++ ) {
      var line = map[ row ];
      for ( var column = 0; column < width; column++ ) {
        var p = new Point( column, row );
        grid.cells[ row ][ column ] = elementFromCharacter( line[ column ] );
      }
    }
    this.grid = grid;

    var docFragment = document.createDocumentFragment();

    for ( var i = width * height; i >= 0; i-- ) {
      var span = document.createElement("span");
      if ( i % width === 0 ) {
        span.style.clear = 'left';
      }
      docFragment.appendChild(span);
    }

    domElement.innerHTML = '';
    domElement.appendChild(docFragment);
    this.spans = domElement.childNodes;

  }

  Terrarium.prototype.toString = function () {
    var characters = [];
    var endOfLine = this.grid.width - 1;
    this.grid.each( function ( point, value ) {
      characters.push( characterFromElement( value ) );
      if ( point.x === endOfLine ) {
        characters.push( '\n' );
      }
    });
    return characters.join( '' );
  };

  Terrarium.prototype.toDom = function () {
    var terra = this;
    this.grid.each( function ( point, value ) {
      var span = terra.spans[ point.y * terra.grid.width + point.x ];
      if ( value ) {
        span.style.color = 'rgb(' + value.currentColor + ')';
        span.textContent = characterFromElement( value );
      } else {
        span.textContent = ' ';
      }
    });
  };

  Terrarium.prototype.listActingCreatures = function () {
    var found = [];
    this.grid.each( function ( point, value ) {
      if ( value !== undefined && value.act ) {
        found.push( {
          object: value,
          point: point
        });
      }
    });
    return found;
  };

  Terrarium.prototype.listSurroundings = function ( center ) {
    var result = {};
    var grid = this.grid;
    directions.each( function ( name, direction ) {
      var place = center.add( direction );
      if ( grid.isInside( place ) ) {
        result[ name ] = characterFromElement( grid.cells[ place.y ][ place.x ] );
      } else {
        result = '#';
      }
    });
    return result;
  };

  Terrarium.prototype.step = function () {
    forEach( this.listActingCreatures(), method( this, "processCreature" ) );
  };

  Terrarium.prototype.processCreature = function ( creature ) {
    var
    i,
    energy,
    currentEnergy = creature.object.energy,
    maxEnergy = creature.object.maxEnergy,
    color = creature.object.color,
    rgbSegment,
    action,
    self = this;

    function dir () {
      if ( !directions.contains( action.direction ) ) {
        return null;
      }
      var target = creature.point.add( directions.lookup( action.direction ) );
      if ( !self.grid.isInside( target ) ) {
        return null;
      }
      return target;
    }

    for ( i = 2; i >= 0; i--) {
      rgbSegment = color[ i ];
      creature.object.currentColor[ i ] = Math.floor( rgbSegment + (255 - rgbSegment) * ( 1 - currentEnergy / maxEnergy ) );
    }

    action = creature.object.act( this.listSurroundings( creature.point ) );

    switch ( action.type ) {
      case 'move':
        energy = this.creatureMove( creature.object, creature.point, dir() );
        break;
      case 'eat':
        energy = this.creatureEat( creature.object, dir() );
        break;
      case 'photosynthesize':
        energy = 2 * ( creature.object.efficiency || 1 );
        break;
      case 'reproduce':
        energy = this.creatureReproduce( creature.object, dir() );
        break;
      case 'wait':
        energy = 0.4 * ( creature.object.moveCost || -1 );
        break;
      case 'skip':
        break;
      default:
        throw new Error( 'Unsupported action: ' + action.type);
    }

    if ( action.type !== 'skip' && ( creature.object.energy += energy ) <= 0 ) {
      this.grid.cells[ creature.point.y ][ creature.point.x ] = undefined;
    } else if ( creature.object.energy > creature.object.maxEnergy ) {
      creature.object.energy = creature.object.maxEnergy;
    }
  };

  Terrarium.prototype.creatureMove = function ( creature, from, to ) {
    if ( to !== null && this.grid.cells[ to.y ][ to.x ] === undefined ) {
      this.grid.moveValue( from, to );
      from.x = to.x;
      from.y = to.y;
    }
    return creature.moveCost || -1;
  };

  Terrarium.prototype.creatureEat = function ( creature, source ) {
    var energy = creature.moveCost || -1;
    if ( source !== null ) {
      var meal = this.grid.cells[ source.y ][ source.x ];
      if ( meal !== undefined ) {
        energy = meal.energy;
        this.grid.cells[ source.y ][ source.x ] = undefined;
      }
    }
    return energy * ( creature.efficiency || 1 );
  };

  Terrarium.prototype.creatureReproduce = function ( creature, target ) {
    var energy = 1;
    if ( target !== null && this.grid.cells[ target.y ][ target.x ] === undefined ) {
      var species = characterFromElement( creature );
      var baby = elementFromCharacter( species );
      energy = baby.energy * 2;
      if ( creature.energy >= energy ) {
        this.grid.cells[ target.y ][ target.x ] = baby;
      }
    }
    return -energy * ( creature.efficiency || 1 );
  };

  function elementFromCharacter ( character ) {
    if ( character === ' ' ) {
      return undefined;
    } else if ( creatureTypes.contains( character ) ) {
      return new( creatureTypes.lookup( character ) )();
    } else {
      throw new Error( 'Unknown character: ') + character;
    }
  }

  function characterFromElement ( element ) {
    if ( element === undefined ) {
      return ' ';
    } else {
      return element.character;
    }
  }

  function findDirections ( surroundings, wanted ) {
    var found = [];
    directions.each( function ( name ) {
      if ( surroundings[ name ] == wanted ) {
        found.push( name );
      }
    });
    return found;
  }

  exports.randomElement = randomElement;
  exports.Terrarium = Terrarium;
  exports.registerCreatureType = creatureTypes.register;
  exports.findDirections = findDirections;
  exports.directions = directions;
  exports.forEach = forEach;

})( terra.util = terra.util || {} );

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
    this.currentColor = [];
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
    this.currentColor = [];
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
    this.currentColor = [];
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

;( function ( exports ) {

  // Imports...
  randomElement = terra.util.randomElement;

  var mGameOfLife =
    [ '############################',
      '#       L                  #',
      '#       L                  #',
      '#       L                  #',
      '#                          #',
      '#         L                #',
      '#          L               #',
      '#        LLL               #',
      '#                    L     #',
      '#                   L      #',
      '#                          #',
      '############################' ];

  var mapGen = function ( height, width, characters ) {
    var level = new Array('');
    for ( var col = height - 1; col >= 0; col--) {
      for ( var row = width - 1; row >= 0; row--) {
        if ( row == width - 1 ) {
          character = '';
          level[ col ] = '#';
        } else if ( !col || !row || col == height - 1 ) {
          character = '#';
        } else {
          character = randomElement( characters );
        }
        level[ col ] += character;
      }
    }
    return level;
  };

  exports.mGameOfLife = mGameOfLife;
  exports.mSmall = function ( characters ) {
    return mapGen( 24, 48, characters );
  };
  exports.mMedium = function ( characters ) {
    return mapGen( 48, 96, characters );
  };
  exports.mBig = function ( characters ) {
    return mapGen( 56, 144, characters );
  };
  exports.mapGen = mapGen;

})( terra.maps = terra.maps || {} );