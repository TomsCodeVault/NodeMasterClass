/*
 *Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');

// The server should respond to all requests with a string
var httpServer = http.createServer(function(req, res){
  
  // Parse the url from the requests
  var parsedUrl = url.parse(req.url,true);
  
  // Get the path from the url and remove trailing /
  var  path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  
  // Get request method
  var method = req.method.toLowerCase();
  
  // Send response
  res.end('Hello World\n');
  
  // Log request path to console
  console.log('Request received on path: '+trimmedPath+' with method: '+method);
  
});

// Start the server, and have it listen on port 3000
httpServer.listen(3000,function(){
  console.log('The server is listening on port 3000 now');
});
