'use strict';

var fs = require('fs');
var child_process = require('child_process');
var async = require('async');
var browserify = require('browserify');


var packageFile = require('./package.json');

var DIR_EXPORT = __dirname + '/out/';
var DIR_SOURCE = __dirname + '/src/';
var DIR_SKELETON = __dirname + '/skeleton/';


function cleanOut(cb) {
	var list = fs.readdirSync(DIR_EXPORT);
	async.map(list, function(filename, cb) {
		var cmd = 'rm -R ';
		cmd += '"' + DIR_EXPORT + filename + '"';

		console.log(cmd);
		child_process.exec(cmd, cb);
	}, cb);
}

function copySkeleton(cb) {
	var cmd = 'cp -R ';
	cmd += '"' + DIR_SKELETON + '" ';
	cmd += '"' + DIR_EXPORT + '"';

	console.log(cmd);
	child_process.exec(cmd, cb);
}

function castVersion(cb) {
	var src = require(DIR_SKELETON + 'manifest.json');
	var name = DIR_EXPORT + 'manifest.json';
	var data;

	src.version = packageFile.version;

	data = JSON.stringify(src);

	//TODO: make pretty output
	fs.writeFile(name, data, cb);
}

function compileScripts(cb) {
	var list = fs.readdirSync(DIR_SOURCE);
	async.map(list, function(filename, cb) {
		var b;
		var streamFrom, streamTo;

		b = browserify(DIR_SOURCE + filename);

		streamFrom = b.bundle();
		streamFrom.on('error', cb);

		streamTo = fs.createWriteStream(DIR_EXPORT + filename);
		streamTo.on('error', cb);
		streamTo.on('finish', cb);

		streamFrom.pipe(streamTo);
	}, cb);
}

async.series([
	cleanOut,
	copySkeleton,
	castVersion,
	compileScripts
], function(err) {
	if (err) {
		console.log(err);
		return process.exit(-1);
	}

	console.log('All done');
	return process.exit(0);
});
