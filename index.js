/*
 *Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
var httpServer = http.createServer(function(req, res){
  
  // Parse the url from the requests
  var parsedUrl = url.parse(req.url,true);
  
  // Get the path from the url and remove trailing /
  var  path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
	
	// Get query string from request as object
	var queryStringObject = parsedUrl.query;
  
  // Get request method
  var method = req.method.toLowerCase();
	
	// Get headers from request as object
	var headers = req.headers;
	
  // Get payload if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += data;
	});
	req.on('end',function(){
		buffer += decoder.end();
	
		// Send response
		res.end('Hello World\n');
  
		// Log request path to console
		console.log('Request received with this payload: ',buffer);
	});
  
});

// Start the server, and have it listen on port 3000
httpServer.listen(3000,function(){
  console.log('The server is listening on port 3000 now');
});
