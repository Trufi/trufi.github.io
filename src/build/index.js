var path = require('path');
var dot = require('dot');
var fs = require('fs');

var distPath = path.join(__dirname, '../..');
var templatesPath = path.join(__dirname, '../templates');

var mainTemplate = fs.readFileSync(path.join(templatesPath, 'main.html'), 'utf8');
var mainTemplateFunc = dot.template(mainTemplate);

var result = mainTemplateFunc({header: 'lol', footer: 'asd', body: 'tr'});

console.log(result);

