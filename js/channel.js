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
		this.playerArray.push(id);
		var player = players[id];
		$(_this.players).append("<div id='player%3channel%4'><span style='color:%1;'><b>%2</b></span></div>".args(player.color, player.name, id, _this.id));
		_this.print(timestamp() + " " + player.name + " joined the channel.");
	};
	
	this.removePlayer = function(id)
	{
		this.playerArray.splice(this.playerArray.indexOf(id), 1);
		var player = players[id];
		get("#player%1channel%2".args(id, _this.id)).delete();
		_this.print(timestamp() + " " + player.name + " left the channel.");
	};
}