var server = require("./server"),
    router = require("./router"),
    requestHandlers = require("./requestHandlers");

var handle = {
  "/": requestHandlers.start,
  "/start": requestHandlers.start,
  "/upload": requestHandlers.upload,
  "/show": requestHandlers.show
}

server.start(8000, router.route, handle);
