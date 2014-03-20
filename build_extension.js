'use strict';

var fs = require('fs');

function castVersion(){
	var package_file = require('./package.json');
	var manifest_file = require('./skeleton/manifest.json');
	
	manifest_file.version = package_file.version;
	
	fs.writeFileSync('./out/manifest.json', JSON.stringify(manifest_file));
}

castVersion();
