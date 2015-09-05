var path = require('path');
var fs = require('fs');

module.exports = function(config) {
    var blogPath = path.join(__dirname, '../pages/blog');
    var articleDirNames = fs.readdirSync(blogPath);

    var blogList = articleDirNames.map(function(dirName) {
        var article = {
            html: fs.readFileSync(path.join(blogPath, dirName, 'index.html'), 'utf8'),
            config: require(path.join(blogPath, dirName, 'config.json'))
        };

        article.config.name = dirName;
        article.config.href = config.serverDistPath + '/blog/' + dirName;

        return article;
    });

    // TODO: сортировка по дате
    return blogList;
};
