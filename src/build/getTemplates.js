var path = require('path');
var dot = require('dot');
var fs = require('fs');

module.exports = function() {
    var templatesPath = path.join(__dirname, '../templates');
    var templateNames = fs.readdirSync(templatesPath);
    var result = {};

    templateNames.forEach(function(name) {
        var templateText = fs.readFileSync(path.join(templatesPath, name), 'utf8');

        // remove .html
        result[name.slice(0, -5)] = dot.template(templateText);
    });

    return result;
};
