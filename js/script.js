var relay;
var allServers = {};
var name = "";
var color = "";
var players = {};

var messageHandlers =
{
	"defaultserver": function(data)
	{
		$("#advancedConnection").get(0).value = data;
		relay.send("registry");
	},
	"servers": function(data)
	{
		var servers = JSON.parse(data);
		$("#servers").get(0).innerHTML = "";
		
		for (var i = 0; i < servers.length; i++)
		{
			var server = servers[i];
			
			// description, ip, name, locked, num, port
			
			allServers[server.name] = server;
		}
		
		var listed = [];
		
		for (var server in allServers)
		{
			if (allServers.hasOwnProperty(server))
			{
				if (listed.length === 0)
				{
					listed.push(allServers[server]);
				}
				else
				{
					var pushed = false;
					
					for (var i = 0; i < listed.length; i++)
					{
						if (listed[i].num < allServers[server].num)
						{
							listed.insert(i, allServers[server]);
							pushed = true;
							break;
						}
					}
					
					if (!pushed)
					{
						listed.push(allServers[server]);
					}
				}
			}
		}
		
		for (var i = 0; i < listed.length; i++)
		{
			var server = listed[i];
			var fn = '$("#advancedConnection").get(0).value = "' + server.name + ' - ' + server.ip + ':' + server.port + '";';
			
			$("#servers").append("<div class='serverItem' onclick='" + fn + "'>"
				+ escapeHTML(server.name) + "<span style='float:right; color:inherit;'>" + server.num + " users online</span></div>");
		}
	},
	"connected": function(data)
	{
		$("#page_serverList").fadeOut(500, function() { $("#page_client").fadeIn(500); });
	
		var login = { version: 1 };
		login.default = getVal("defaultChannel", "Tohjo Falls");
		login.autojoin = getVal("autojoinChannels", []);
		login.ladder = getVal("ladderEnabled", true);
		login.idle = getVal("idle", false);
		login.color = color;
		login.name = name;
		
		relay.send("login", login);
	},
	"challenge": function(data)
	{
		vex.dialog.open(
		{
			message: "That name is registered. If you don't know the password, choose a different name.<br />Enter password:",
			input: "<input name='password' type='password' required />",
			buttons:
			[
				$.extend({}, vex.dialog.buttons.YES,
				{
					text: "Login"
				}),
				$.extend({}, vex.dialog.buttons.NO,
				{
					text: "Back"
				})
			],
			callback: function(res)
			{
				if (res && res.password)
				{
					var hash = md5(md5(res.password) + data);
					relay.send("auth", { "hash": hash });
				}
				else
				{
					relay.close();
					vex.dialog.alert("Please refresh the page, then :\\");
				}
			}
		});
	},
	"chat": function(data)
	{
		data = JSON.parse(data);
		
		if (data.channel === -1)
		{
			print(timestamp() + " " + data.message, data.html);
		}
		else if (data.message.contains(":"))
		{
			var player = playerByName(data.message.split(":")[0]);
			
			if (player)
			{
				var name = player.name;
				var color = player.color || "#000000";
				var message = data.message.substr(data.message.indexOf(":") + 2);
				
				print("<span style='color:%1'>%2 <b>%3</b></span> %4".args(color, timestamp(), name, message), data.html);
			}
			else
			{
				print(timestamp() + " " + data.message, data.html);
			}
		}
		else
		{
			print(timestamp() + " " + data.message, data.html);
		}
		
	},
	"players": function(data)
	{
		if (players === {})
		{
			players = JSON.parse(data);
		}
		else
		{
			var updates = JSON.parse(data);
			
			for (var x in updates)
			{
				if (updates.hasOwnProperty(x))
				{
					players[x] = updates[x];
				}
			}
		}
	}
};

function handleMessage(msg)
{
	var received = msg.data.toString();
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

function connectToServer()
{
	name = $("#name").get(0).value;
	color = "#FF0000";
	
	var ip = $("#advancedConnection").get(0).value;
	ip = ip.substr(ip.lastIndexOf(" - ") + 3);
	
	relay.send("connect", ip);
}

function print(msg, html)
{
	html = html || true;
	
	$("#chat").append("<div>" + (html ? msg : escapeHTML(msg)) + "</div>");
	scrollToBottom($("#chat").get(0));
}

function playerByName(name)
{
	for (var player in players)
	{
		if (players.hasOwnProperty(player))
		{
			if (cmp(players[player].name, name))
				return players[player];
		}
	}
	
	return undefined;
}
