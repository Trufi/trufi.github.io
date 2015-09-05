var path = require('path');
var dot = require('dot');
var fs = require('fs');

var templates = require('./getTemplates')();

module.exports = function(config) {
    var pagePath = path.join(__dirname, '../pages/author');
    var pageFile = fs.readFileSync(path.join(pagePath, 'index.html'), 'utf8');

    var article = {
        text: dot.template(pageFile)(),
        config: require(path.join(pagePath, 'config.json'))
    };

    article.text = templates.article(article);

    return article;
};
