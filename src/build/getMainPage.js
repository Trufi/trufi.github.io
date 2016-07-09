var path = require('path');
var dot = require('dot');
var fs = require('fs');

module.exports = function(config, articleList) {
    var pagePath = path.join(__dirname, '../pages/main');
    var pageFile = fs.readFileSync(path.join(pagePath, 'index.html'), 'utf8');

    // sort articles by date
    articleList = articleList.slice().sort(function(a, b) {
        var dateA = new Date(a.config.date.split('.').reverse());
        var dateB = new Date(b.config.date.split('.').reverse());
        return dateB - dateA;
    });

    return {
        text: dot.template(pageFile)({list: articleList}),
        config: require(path.join(pagePath, 'config.json'))
    };
};
