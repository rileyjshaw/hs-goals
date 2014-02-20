// Built mainly from an example in Eloquent JavaScript,
// next goal is to clean it up & throw it into modules.

var thePlan =
  [ '############################',
    '#      #####     #####     #',
    '#  ##      #     o         #',
    '#  ##    % #####     #     #',
    '#      #   #          ~    #',
    '#      #   #  o   #       ##',
    '#   ~  #                ####',
    '#      #     #     %      ##',
    '#      #             o    ##',
    '#   o  #   #             ###',
    '#      #   #     #     #####',
    '############################' ];

var moodyCave =
  [ '############################',
    '#                #####*    #',
    '#  ##      c  c    ##**    #',
    '#  ##*              #*     #',
    '#   #**                ****#',
    '#   **    c       ######**##',
    '#                  #########',
    '#              c    *#######',
    '#  c    ***          *****##',
    '#      ##**          ****###',
    '#      ##*          ***#####',
    '############################' ];

var levelGen = function ( height, width, characters ) {
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

function Point ( x, y ) {
  this.x = x;
  this.y = y;
}

Point.prototype.add = function ( other ) {
  return new Point( this.x + other.x, this.y + other.y );
}

Point.prototype.toString = function () {
  return '(' + this.x + ',' + this.y + ')';
};

function Grid ( width, height ) {
  this.width = width;
  this.height = height;
  this.cells = new Array( width * height );
}

Grid.prototype.valueAt = function ( point ) {
  return this.cells [ point.y * this.width + point.x ];
};

Grid.prototype.setValueAt = function ( point, value ) {
  this.cells [ point.y * this.width + point.x ] = value;
};

Grid.prototype.isInside = function ( point ) {
  return point.x >= 0 && point.y >= 0 &&
         point.x < this.width && point.y < this.height;
};

Grid.prototype.moveValue = function ( from, to ) {
  this.setValueAt( to, this.valueAt( from ));
  this.setValueAt( from, undefined);
};

Grid.prototype.each = function ( action ) {
  for ( var y = 0; y < this.height; y++ ) {
    for ( var x = 0; x < this.width; x++ ) {
      var point = new Point( x, y );
      action( point, this.valueAt( point ) );
    }
  }
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
  this.store( character, constructor );
};

var wall = {
  character: '#'
};

function StupidBug () {};
StupidBug.prototype.act = function ( surroundings ) {
  return {
    type: 'move',
    direction: 's'
  };
};
creatureTypes.register ( StupidBug, 'o' );

function BouncingBug() {
  this.direction = "ne";
}
BouncingBug.prototype.act = function ( surroundings ) {
  if ( surroundings[ this.direction ] !== ' ') {
    this.direction = ( this.direction === 'ne' ? 'sw' : 'ne' );
  }
  return {
    type: 'move',
    direction: this.direction
  };
};
creatureTypes.register( BouncingBug, '%' );

function DrunkBug() {};
DrunkBug.prototype.act = function ( surroundings ) {
  return {
    type: 'move',
    direction: randomElement( directions.names() )
  };
};
creatureTypes.register( DrunkBug, '~' );

function elementFromCharacter ( character ) {
  switch( character ) {
    case ' ':
      return undefined;
    case '#':
      return wall;
    default:
      if ( creatureTypes.contains( character ) ) {
        return new( creatureTypes.lookup( character ) )();
      } else {
        throw new Error( 'Unknown character: ') + character;
      }
  }
}

function characterFromElement ( element ) {
  if ( element == undefined ) {
    return ' ';
  } else {
    return element.character;
  }
}

function Terrarium ( plan ) {
  var width = plan[ 0 ].length;
  var height = plan.length;
  var grid = new Grid( width, height );
  for ( var y = 0; y < height; y++ ) {
    var line = plan[ y ];
    for ( var x = 0; x < width; x++ ) {
      grid.setValueAt( new Point( x, y ), elementFromCharacter( line.charAt( x ) ) );
    }
  }
  this.grid = grid;
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

Terrarium.prototype.listActingCreatures = function () {
  var found = [];
  this.grid.each( function ( point, value ) {
    if ( value != undefined && value.act ) {
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
      result[ name ] = characterFromElement( grid.valueAt( place ) );
    } else {
      result[ name ] = '#';
    }
  });
  return result;
};

Terrarium.prototype.processCreature = function ( creature ) {
  var action = creature.object.act( this.listSurroundings( creature.point ) );
  if ( action.type == 'move' && directions.contains( action.direction ) ) {
    var to = creature.point.add( directions.lookup( action.direction ) );
    if ( this.grid.isInside( to ) && this.grid.valueAt( to ) == undefined) {
      this.grid.moveValue( creature.point, to );
    }
  } else {
    throw new Error( 'Unsupported action: ' + action.type )
  }
};

Terrarium.prototype.step = function () {
  forEach( this.listActingCreatures(), method( this, "processCreature" ) );
}

function clone ( object ) {
  function OneShotConstructor () {}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
}

function LifeLikeTerrarium (plan) {
  Terrarium.call( this, plan );
}
LifeLikeTerrarium.prototype = clone( Terrarium.prototype );
LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium;

LifeLikeTerrarium.prototype.processCreature = function ( creature ) {
  var
  energy,
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

  action = creature.object.act( this.listSurroundings( creature.point ) );

  switch ( action.type ) {
    case 'move':
      energy = this.creatureMove( creature.object, creature.point, dir() );
      break;
    case 'eat':
      energy = this.creatureEat( creature.object, dir() );
      break;
    case 'photosynthesize':
      energy = -1;
      break;
    case 'reproduce':
      energy = this.creatureReproduce( creature.object, dir() );
      break;
    case 'wait':
      energy = 0.2;
      break;
    default:
      throw new Error( 'Unsupported action: ' + action.type);
  }

  creature.object.energy -= energy;
  if ( creature.object.energy <= 0 ) {
    this.grid.setValueAt( creature.point, undefined);
  }
};

LifeLikeTerrarium.prototype.creatureMove = function ( creature, from, to ) {
  if ( to != null && this.grid.valueAt( to ) == undefined ) {
    this.grid.moveValue( from, to );
    from.x = to.x;
    from.y = to.y;
  }
  return 1;
};

LifeLikeTerrarium.prototype.creatureEat = function ( creature, source ) {
  var energy = 1;
  if ( source != null ) {
    var meal = this.grid.valueAt( source );
    if ( meal != undefined && meal.energy ) {
      this.grid.setValueAt( source, undefined );
      energy -= meal.energy;
    }
  }
  return energy;
}

LifeLikeTerrarium.prototype.creatureReproduce = function ( creature, target ) {
  var energy = 1;
  if ( target != null && this.grid.valueAt( target ) == undefined ) {
    var species = characterFromElement( creature );
    var baby = elementFromCharacter( species );
    energy = baby.energy * 2;
    if ( creature.energy >= energy ) {
      this.grid.setValueAt( target, baby );
    }
  }
  return energy;
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
creatureTypes.register( Lichen, '*' );

function LichenEater () {
  this.energy = 10;
}
LichenEater.prototype.act = function ( surroundings ) {
  var emptySpace = findDirections( surroundings, ' ' );
  var lichen = findDirections( surroundings, '*' );
  if ( this.energy >= 30 && emptySpace.length > 0 ) {
    return {
      type: 'reproduce',
      direction: randomElement( emptySpace )
    };
  } else if ( lichen.length > 0 ) {
    return {
      type: 'eat',
      direction: randomElement( lichen )
    };
  } else if ( emptySpace.length > 0 ) {
    return {
      type: 'move',
      direction: randomElement( emptySpace )
    }
  } else {
    return {
      type: 'wait'
    };
  }
};
creatureTypes.register( LichenEater, 'd' );

function CleverLichenEater () {
  this.energy = 10;
  this.direction = 'ne';
}
CleverLichenEater.prototype.act = function ( surroundings ) {
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
    }
  } else {
    return {
      type: 'wait'
    };
  }
};
creatureTypes.register( CleverLichenEater, 'c' );

function CleverLichenEater2 () {
  this.energy = 10;
}
CleverLichenEater2.prototype.act = function ( surroundings ) {
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
    }
  } else {
    return {
      type: 'wait'
    };
  }
};
creatureTypes.register( CleverLichenEater2, 'C' );



// A little extra to animate 'er
var domElement = document.getElementById( 'terra' );

var cave = new LifeLikeTerrarium( levelGen( 48, 120, [ ' ', ' ', ' ', ' ', ' ', '*', '*', '*', '*', '*', 'c', 'c' ] ) );

var loop = setInterval( function() {
  domElement.innerHTML = cave.toString();
  cave.step();
}, 10);
