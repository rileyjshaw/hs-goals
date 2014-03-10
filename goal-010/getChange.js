
;( function getChange ( originalAmount ) {
  var coinValues = [ 2, 1, 0.25, 0.1, 0.05, 0.01 ];
  var valids = [];

  (function change ( remaining, coins, previous ) {
    var difference = remaining - coins[ 0 ];

    if ( difference > 0 ) {
      previous.push( coins[ 0 ] );
      change( difference, coins, previous );
    } else if ( difference == 0 ) {
      previous.push( coins[ 0 ] );
      valids.push( previous );
    } else {
      change( remaining, coins.slice( 1 ), previous );
    }
    return;
  })( originalAmount, coinValues, [] );

  if ( valids === [] ) {
    valids = "I'm sorry, we couldn't make change from that amount.";
  }
  return valids;
})( 1.99 );