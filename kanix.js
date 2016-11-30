/**
 * KAnix v0.1.6 + KASH v0.8b
 * A basic, yet fully fledged, operating system + terminal!
 * -------------
 * Features: Environment, KASH v0.8b CLI, qualifies as an OS emulator, WOOT!
 * @TODO: Add JS and bug fixes (v0.1.8 + v0.8c)
 *		Release?
 * @CHANGES: Multiple bug fixes to KASH v0.8a and KAnix v0.1.5, added scrolling to CLI, added `help` command to KASH
 * 
 * MAJOR RELEASES (since environment addition)
 * v0.1.0: Environment!
 * v0.1.1: System calls!
 * v0.1.2: Basic CLI, and KASH v0 support and parser
 * v0.1.3 + v0.1: Environment additions to KASH
 * v0.1.4 + v0.7: Added `mkdir` system call and KASH command, concluding full R2W2 KAnix environment support!
 * v0.1.5 + v0.8: Added `executable`, `exec` KAnix system calls and `cd`, `kash` KASH commands, concluding full R2W2X environment support!
 *				Also included support for newlines in KASH strings.
 * v0.1.6 + v0.8b: Added scrolling capability to CLI and `help` KASH command
*/

var $ = {
	USER: "guest",
	PWD: "/"
};
var user = function () {
	return $.USER;
};
var pwd = function () {
	return $.PWD;
};

var filesystem = {};

// Takes relative or absolute path as parameter p.
// Returns path array.
var path = function (p) {
	var k = p.split("/");
	
	if (pwd() !== "/" && k[0] !== "") {
		k = pwd().split("/").concat(k);
	}
	
	return k.filter(function (a) { return a; });
};
// Takes file/directory object, returns boolean corresponding to if user has read access to directory / file. If non-existent, return 778.
var readable = function (o) {
	if (!o.owner || !o.group) {
		return 778;
	}
	
	return (o.owner === user() && floor(o.perms / 100) > 3) ||
		(o.owner !== user() && o.group.indexOf(user()) > -1 && floor((o.perms % 100) / 10) > 3) ||
		(o.owner !== user() && o.group.indexOf(user()) < 0 && (o.perms % 10) > 3);
};
// Takes file/directory object, returns boolean corresponding to if user has write access to directory / file. If non-existent, return 778.
var writable = function (o) {
	if (!o.owner || !o.group) {
		return 778;
	}
	
	return (o.owner === user() && (floor(o.perms / 100) % 4) > 1) ||
		(o.owner !== user() && o.group.indexOf(user()) > -1 && (floor((o.perms % 100) / 10) % 4) > 1) ||
		(o.owner !== user() && o.group.indexOf(user()) < 0 && ((o.perms % 10) % 4) > 1);
};
// Takes file/directory object, returns boolean corresponding to if user has exec access to directory / file. If non-existent, return 778.
var executable = function (o) {
	if (!o.owner || !o.group) {
		return 778;
	}
	
	return (o.owner === user() && (floor(o.perms / 100) % 2) > 0) ||
		(o.owner !== user() && o.group.indexOf(user()) > -1 && (floor((o.perms % 100) / 10) % 2) > 0) ||
		(o.owner !== user() && o.group.indexOf(user()) < 0 && ((o.perms % 10) % 2) > 0);
};
// Takes path array, returns file or directory object. If not allowed, return 1. If non-existent, return 2.
var getPath = function (p) {
	var cur = filesystem;
	
	for (var i = 0; i < p.length; i ++) {
		if (cur[p[i]]) {
			cur = cur[p[i]];
		} else {
			return 2;
		}
		
		if (!readable(cur)) {
			return 1;
		}
	}
	
	return cur;
};

// Duh. a = path, t = text, o = owner, g = group, p = perms in numeric form
var File = function (a, t, o, g) {
	this.path = path(a, pwd());
	this.type = "-";
	this.owner = o || user();
	this.group = g || [this.owner];
	this.text = t;
	this.perms = 644;
};

