var relay;

var messageHandlers =
{
	"defaultserver": function(data)
	{
		relay.send("registry");
	},
	"servers": function(data)
	{
		var servers = JSON.parse(data);
		
		for (var i = 0; i < servers.length; i++)
		{
			var server = servers[i];
			
			// description, ip, name, locked, num
			
			document.write(server.name + " - " + server.ip + "<br /><div>" + server.description + "</div>");
			console.log(server.name + " - " + server.ip);
		}
	}
};

function handleMessage(msg)
{
	var received = msg.data;
	console.log("received: " + received);
	var command = received.split("|")[0];
	var data = (received.contains("|") ? received.substr(received.indexOf("|") + 1) : undefined);
	
	if (messageHandlers.hasOwnProperty(command))
		messageHandlers[command](data);
}

function handleOpen(data)
{
	console.log("opened");
}

function handleClose(data)
{
	console.log("closed");
}

function handleError(data)
{

}

function connectToRegistry()
{
	relay = new Relay("server.pokemon-online.eu:10508", handleOpen, handleMessage, handleClose, handleError);
}