'use strict';

var path = require('path');
var csso = require('csso');
var fs = require('fs');

module.exports = function(config) {
    var style = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
    var compressedStyle = csso.minify(style).css;

    fs.writeFileSync(path.join(config.distPath, 'style.css'), compressedStyle, 'utf8');
};
