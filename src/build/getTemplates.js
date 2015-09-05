var path = require('path');
var dot = require('dot');
var fs = require('fs');

var templatesPath = path.join(__dirname, '../templates');
var templateNames = fs.readdirSync(templatesPath);
var templates = {};

templateNames.forEach(function(name) {
    var templateText = fs.readFileSync(path.join(templatesPath, name), 'utf8');

    // remove .html
    templates[name.slice(0, -5)] = dot.template(templateText);
});

module.exports = function() {
    return templates;
};
