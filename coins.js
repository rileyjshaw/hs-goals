;(function ( coins, amount ) {
  var ways = 0; // ISSUE: STATE OUTSIDE OF FUNCTION
  (function recurse ( coins, amount ) {
    if ( coins.length === 0 ) {
      return;
    }
    difference = amount - coins[ 0 ];
    if ( difference > 0 ) {
      recurse( coins, difference );
    } else if ( difference === 0 ) {
      ways++;
    }
    recurse( coins.slice( 1 ), amount );
  }) ( coins, amount );
  return ways;
}) ( [ 200, 100, 50, 25, 10, 5, 1 ], 200 );


;(function ( coins, amount ) {
  (function recurse ( coins, amount ) {
    if ( coins.length === 0 ) {
      return;
    }
    difference = amount - coins[ 0 ];
    if ( difference > 0 ) {
      recurse( coins, difference );
    } else if ( difference === 0 ) {
      ways++;
    }
    recurse( coins.slice( 1 ), amount );
  }) ( coins, amount );
  return recurse ( coins, amount ) +
}) ( [ 200, 100, 50, 25, 10, 5, 1 ], 200 );
