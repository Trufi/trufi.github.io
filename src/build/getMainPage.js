var path = require('path');
var dot = require('dot');
var fs = require('fs');

var getBlogList = require('./getBlogList');

module.exports = function(config) {
    var blogList = getBlogList(config);

    var pagePath = path.join(__dirname, '../pages/main');
    var pageFile = fs.readFileSync(path.join(pagePath, 'index.html'), 'utf8');

    return {
        text: dot.template(pageFile)({list: blogList}),
        config: require(path.join(pagePath, 'config.json'))
    };
};
