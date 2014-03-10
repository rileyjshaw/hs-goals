text = 'map calls a provided callback function once for each element in an array, in order, and constructs a new array from the results. callback is invoked only for indexes of the array which have assigned values; it is not invoked for indexes which have been deleted or which have never been assigned values. callback is invoked with three arguments: the value of the element, the index of the element, and the Array object being traversed.'

var words = text.split(/[\s*\.*\,\;\+?\#\|:\-\/\\\[\]\(\)\{\}$%&0-9*]/);

words.map( function ( k,v ) {
  if(typeof list === "undefined") list = {};
  if ( typeof list[k] === "undefined" ) list[k] = 0;
  list[k]++;
})