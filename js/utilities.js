String.prototype.args = function()
{
	var arg = arguments;
	
	var ret = this;
	
	ret = ret.replace(/(%[0-9]+)/g, "($1)"); // for %10 etc
	
	for (var i = 0; i < arg.length; i++)
	{	
		ret = ret.replace(new RegExp("\\(%" + (i + 1) + "\\)", "g"), arg[i].toString());
	}
	
	return ret;
};

function cmp(x1, x2)
{
	if (typeof x1 !== typeof x2)
	{
		return false;
	}
	else if (typeof x1 === "string")
	{
		if (x1.toLowerCase() === x2.toLowerCase())
		{
			return true;
		}
	}
	return x1 === x2;
}

Array.prototype.indexOf = function (item, caseSensitive)
{	
	if (caseSensitive === undefined)
	{
		caseSensitive = false;
	}

	for (var i = 0; i < this.length; i++)
	{
		if ((cmp(this[i], item) && !caseSensitive) || this[i] === item)
		{
			return i;
		}
	}

	return -1;
};

Array.prototype.format = function(fn, num)
{
	var ret = [];
	
	if (!num)
	{
		num = false;
	}
		
	for (var i = 0; i < this.length; i++)
	{
		var formatted = eval('"' + fn.replace(/%i/g, this[i]) + '"'); // quotes or it thinks its a var hahas
		
		if (num)
			formatted = parseFloat(num);
			
		ret.push(formatted);
	}
	
	return ret;
};

Array.prototype.copy = function()
{
	return this.slice(0);
};

Array.prototype.randomItem = function()
{
	if (this.length === 0)
		return undefined;
		
	var r = Utilities.randomInt(this.length);
	
	return this[r];
};

Array.prototype.clean = function(deleteValue)
{
	if (deleteValue)
	{
		var ret = this.copy();
		for (var i = 0; i < ret.length; i++)
		{
			if (ret[i] == deleteValue)
			{         
				ret.splice(i, 1);
				i--;
			}
		}
		
		return ret;
	}
	else
	{
		var ret = this.copy();
		for (var i = 0; i < ret.length; i++)
		{
			if (!ret[i])
			{
				ret.splice(i, 1);
				i--;
			}
		}
		
		return ret;
	}
};

Array.prototype.reverse = function()
{
	var ret = [];
	
	for (var i = this.length - 1; i >= 0; i--)
	{
		ret.push(this[i]);
	}
	
	return ret;
}

String.prototype.indexOf = function(str)
{
	if (str === undefined || str.length === 0 || str.length > this.length)
		return -1;
	if (cmp(str, this))
		return 0;

	for (var i = 0; i < this.length; i++)
	{
		if (cmp(this.substr(i, str.length), str))
		{
			return i;
		}
	}

	return -1;
};

String.prototype.startsWith = function(text, ins)
{
	if (ins === undefined)
		ins = false;
		
	var str = this;
	
	if (text.length > str.length)
		return false;
	
	if (!ins)
		return str.substr(0, text.length) === text;
	else
		return cmp(str.substr(0, text.length), text)
};

String.prototype.startsWithOne = function(arr, ins)
{
	var arg = arr;
	
	for (var i = 1; i < arg.length; i++)
	{
		if (this.startsWith(arg[i], ins))
		{
			cache.startsWithWhich = arg[i];
			return true;
		}
	}
	
	return false;
};

String.prototype.endsWith = function(text, ins)
{
	if (ins === undefined)
		ins = false;
		
	var str = this;
	
	if (text.length > str.length)
		return false;
		
	if (!ins)
		return str.substr(str.length - text.length) === text;
	else
		return cmp(str.substr(str.length - text.length), text);
};

String.prototype.trimString = function(str)
{
	if (str === undefined)
		str = " ";
		
	var ret = this;
	
	while (ret.startsWith(str))
	{
		if (ret.length < str.length)
		{
			return ret;
		}
		
		ret = ret.substr(str.length);
	}
	
	while(ret.endsWith(str))
	{
		if (ret.length < str.length)
		{
			return ret;
		}
		
		ret = ret.substr(0, ret.length - str.length);
	}
	
	return ret;
};

String.prototype.contains = function(str)
{
	return this.indexOf(str) !== -1;
};

Array.prototype.contains = function(item)
{
	return this.indexOf(item) !== -1;
};