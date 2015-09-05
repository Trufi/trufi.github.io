var path = require('path');
var dot = require('dot');
var fs = require('fs');

module.exports = function() {
    var blogPath = path.join(__dirname, '../pages/blog');
    var articleDirNames = fs.readdirSync(blogPath);

    var result = articleDirNames.map(function(dirName) {
        var article = {
            html: fs.readFileSync(path.join(blogPath, dirName, 'index.html'), 'utf8'),
            config: require(path.join(blogPath, dirName, 'config.json'))
        };

        article.config.href = dirName;

        return article;
    });

    // TODO: сортировка по дате

    return result;
};
