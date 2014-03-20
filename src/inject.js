'use strict';

var coder = require('./lib/coder');

var params;
var messsageHandlers = {};

function setTitle(title) {
	document.title = title;
}

function setFavicon(url) {
	var link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'icon';
	link.href = url;
	document.getElementsByTagName('head')[0].appendChild(link);
}

function subscribe() {
	chrome.extension.onRequest.addListener(function(request, sender, response) {
		if (!messsageHandlers[request.cmd]) {
			return response(makeResponse(request.cmd, null, 'no handler'));
		}

		messsageHandlers[request.cmd](request, sender, response);
	});
}

function makeResponse(cmd, result, error) {
	var out = {};
	out.cmd = cmd;
	if (result !== undefined) {
		out.result = result;
	}
	if (error !== undefined) {
		out.error = error;
	}
}

messsageHandlers.unpark = function(request, sender, response) {
	if (history.length < 2 && !params.url) {
		return response(makeResponse(request.cmd, null, 'empty history, no params.url'));
	}

	response(makeResponse(request.cmd));
	if (history.length < 2) {
		return location.assign(params.url);
	}

	return history.back();
}


// old location: https://tabmemfree.appengine.com/blank.html#title=___&icon=___
// new location: https://tabmemfree.appengine.com/blank.html#JSON
//TODO: support transition from old location format
//TODO: support favicon greyscaling
function load() {
	var hash = (hash.length) ? hash.substr(1) : '';

	try {
		params = coder.decode(hash) || {};
	} catch (e) {
		params = {};
	}

	setTitle(params.title || params.url);
	if (params.icon) {
		setFavicon(params.icon);
	}
	subscribe();
}

load();
