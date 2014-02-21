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
/*
    function clone ( object ) {
    function OneShotConstructor () {}
    OneShotConstructor.prototype = object;
    return new OneShotConstructor();

    function Child ( args ) {
      Parent.call( this, args );
    }
    Child.prototype = clone( Parent.prototype );
    Child.prototype.constructor = Child;

  }
*/
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

  Point.prototype.toString = function () {
    return '(' + this.x + ',' + this.y + ')';
  };

  function Grid ( width, height ) {
    this.width = width;
    this.height = height;
    this.cells = new Array( height );
    for ( var i = height - 1; i >= 0; i++) {
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

  function Terrarium ( map ) {
    var width = map[ 0 ].length;
    var height = map.length;
    var grid = new Grid( width, height );
    for ( var row = 0; row < height; row++ ) {
      var line = map[ row ];
      for ( var column = 0; column < width; column++ ) {
        var p = new Point( column, row );
        grid.cells[ p.y ][ p.x ] = elementFromCharacter( line[ column ] );
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
        result[ name ] = '#';
      }
    });
    return result;
  };

  Terrarium.prototype.step = function () {
    forEach( this.listActingCreatures(), method( this, "processCreature" ) );
  };

  Terrarium.prototype.processCreature = function ( creature ) {
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

    var currentEnergy = creature.object.energy += energy;
    if ( currentEnergy <= 0 ) {
      this.grid.cells[ creature.point.y ][ creature.point.x ] = undefined;
    } else {
      var color = creature.object.color;
      var maxEnergy = creature.object.maxEnergy;
      for ( var i = 2; i >= 0; i--) {
        creature.object.currentColor[ i ] = color + 255 * ( maxEnergy / currentEnergy - 1 );
      }
    }
  };

  Terrarium.prototype.creatureMove = function ( creature, from, to ) {
    if ( to !== null && this.grid.cells[ to.y ][ to.x ] === undefined ) {
      this.grid.moveValue( from, to );
      from.x = to.x;
      from.y = to.y;
    }
    return -creature.moveCost || -1;
  };

  Terrarium.prototype.creatureEat = function ( creature, source ) {
    var energy = creature.moveCost || 1;
    if ( source !== null ) {
      var meal = this.grid.cells[ source.y ][ source.x ];
      if ( meal !== undefined ) {
        var creatureHunger = creature.maxEnergy - creature.energy;
        var mealEnergy = meal.energy;
        if ( mealEnergy > creatureHunger) {
          meal.energy -= creatureHunger;
          energy = creatureHunger;
        } else {
          energy = mealEnergy;
          this.grid.cells[ source.y ][ source.x ] = undefined;
        }
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
