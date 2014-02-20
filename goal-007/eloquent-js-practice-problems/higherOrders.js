// HELPER FUNCTIONS. Eloquent JavaScript, Page 75
// Just playing with higher-order functions.
// Essentially re-implementing Array.reduce().

var op = {
  '+': function ( a, b ) {
    return a + b;
  },
  '-': function ( a, b ) {
    return a - b;
  },
  '/': function ( a, b ) {
    return a / b;
  },
  '*': function ( a, b ) {
    return a * b;
  },
  '%': function ( a, b ) {
    return a % b;
  },
  '<': function ( a, b ) {
    return a < b;
  },
  '>': function ( a, b ) {
    return a > b;
  },
  '<=': function ( a, b ) {
    return a <= b;
  },
  '>=': function ( a, b ) {
    return a >= b;
  },
  '==': function ( a, b ) {
    return a == b;
  },
  '===': function ( a, b ) {
    return a === b;
  },
  '!=': function ( a, b ) {
    return a != b;
  },
  '!==': function ( a, b ) {
    return a !== b;
  },
  '!': function ( a ) {
    return !a;
  },
  'sqrt': function ( a ) {
    return Math.sqrt( a );
  },
  'square': function ( a ) {
    return a * a;
  }
  // etc...
}

var forEach = function ( array, action ) {
  for ( var i = 0, _len = array.length; i < _len; i++ ) {
    action( array[ i ] );
  }
}

// action argument comes first to allow for partial application
var map = function ( action, array ) {
  var result = [];
  forEach( array, function ( element ) {
    result.push( action( element ) );
  });
  return result;
}

var reduce = function ( combine, base, array ) {
  forEach ( array, function (element) {
    base = combine(base, element);
  });
  return base;
}

var partial = function ( func ) {
  var knownArgs = arguments;
  return function () {
    var realArgs = [];
    for ( var i = 1, _len = knownArgs.length; i < _len; i++ ) {
      realArgs.push( knownArgs[ i ] );
    }
    for ( var i = 0, _len = arguments.length; i < _len; i++ ) {
      realArgs.push( arguments[ i ] );
    }
    return func.apply( null, realArgs );
  }
}

var compose = function ( f1, f2 ) {
  return function () {
    return f1( f2.apply( null, arguments ) );
  }
}

// one option
var sum = function () {
  return reduce( op['+'], 0, arguments );
}

// other option
var sum = function () {
  return partial( reduce, op[ '+' ], 0 )( arguments );
}

var countZeroes = function () {
  return reduce( function ( total, element ) {
    return total + (element === 0);
  }, 0, arguments );
}

var checkIf10 = partial( op[ '===' ], 10 );

var incrementArgs = function () {
  return map( partial( op[ '+' ], 1 ), arguments );
}

// switching this (or any of the preceeding) 'arguments'
// to .apply( null, arguments ) changes input from comma-
// separated values to arrays. Totally up to the developer.
var square2d = function () {
  return map( partial( map, op[ 'square' ] ), arguments );
}

var isNotNaN = compose( op[ '!' ], isNaN);

op[ '===' ]( true, !!42 );

map( op[ 'sqrt' ], [ 1, 4, 9 ] );

sum( 1, 11, 111, 1111, 11111, 111111, 1111111, 11111111, 111111111);

countZeroes( 9, 0, 2, 1, 0);

incrementArgs( 3, 7, 14, 15, 22, 41 ); // anybody watch LOST..?

square2d( [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ] );

isNotNaN( 1337 );
