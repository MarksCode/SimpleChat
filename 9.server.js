var http = require("http");
var port = 8080;
var host = "localhost";
var ASQ = require("asynquence");
var node_static = require("node-static");

var static_files = new node_static.Server(__dirname);
var server = http.createServer(handleHTTP).listen(port,host);
var io = require("socket.io").listen(server); //socket io hijacks server requests

io.configure(function(){
	io.enable("browser client minification");
	io.enable("browser client etag");
	io.set("log level", 1);
	io.set("transports", ["websocket", "xhr-polling", "jsonp-polling"]);
});

io.on("connection", handleIO);

function handleIO(socket){
	function disconnect(){
//		clearInterval(intv);
		console.log("client disocnnected");
	}
	console.log("client connected");
	socket.on("disconnect",disconnect);
	
//	var intv = setInterval(function(){
//		socket.emit("msgSent", Math.random()); //"msgSent" is event name
//	},1000);
	
	socket.on("userMsg", function(data){
		socket.broadcast.emit("messages", data);
	});
}



function handleHTTP(req, res){
	if (req.method === "GET"){
		if (/^\/\d+(?=$|[\/?#])/.test(req.url)){
			req.addListener("end", function(){
				req.url = req.url.replace(/^\/(\d+).*$/,"/$1.html");
				static_files.serve(req, res);
			});
			req.resume();
		}
		else {
			res.writeHead(403);
			res.end("Get outta here!");
		}
	}
}
