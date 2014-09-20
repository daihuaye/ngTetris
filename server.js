var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
// Serve static files
app.use(express.static(__dirname + '/build'));


// Start server and listen on port 8080 if not env defined.
server.listen(process.env.PORT || 8080);
console.log('Server running at http://localhost:8080/');