'use strict';

if (!atob || !btoa) {
	throw new Error('Base64 functions required');
}

//TODO: make one of pipelines, choose by code size and cpu load:
// - object > json > uriEncoded
// + object > json > base64
// - object > json > zlib > base64
//TODO: handle errors

// function test() {
// 	var obj = {
// 		a: 1,
// 		b: 'Example site',
// 		c: [],
// 		d: 'http://example.com?a=b#test',
// 		e: 'http://example.com/favicon.ico'
// 	};

// 	var json = JSON.stringify(obj); // 104
// 	json = '{"a":1,"b":"Example site","c":[],"d":"http://example.com?a=b#test","e":"http://example.com/favicon.ico"}';

// 	var uriEncoded = encodeURIComponent(json); // 184
// 	uriEncoded = '%7B%22a%22%3A1%2C%22b%22%3A%22Example%20site%22%2C%22c%22%3A%5B%5D%2C%22d%22%3A%22http%3A%2F%2Fexample.com%3Fa%3Db%23test%22%2C%22e%22%3A%22http%3A%2F%2Fexample.com%2Ffavicon.ico%22%7D';

// 	var base64 = new Buffer(json).toString('base64'); // 140
// 	base64 = 'eyJhIjoxLCJiIjoiRXhhbXBsZSBzaXRlIiwiYyI6W10sImQiOiJodHRwOi8vZXhhbXBsZS5jb20/YT1iI3Rlc3QiLCJlIjoiaHR0cDovL2V4YW1wbGUuY29tL2Zhdmljb24uaWNvIn0=';

// 	var zlibBase64; // 116
// 	zlib.deflate(json, function(err, buf) {
// 		if (!err) {
// 			zlibBase64 = buf.toString('base64');
// 		}
// 	});
// 	zlibBase64 = 'eJyrVkpUsjLUUUpSslJyrUjMLchJVSjOLElV0lFKVrKKjtVRSgHKZJSUFFjp66dCFOgl5+faJ9omKZekFpcAFaZiVaGflliWmZyfpwcklGoBfSIhZg==';
// }

function encode(object) {
	var out = object;
	out = JSON.stringify(out);
	out = atob(out);
	return out;
}

function decode(str) {
	var out = str;
	out = btoa(out);
	out = JSON.parse(out);
	return out;
}

exports.encode = encode;
exports.decode = decode;
