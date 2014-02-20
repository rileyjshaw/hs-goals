var http = require("http"),
    url = require("url");

http.createServer(function(request, response) {
  var path = url.parse(request.url).pathname.substring(1);

  if(path !== '') {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("You ought to " + path.replace(/-/g, ' ') + "!");
    response.end();
  } else {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Try with a path!");
    response.end();
  }
}).listen(8888);
