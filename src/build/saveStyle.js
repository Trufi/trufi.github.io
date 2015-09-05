var path = require('path');
var fs = require('fs');

module.exports = function(config) {
    var style = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

    fs.writeFileSync(path.join(config.distPath, 'style.css'), style, 'utf8');
};
