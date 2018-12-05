/*
 *Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res){
  unifiedServer(req,res);
});

// Start the server
httpServer.listen(config.httpPort,function(){
  console.log("The server is listening on port "+config.httpPort);
});

// Instatiate the HTTPS server
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/server.key'),
  'cert' : fs.readFileSync('./https/server.crt')
};
var httpsServer = https.createServer(httpsServerOptions,function(req, res){
  unifiedServer(req,res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort,function(){
  console.log("The server is listening on port "+config.httpsPort+");
});

// All the server logic for both http and https servervar
var unifiedServer = function(req,res){
  
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
		buffer += decoder.write(data);
	});
	req.on('end',function(){
		buffer += decoder.end();
		
		// Choose the handler this request should use. If one is not found use the notFound handler
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
		
		// Construct the data object to send to the handler
		var data = {
			'trimmedPath' : trimmedPath,
			'queryStringObject' : queryStringObject,
			'method' : method,
			'headers' : headers,
			'payload' : buffer
		};
		
		// Route the request to the specified route
		chosenHandler(data,function(statusCode,payload){
			// Use the status code called back or default to 200
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			
			// Use the payload called back or default to an empty object
			payload = typeof(payload) == 'object' ? payload : {};
			
			// Convert the payload to a string
			var payloadString = JSON.stringify(payload);
			
			// Return the response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log request path to console
			console.log('Returning this response: ',statusCode,payloadString);
			
		});  

	});
};

// Define handlers
var handlers = {};

// Hello handler
handlers.hello = function(data,callback){
	// Callback a http status code, and a payload object
	callback(406,{'message' : 'welcome world!'});
};

// Not found handler
handlers.notFound = function(data,callback){
	callback(404);
};

// Define a request router
var router = {
	'hello' : handlers.hello
};
