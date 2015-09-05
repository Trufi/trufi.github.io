var path = require('path');
var dot = require('dot');
var fs = require('fs');

var templates = require('./getTemplates')();

module.exports = function(config) {
    var blogPath = path.join(__dirname, '../pages/blog');
    var articleDirNames = fs.readdirSync(blogPath);

    var blogList = articleDirNames.map(function(dirName) {
        var pageFile = fs.readFileSync(path.join(blogPath, dirName, 'index.html'), 'utf8');
        var descriptionFile = fs.readFileSync(path.join(blogPath, dirName, 'description.html'), 'utf8');

        var article = {
            text: dot.template(pageFile)(),
            description: dot.template(descriptionFile)(),
            config: require(path.join(blogPath, dirName, 'config.json'))
        };

        article.config.name = dirName;
        article.config.href = config.serverDistPath + '/blog/' + dirName;

        article.text = templates.article(article);

        return article;
    });

    // TODO: сортировка по дате
    return blogList;
};
