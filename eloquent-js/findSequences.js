// RECURSION. Eloquent JavaScript, Page 39
// Starting with 1, find all sequences of operations consisting of
// "add 5" and "multiply by 3" that will reach a target value.

;(function findSequences ( goal ) {
  var
  initial = 1,
  sequences = [],

  search = function search ( value, steps ) {
    if ( value < goal ) {
      return search( value + 5, steps + ' + 5' ) ||
        search( value * 3,
          steps.slice( -1 ) === '5'
            ? '(' + steps + ') * 3'
            : steps + ' * 3'
        )
    } else if ( value === goal ) {
      sequences.push( steps );
    } else {
      return null;
    }
  };

  search( initial, initial + '' );
  return sequences;
})( 81 );