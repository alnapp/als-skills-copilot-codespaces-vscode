// create web server to handle requests
// http://nodejs.org/api/http.html#http_http
var http = require('http');

// create web server
var server = http.createServer(function(req, res){
  // handle incoming requests here..
  console.log('request made');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World');
});

// listen for requests on port 3000
server.listen(3000, '

