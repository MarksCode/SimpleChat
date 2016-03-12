//***************************//
// app.js                    //
// Holds logic for frontend  //
//***************************//

var socket = io.connect("/"); 
var name = "";
var userList = []; // Holds users-online names

socket.on("connect", function(){
	console.log("connected");
});

socket.on("update", function(data){ // Updates users-online list
	userList = data;
	$("#chattersTable tr").remove();
	for (var i=0; i<userList.length; i++){
		var userStr = "<tr><td>"+userList[i]+"</td></tr>";
		$(userStr).appendTo("#chattersTable");
	}
});

socket.on("msgRec", function(data){ // Adds recieved message to messages list
	var msgStr = "<li>" + data + "</li>";
	$(msgStr).appendTo("#msgList");
	updateScroll();
});

function login(){ // Called when user logs in at start
	name = $("#nameBox").val();
	if (name.length > 0){
		$("#nameBox").prop('disabled', true);
		$("#loginButton").html('Logged In');
		$("#loginButton").prop('disabled', true);
		$("#msgInput").prop('disabled', false);
		$("#msgInput").prop('placeholder', "");
		socket.emit("loggedIn", name);
	}
};

function updateScroll(){ // Scrolls to bottom when recieved a message
	var element = document.getElementById("msgDiv");
	element.scrollTop = element.scrollHeight;
}

$(document).ready(function() { // Listens for 'enter' button being pressed in message input box
	$('#msgInput').keydown(function(event) {
		if (event.keyCode == 13) {
			var msg = $(this).val();
			if (msg.length > 0){
				msg = "<b>" + name + "</b>: " + msg;
				$(this).val("");
				socket.emit("msgSent", msg);
			}
		 }
	});
});