"use strict";

/*
 Wrapper around Chrome storage API
 Provides API similar to used in Node.js
*/

var inherits = require("util").inherits;
var EventEmitter = require("events").EventEmitter;

//TODO: make `local-sync` syncronyzation
//TODO: use timestamp to synchronize `local` and `sync`

function Storage(options) {
	var self = this;
	EventEmitter.call(self);

	self.area = options.area || "local";
	self.listening = false;
	self.listener = function(changes, area) {
		if (area !== self.area) {return; }
		self.emit("change", changes);
	};
	self.on("newListener", function() {
		if (self.listening) {return; }

		self.listening = true;
		chrome.storage.onChanged.addListener(self.listener);
	});
	self.on("removeListener", function() {
		if (!self.listening) {return; }
		if (self.listeners("change").length) {return; }

		self.listening = false;
		chrome.storage.onChanged.removeListener(self.listener);
	});
}
inherits(Storage, EventEmitter);

Storage.prototype.set = function(items, cb) {
	var self = this;
	chrome.storage[self.area].set(items, function() {
		if (runtime.lastError) {
			return cb(runtime.lastError);
		}

		return cb(null);
	});
};

Storage.prototype.get = function(keys, cb) {
	var self = this;
	chrome.storage[self.area].get(keys, function(res) {
		if (runtime.lastError) {
			return cb(runtime.lastError);
		}

		return cb(null, res);
	});
};

Storage.prototype.remove = function(keys, cb) {
	var self = this;
	chrome.storage[self.area].remove(keys, function() {
		if (runtime.lastError) {
			return cb(runtime.lastError);
		}

		return cb(null);
	});
};

Storage.prototype.getBytesInUse = function(keys, cb) {
	var self = this;
	chrome.storage[self.area].getBytesInUse(keys, function(size) {
		if (runtime.lastError) {
			return cb(runtime.lastError);
		}

		return cb(null, size);
	});
};

Storage.prototype.clear = function(cb) {
	var self = this;
	chrome.storage[self.area].clear(function() {
		if (runtime.lastError) {
			return cb(runtime.lastError);
		}

		return cb(null);
	});
}

module.exports = Storage;
