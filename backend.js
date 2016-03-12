//*****************//
// Sets up backend //
//*****************//
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var express = require('express');
server.listen(8080);
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/static'));
var users = [];


//*****************//
// Sends out html  //
//*****************//
app.get('/', function(req, res){ // Main page
	res.render('index.html');
});


//*************************//
// Handles socket requests //
//*************************//
io.on("connection", handleIO); // Called when user connects

function handleIO(socket){
	console.log('Client connected...');
	
	socket.on('loggedIn', function(data){ // Called when user logs in
		socket.user = data; // Data holds username
		users.push(data); // Adds user's name to name list
		updateClients(); // Updates users-online list for everybody
	});
	
	socket.on('disconnect', function(){ // Called when user disconnects
		console.log("User logged out");
		for (var i=0; i<users.length; i++){ // Deletes logged out users name from users-online list
			if (users[i] == socket.user){
				users.splice(i, 1);
			}
		}
		updateClients(); // Updates users-online list for everybody
	});
	
	socket.on('msgSent', function(data){ // Called when message is sent out
		io.sockets.emit('msgRec', data); // Sends out message to everybody
	});
	
	function updateClients(){ // Updates users-online list for everybody
		io.sockets.emit('update', users);
	}
	
}

