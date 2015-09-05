var path = require('path');
var fs = require('fs');

var getTemplates = require('./getTemplates');
var getBlogList = require('./getBlogList');

var config = {
    distPath: path.join(__dirname, '../../dist'),
    serverDistPath: 'dist'
};

var templates = getTemplates();

var topMenu = {
    tabs: [
        {text: 'Blog', href: config.serverDistPath + '/blog'},
        {text: 'About', href: config.serverDistPath + '/about'}
    ]
};

var header = templates.header({
    topMenu: topMenu
});

var footer = templates.footer();

var blogList = getBlogList();

function getBlogListForTemplate(blogList) {
    return blogList.map(function(el) {
        return el.config;
    });
}

var strBlogList = templates.articleList({
    list: getBlogListForTemplate(blogList)
});

var body = templates.body({
    blogList: strBlogList
});

var main = templates.main({
    title: 'main page',
    header: header,
    footer: footer,
    body: body
});

fs.writeFileSync(path.join(config.distPath, 'index.html'), main, 'utf8');
