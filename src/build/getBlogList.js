var path = require('path');
var dot = require('dot');
var fs = require('fs');

var templates = require('./getTemplates')();

module.exports = function(config) {
    var blogPath = path.join(__dirname, '../pages/short');
    var articleDirNames = fs.readdirSync(blogPath);

    var blogList = articleDirNames.map(function(dirName) {
        var articlePath = path.join(blogPath, dirName);
        var pageFile = fs.readFileSync(path.join(articlePath, 'index.html'), 'utf8');
        var descriptionFile = fs.readFileSync(path.join(articlePath, 'description.html'), 'utf8');

        var article = {
            text: dot.template(pageFile)(),
            description: dot.template(descriptionFile)(),
            config: require(path.join(articlePath, 'config.json'))
        };

        article.config.name = dirName;
        article.config.href = config.serverDistPath + '/short/' + dirName;

        article.text = templates.article(article);

        var articleDirectoryNames = fs.readdirSync(path.join(articlePath));

        // add article images
        if (articleDirectoryNames.indexOf('images') !== -1) {
            article.images = fs.readdirSync(path.join(articlePath, 'images'));
        }

        return article;
    });

    // remove drafts from list
    blogList = blogList.filter(function(blog) {
        return !blog.config.draft;
    });

    // TODO: сортировка по дате
    return blogList;
};
