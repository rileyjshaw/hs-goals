function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);

  var handler = handle[pathname];

  if (typeof handler === 'function') {
    handler(response, request);
  } else {
    console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found.")
    response.end();
  }
}

exports.route = route;
