function Channel(id)
{
	/*
	<div id="chat"></div>
	<div id="players"></div>
	<input id="chatInput" type="text" />
	<div id="sendChatButton">Send</div>
	*/
	
	
	this.id = id;
	this.container = document.createElement("div");
	this.chat = document.createElement("div");
	this.players = document.createElement("div");
	this.input = document.createElement("input");
	this.sendButton = document.createElement("div");
	
	this.playerArray = [];
	
	this.input.type = "text";
	
	this.container.className = "channelContainer";
	this.chat.className = "channelChat";
	this.players.className = "channelPlayers";
	this.input.className = "channelInput";
	this.sendButton.className = "channelSendButton";
	
	var c = $(this.container);
	
	c.append(this.chat);
	c.append(this.players);
	c.append(this.input);
	c.append(this.sendButton);
	
	this.sendButton.innerHTML = "Send";
	
	this.sendLine = function()
	{
		var toSend = _this.input.value;
		
		if (toSend)
		{
			_this.input.value = "";
			relay.send("chat", { "channel": _this.id, "message": toSend });
		}
	};
	
	$(this.sendButton).button();
	$(this.sendButton).click(this.sendLine);
	$(this.input).keypress(function(e)
	{
		if (e.which === 13)
		{
			_this.sendLine();
		}
	});
	
	var _this = this;
	
	this.print = function(msg)
	{
		var div = document.createElement("div");
		div.innerHTML = msg;
		$(_this.chat).append(div);
		scrollToBottom(_this.chat);
	};
	
	this.addPlayer = function(id)
	{
		var player = players[id];
		
		if (player === undefined)
		{
			console.log("Tried to add undefined player with id %1 to channel %2".args(id, _this.id));
			return;
		}
		
		if (!_this.playerArray.contains(id))
		{
			_this.playerArray.push(id);
			_this.print(timestamp() + " " + player.name + " joined the channel.");
		}
		
		if (get("#player" + id + "channel" + _this.id) === undefined)
		{
			var div = document.createElement("div");
			div.id = "player" + id + "channel" + _this.id;
			div.pname = player.name;
			div.className = "playerListItem";
			div.innerHTML = "<span style='color:%1;'><b>%2</b></span>".args(player.color, escapeHTML(player.name));
			
			if ($(_this.players).children().length > 0)
			{
				var names = [];
				
				for (var i = 0; i < _this.playerArray.length; i++)
				{
					names.push(players[_this.playerArray[i]].name);
				}
				
				names.sort(function(a, b)
				{
					return a.localeCompare(b);
				});
				
				var index = names.indexOf(player.name);
				
				if (index === 0)
				{
					$(_this.players).prepend(div);
				}
				else
				{
					$("#player" + playerId(names[index - 1]) + "channel" + _this.id).after(div);
				}
			}
			else
			{
				$(_this.players).append(div);
			}
		}
	};
	
	this.removePlayer = function(id)
	{
		this.playerArray.splice(this.playerArray.indexOf(id), 1);
		var player = players[id];
		get("#player%1channel%2".args(id, _this.id)).delete();
		_this.print(timestamp() + " " + player.name + " left the channel.");
	};
}