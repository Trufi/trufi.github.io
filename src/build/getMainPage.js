var templates = require('./getTemplates')();

function getBlogListForTemplate(blogList) {
    return blogList.map(function(el) {
        return el.config;
    });
}

module.exports = function(config) {
    var blogList = require('./getBlogList')(config);

    var strBlogList = templates.articleList({
        list: getBlogListForTemplate(blogList)
    });

    return templates.body({
        blogList: strBlogList
    });
};
