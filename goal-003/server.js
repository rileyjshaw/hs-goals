var http = require("http"),
    url = require("url");

var start = function(port, route, handle) {
  http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received.");
/*//Chunk handling
    var postData = "";
    request.setEncoding("utf8");
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Recieved POST data chunk '" + postDataChunk + "'.");
    });
    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });
*/
    route(handle, pathname, response, request);
  }).listen(port);

  console.log("Server has started on port " + port + ".")
}

exports.start = start;
