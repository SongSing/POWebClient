function Tabs(onchange)
{
	this.container = document.createElement("div");
	this.container.className = "tabs-container";
	this.onchange = onchange;
	
	this.tabRow = document.createElement("div");
	this.elementContainer = document.createElement("div");
	
	this.tabRow.style.cssText = "position:absolute; top:0px; left:0px; right:0px; height:64px; background:#CCCCCC; overflow:auto;";
	this.elementContainer.style.cssText = "position:absolute; top:64px; left:0px; right:0px; bottom:0px;";
	
	this.tabElements = {};
	this.elements = {};
	
	$(this.container).append(this.tabRow);
	$(this.container).append(this.elementContainer);
	
	var currentIndex = -1;
	
	var _this = this;
	
	this.length = function()
	{
		var ret = 0;
		
		for (var x in _this.tabElements)
		{
			if (_this.tabElements.hasOwnProperty(x))
			{
				ret++;
			}
		}
		
		return ret;
	};
	
	this.update = function()
	{		
		for (var x in _this.tabElements)
		{
			if (_this.tabElements.hasOwnProperty(x))
			{
				_this.tabElements[x].style.width = "auto";
				
				if (_this.tabElements[x].index == _this.currentIndex)
				{
					_this.tabElements[x].style.background = "#EEEEEE";
					_this.tabElements[x].style.color = "black";
				}
				else
				{
					_this.tabElements[x].style.background = "#AAAAAA";
					_this.tabElements[x].style.color = "#666666";
				}
			}
			
			if (_this.elements.hasOwnProperty(x))
			{
				if (_this.tabElements[x].index == _this.currentIndex)
				{
					$(_this.elements[x]).show();
				}
				else
				{
					$(_this.elements[x]).hide();
				}
			}
		}
	};
	
	this.indexOf = function(id)
	{		
		for (var x in _this.tabElements)
		{
			if (_this.tabElements.hasOwnProperty(x))
			{
				var t = _this.tabElements[x];
				
				if (t.tid === id)
				{
					return t.index;
				}
			}
		}
		
		return -1;
	};
	
	this.idOf = function(index)
	{
		for (var x in _this.tabElements)
		{
			if (_this.tabElements.hasOwnProperty(x))
			{
				var t = _this.tabElements[x];
				
				if (t.index === index)
				{
					return t.tid;
				}
			}
		}
		
		return undefined;
	};
	
	this.switchToTab = function(id)
	{
		_this.currentIndex = _this.indexOf(id);
		_this.update();
		
		_this.onchange(id);
	};
	
	this.switchToIndex = function(index)
	{
		_this.currentIndex = index;
		_this.update();
		
		_this.onchange(_this.idOf(index));
	};
	
	this.addTab = function(id, text, element, closefn)
	{
		var te = document.createElement("div");
		te.className = "tabs-tab";
		te.id = "tabs-tab" + id;
		te.style.padding = "12px";
		te.style.setProperty("padding-right", "24px");
		te.style.setProperty("padding-left", "24px");
		te.style.setProperty("box-sizing", "border-box");
		te.style.border = "1px solid #aaaaaa";
		te.style.setProperty("border-bottom-width", "0px");
		te.style.setProperty("border-radius", "5px");
		te.style.setProperty("border-bottom-left-radius", "0px");
		te.style.setProperty("border-bottom-right-radius", "0px");
		te.style.setProperty("margin-left", "4px");
		te.style.setProperty("margin-right", "4px");
		te.style.display = "inline-block";
		te.style.setProperty("line-height", "24px");
		te.style.height = "48px";
		te.style.setProperty("margin-top", "16px");
		te.style.setProperty("font-size", "18px");
		te.style.cursor = "pointer";
		te.style.position = "relative";
		te.tid = id;
		te.index = _this.length();
		te.innerHTML = escapeHTML(text);
		
		var close = document.createElement("img");
		close.src = "css/images/close.png";
		$(close).hover(function() { this.src = "css/images/close-hover.png"; }, function() { this.src = "css/images/close.png" });
		$(close).click(closefn);
		
		close.style.position = "absolute";
		close.style.top = "4px";
		close.style.right = "4px";
		close.style.width = "16px";
		close.style.height = "16px";
		
		$(te).append(close);
		$(close).hide();
		
		$(te).click(function()
		{
			if (_this.tabElements.hasOwnProperty(this.tid))
				_this.switchToTab(this.tid);
		});
		
		$(te).hover(function() { $(close).show(); }, function() { $(close).hide() });
		
		_this.tabElements[id] = te;
		_this.elements[id] = element;
		
		$(_this.tabRow).append(te);
		$(_this.elementContainer).append(element);
		$(element).hide();
		
		_this.switchToTab(id);
	};
	
	this.removeTab = function(id)
	{
		var index = _this.indexOf(id);
		
		if (index >= 0)
		{
			_this.elements[id].remove();
			_this.tabElements[id].remove();
			
			delete _this.elements[id];
			delete _this.tabElements[id];
			
			for (var x in _this.tabElements)
			{
				if (_this.tabElements.hasOwnProperty(x) && _this.tabElements[x].index > index)
				{
					_this.tabElements[x].index--;
				}
			}
			
			if (index >= _this.length())
			{
				index--;
			}
			
			_this.switchToIndex(index);
		}
	};
}