// Push file to filesystem, if non-existent path, return 2, if non-writable path, return 1, else return nothing
File.prototype.init = function () {
	var cur = filesystem;
	var p = this.path.slice(0, -1);
	
	for (var i = 0; i < p.length; i ++) {
		if (cur[p[i]]) {
			cur = cur[p[i]];
		} else {
			return 2;
		}
		
		if (!writable(cur)) {
			return 1;
		}
	}
	
	// Since p.length is this.path.length - 1, this works
	cur[this.path[p.length]] = this;
};
// Read method. Returns text property. If not allowed, return 1
File.prototype.read = function () {
	return readable(this) ? this.text : 1;
};
// Write method. Takes text, returns nothing unless not allowed, in which case returns 1
File.prototype.write = function (t) {
	if (!writable(this)) {
		return 1;
	}
	
	this.text = t;
};
// Change permissions on file. If not allowed, return 1, else return nothing
File.prototype.chmod = function (p) {
	if (!writable(this)) {
		return 1;
	}
	
	this.perms = p;
};

// Directory constructor. a = path, o = owner, g = group, p = perms in numeric form
var Directory = function (a, o, g, p) {
	this.path = path(a, pwd());
	this.type = "d";
	this.owner = o || user();
	this.group = g || [this.owner];
	this.perms = p === undefined ? 644 : p;
	this.files = {};
};

// Push dir to filesystem, if non-existent path, return 2, if non-writable path, return 1, else return nothing
Directory.prototype.init = function () {
	var cur = filesystem;
	var p = this.path.slice(0, -1);
	
	for (var i = 0; i < p.length; i ++) {
		if (cur[p[i]]) {
			cur = cur[p[i]];
		} else {
			return 2;
		}
		
		if (!writable(cur)) {
			return 1;
		}
	}
	
	// Since p.length is this.path.length - 1, this works
	cur[this.path[p.length]] = this.files;
};

// KASH engine

var commands = {};

// Return result of command or error. Core process.
var kash = function (t) {
	var c = [""];
	var s = true;
	
	for (var i = 0; i < t.length; i ++) {
		var a = t[i];
		var b = t[i + 1] || 1;
		var e = t[i - 1] || 1;
		var d = c.length - 1;
		
		if (b === 1) {
			if (a !== "\"") {
				c[d] += a;
			}
			break;
		}
		
		if (a === "\\") {
			if (b === "\"" || b === "\\") {
				c[d] += b;
			} else if (b === "n") {
				c[d] += "\n";
			} else{
				c[d] += "\\" + b;
			}
			
			i ++;
			continue;
		} else if (a === "\"" && e !== "\\") {
			s = !s;
			
			if (e === 1) {
				return ["KASH: error: line starts with string\n"];
			}
			
			continue;
		}
		
		if (s && a === " ") {
			c.push("");
		} else {
			c[d] += a;
		}
	}
	
	var r = c.shift();
	
	if (t.replace(/ /g, "") === "") {
		return "";
	}
	
	if (!commands[r]) {
		return ["KASH: error: command doesn't exist\n"];
	}
	
	return commands[r](c);
};

// System calls

// Read from path string. If not allowed, return 1, if non-existent or path invalid, return 2, if directory, return 3.
var read = function (p) {
	p = pwd() === "/" ? p : (pwd() + p).replace("//", "g");
	
	var o = getPath(path(p));
	return o instanceof File ? o.read() : o;
};
// Write to path string p, text t. If not allowed, return 1, if path invalid, return 2, if directory, return 3, else return nothing.
var write = function (p, t) {
	p = pwd() === "/" ? p : (pwd() + p).replace("//", "g");
	
	var o = getPath(path(p));
	
	if (o === 2) {
		return new File(p, t).init();
	} else {
		return o instanceof File ? o.write(t) : o instanceof Directory ? 3 : o;
	}
};
// Execute contents of file as KASH code. Takes path string. Output result. If not allowed, return 1, if path invalid, return 2, if directory, return 3.
var exec = function (p) {
	p = pwd() === "/" ? p : (pwd() + p).replace("//", "g");
	
	var o = getPath(path(p));
	
	if (o instanceof File) {
		if (!executable(o)) {
			return 1;
		}
		
		var t = o.read().split("\n");
		var s = "";
		
		for (var i = 0; i < t.length; i ++) {
			var k = kash(t[i]);
			
			if (typeof k === "object") {
				return k;
			}
			
			s += k;
		}
		
		return s;
	} else if (o instanceof Directory) {
		return 3;
	} else {
		return o;
	}
};
// Chmod path string p, permissions m. If not allowed, return 1, if non-existent or path invalid, return 2.
var chmod = function (p, m) {
	p = pwd() === "/" ? p : (pwd() + p).replace("//", "g");
	
	var o = getPath(path(p));
	return o instanceof File ? o.chmod(m) : o;
};
// mkdir directory, self explanatory. If not allowed, return 1, if path invalid, return 2
var mkdir = function (p) {
	p = pwd() === "/" ? p : (pwd() + p).replace("//", "g");
	
	var a = getPath(path(p).slice(0, -1));
	
	if (typeof a === "number") {
		return a;
	}
	
	var c = new Directory(p).init();
	return c ? c : "";
};

