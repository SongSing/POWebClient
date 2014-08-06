var relay;
var allServers = {};
var players = {};
var namecolorlist = ['#5811b1', '#399bcd', '#0474bb', '#f8760d', '#a00c9e', '#0d762b', '#5f4c00', '#9a4f6d', '#d0990f', '#1b1390', '#028678', '#0324b1'];

var myInfo = {};
var channels = {};
var channelPlayers = {};
var tiers = {};
var myChannels = {};
var channelPlayers = {};

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
				
			$("#servers").append("<div class='serverItem' id='serverItem" + i + "'>"
				+ escapeHTML(server.name) + "<span style='float:right; color:inherit;'>" + server.num + (server.hasOwnProperty("max") ? "/" + server.max : "") + " user(s) online</span></div>");
		}
		
		$(".serverItem").click(function()
		{
			var server = listed[this.id.substr(10)];
			console.log(server.description);
			$("#advancedConnection").get(0).value = server.name + " - " + server.ip + ":" + server.port;
			$("#serverDescription").get(0).innerHTML = server.description;
		});
	},
	"connected": function(data)
	{
		$("#page_serverList").fadeOut(500, function() { $("#page_client").fadeIn(500); });
	
		var login = { version: 1 };
		login.default = getVal("defaultChannel", "Tohjo Falls");
		login.autojoin = getVal("autojoinChannels", []);
		login.ladder = getVal("ladderEnabled", true);
		login.idle = getVal("idle", false);
		login.color = myInfo.color;
		login.name = myInfo.name;
		
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
		
		if (data.message.contains(":"))
		{
			var player = playerByName(data.message.split(":")[0]);
			
			if (player)
			{
				var name = player.name;
				var color = player.color || "#000000";
				var message = data.message.substr(data.message.indexOf(":") + 2);
				
				if (!data.html)
					message = escapeHTML(message);
				
				print("<span style='color:%1'>%2 <b>%3:</b></span> %4".args(color, timestamp(), name, message), data.channel);
			}
			else if (data.message.startsWith("\u00b1") || data.message.startsWith("+"))
			{
				var name = data.message.split(":")[0];
				var color = "#318739";
				var message = data.message.substr(data.message.indexOf(":") + 2);
				
				if (!data.html)
					message = escapeHTML(message);
				
				print("<span style='color:%1'>%2 <b>%3:</b></span> %4".args(color, timestamp(), name, message), data.channel);
			}
			else if (data.message.startsWith("Welcome Message: "))
			{
				var name = data.message.split(":")[0];
				var color = "blue";
				var message = data.message.substr(data.message.indexOf(":") + 2);
				
				if (!data.html)
					message = escapeHTML(message);
				
				print("<span style='color:%1'>%2 <b>%3:</b></span> %4".args(color, timestamp(), name, message), data.channel);
			}
			else
			{
				print(timestamp() + " " + (data.html ? data.message : escapeHTML(data.message)), data.channel);
			}
		}
		else
		{
			print(timestamp() + " " + data.message, data.html, data.channel);
		}
		
	},
	"players": function(data)
	{
		var updates = JSON.parse(data);
		
		for (var x in updates)
		{
			if (updates.hasOwnProperty(x))
			{				
				players[x] = updates[x];
				
				if (!players[x].color)
				{
					players[x].color = namecolorlist[parseInt(x) % namecolorlist.length];
				}
			}
		}
	},
	"login": function(data)
	{
		data = JSON.parse(data);
		
		myInfo = data.info;
		myInfo.id = data.id;
	},
	"channels": function(data)
	{
		data = JSON.parse(data);
		
		channels = data;
		var list = $("#channelList");
		
		for (var channel in channels)
		{
			if (channels.hasOwnProperty(channel))
			{
				var div = document.createElement("div");
				div.id = "channelItem" + channel;
				div.className = "channelItem";
				var a = document.createElement("span");
				a.innerHTML = channels[channel];
				a.id = "channelItemText" + channel;
				console.log(a.id);
				a.name = channels[channel];
				
				$(a).click(function() { joinChannel(this.name); });
				
				$(div).append(a);
				list.append(div);
			}
		}
	},
	"tiers": function(data)
	{
		data = JSON.parse(data);
		
		tiers = data;
	},
	"newchannel": function(data)
	{
		data = JSON.parse(data);
		channels[data.id] = data.name;
		var channel = data.id;
		
		var list = $("#channelList");
		var div = document.createElement("div");
		div.id = "channelItem" + channel;
		div.className = "channelItem";
		var a = document.createElement("span");
		a.innerHTML = channels[channel];
		a.id = "channelItemText" + channel;
		console.log(a.id);
		a.name = channels[channel];
		
		$(a).click(function() { joinChannel(this.name); });
		
		$(div).append(a);
		list.append(div);
	},
	"removechannel": function(data)
	{
		delete channels[data];
		
		get("#channelItem" + data).delete();
	},
	"channelplayers": function(data)
	{
		data = JSON.parse(data);
		
		var c = data.channel;
		var p = data.players;
		
		if (!myChannels[c])
		{
			channelPlayers[c] = p;
		}
		else
		{
			for (var i = 0; i < p.length; i++)
			{
				myChannels[c].addPlayer(p[i]);
			}
		}
	},
	"join": function(data)
	{
		var channel = data.split("|")[0];
		var user = data.split("|")[1];
		
		if (user == myInfo.id)
		{
			addChannel(channel);
		}
		
		myChannels[channel].addPlayer(user);
	},
	"leave": function(data)
	{
		var channel = data.split("|")[0];
		var user = data.split("|")[1];
		
		myChannels[channel].removePlayer(user);
		
		if (user == myInfo.id)
		{
			removeChannel(channel);
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
	myInfo.name = $("#name").get(0).value;
	myInfo.color = $("#color").get(0).value;
	
	var ip = $("#advancedConnection").get(0).value;
	ip = ip.substr(ip.lastIndexOf(" - ") + 3);
	
	relay.send("connect", ip);
}

function showAbout()
{
	var about = "Pok&eacute;mon Online Webclient<br />\
		Built by SongSing<br />It's not done yet :)<br />You can help if you want, just ask<br /><br />\
		Credits:<br />\
		jQuery &amp; jQuery UI - Good libraries<br />\
		vex - Good for dialogs (like this one!)<br />\
		jsColor - Lightweight colour picker thing<br />\
		PO - Made registry and servers, and I took a couple of functions and ideas from their webclient<br />\
		pup - My hero and inspiration<br /><br />\
		&copy; 2014 SongSing";
		
	vex.dialog.alert(about);
}

function print(msg, channel)
{
	if (channel === undefined || channel === -1)
	{
		for (var c in myChannels)
		{
			if (myChannels.hasOwnProperty(c))
			{
				print(msg, c);
			}
		}
	}
	else if (myChannels.hasOwnProperty(channel))
	{		
		myChannels[channel].print(msg);
	}
}

function addChannel(channel)
{
	var c = new Channel(channel);
	c.container.id = "channel" + channel;
	
	var li = document.createElement("li");
	li.id = "channelTab" + channel;
	
	var close = "<img src='css/images/close.png' style='width:16px; height:16px; cursor:pointer;' onclick='relay.send(\"leave\", "
		+ channel + "); removeChannel(" + channel + ");'></img>";
	
	li.innerHTML = "<a href='#channel" + channel + "'>" + channels[channel] + "&nbsp;&nbsp;" + close + "</a>";
	
	$("#channelTabs").append(li);
	$("#channelsContainer").append(c.container);
	
	myChannels[channel] = c;
	
	if (channelPlayers[channel])
	{
		var p = channelPlayers[channel];
		for (var i = 0; i < p.length; i++)
		{
			myChannels[channel].addPlayer(p[i]);
		}
	}
	
	$("#channelsContainer").tabs("refresh");
	$("#channelsContainer").tabs("option", "active", $('#channelsContainer >ul >li').size() - 1);
}

function removeChannel(channel)
{
	if (myChannels.hasOwnProperty(channel) || get("#channelTab" + channel))
	{
		myChannels[channel].container.delete();
		get("#channelTab" + channel).delete();
		delete myChannels[channel];
		
		$("#channelsContainer").tabs("refresh");
		$("#channelsContainer").tabs("option", "active", $('#channelsContainer >ul >li').size() - 1);
	}
}

function joinChannel(name)
{
	if (myChannels.hasOwnProperty(channelId(name)))
	{
		$("#channelsContainer").tabs("option", "active", channelId(name));
	}
	else
	{
		relay.send("join", name);
	}
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

function channelId(name)
{
	for (var channel in channels)
	{
		if (channels.hasOwnProperty(channel) && cmp(channels[channel], name))
		{
			return parseInt(channel);
		}
	}
	
	return -1;
}