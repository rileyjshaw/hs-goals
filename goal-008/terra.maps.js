;( function ( exports ) {

  // Imports...
  randomElement = terra.util.randomElement;

  var mBasic =
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

  var mMoodyCave =
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


  exports.mBasic = mBasic;
  exports.mMoodyCave = mMoodyCave;
  exports.mSmall = function ( characters ) {
    return mapGen( 24, 48, characters );
  };
  exports.mMedium = function ( characters ) {
    return mapGen( 48, 96, characters );
  };
  exports.mBig = function ( characters ) {
    return mapGen( 180, 60, characters );
  };
  exports.mapGen = mapGen;

})( terra.maps = terra.maps || {} );