// JavaScript interpretation
var javascript;

/* jslint ignore:start */
javascript = function (s) {
	return eval([
		"(function () {",
		"	try {",
				 s,
		"		return main();",
		"	} catch (e) {",
		"		console.log(e);",
		"		return [\"KASH: JS error. Check console.\\n\"];",
		"	}",
		"})();"
	].join("\n"));
};
/* jslint ignore:end */

// Basing KASH commands on system calls
commands = {
	cat: function (a) {
		return a[0] ? read(a[0]) : "";
	},
	chmod: function (a) {
		var c = chmod(a[0], a[1]);
		return c || "";
	},
	cd: function (a) {
		$.PWD = a[0] ? a[0][0] === "/" ? a[0] : $.PWD + a[0] + "/" : "/";
		return "";
	},
	echo: function (a) {
		if (!a[0]) {
			return "";
		}
		
		return a.join(" ") + "\n";
	},
	help: function (a) {
		if (!a[0] || a[0] < 2) {
			return [
				"KASH help (Page 1)",
				"---------",
				"KASH syntax",
				"",
				"KASH code looks like this:",
				"<command> [arg1] [arg2] ...",
				"i.e. in the code",
				"echo Hi there!",
				"The command is `echo`, and the arguments are `Hi` and `there!`",
				"You can also write:",
				"echo \"Hi there!\"",
				"The double quotes form a string.",
				"In this line, the argument is `Hi there!`",
				""
			].join("\n");
		} else if (a[0] < 3) {
			return [
				"KASH help (Page 2)",
				"---------",
				"KASH commands",
				"",
				"At the time of writing (v0.1.7 + v0.9), KASH has 11 commands:",
				"	cat <file-name>: Print contents of a file.",
				"	cd <dir-name>: Move into a directory.",
				"				   Just like double-clicking a folder.",
				"	chmod <file-name> <permissions>: Change permissions on a file.",
				"		   Default permissions are 644, which forbids running of file.",
				"		   If you want absolute control, change the permission to 777.",
				"	echo <text>: Print text.",
				"	help <page>: Show specified help page.",
				"	js <file-name>: Run file as JavaScript.",
				"	kash <file-name>: Run the file as KASH code.",
				"	ls [dir-name]: List the contents of directory.",
				"				   Defaults to current directory.",
				"	mkdir <dir-name>: Create directory. If it exists, delete it first.",
				"	ow <file-name> <text>: Overwrite file with text.",
				"						   If it doesn't exist, create it.",
				"	touch <file-name>: Create empty file. If it exists, delete first.",
				""
			].join("\n");
		}
	},
	js: function (a) {
		var k = getPath(path(a[0]));
	},
	kash: function (a) {
		if (!a[0]) {
			return "";
		}
		
		return exec(a[0]);
	},
	ls: function (a) {
		var s = "";
		var k = a[0] || pwd();
		
		for (var i in getPath(path(k))) {
			s += i + "\n";
		}
		
		return s;
	},
	mkdir: function (a) {
		if (!a[0]) {
			return "";
		}
		
		var m = mkdir(a[0]);
		return m || "";
	},
	ow: function (a) {
		if (!a[0]) {
			return "";
		}
		
		var w = write(a[0], a[1]);
		return w || "";
	},
	touch: function (a) {
		if (!a[0]) {
			return "";
		}
		
		var w = write(a[0], "");
		return w || "";
	}
};

module.exports = kash;
