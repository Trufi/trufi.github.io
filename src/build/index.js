var path = require('path');
var fs = require('fs');

var getMainPage = require('./getMainPage');
var getAuthorPage = require('./getAuthorPage');
var getHeader = require('./getHeader');
var saveStyle = require('./saveStyle');

var config = {
    distPath: path.join(__dirname, '../..'),
    serverDistPath: ''
};

config.topMenu = {
    tabs: [
        {text: 'Блог', href: config.serverDistPath + '/'},
        {text: 'Автор', href: config.serverDistPath + '/author'}
    ]
};

var templates = require('./getTemplates')();
var blogList = require('./getBlogList')(config);

saveStyle(config);

var footer = templates.footer();

// main page
var mainPage = getMainPage(config);
var mainPageHtml = templates.main({
    titleHtml: mainPage.config.titleHtml,
    styleHref: config.serverDistPath + '/style.css',

    header: getHeader(config, config.serverDistPath),
    footer: footer,
    body: mainPage.text
});
fs.writeFileSync(path.join(config.distPath, 'index.html'), mainPageHtml, 'utf8');

// author page
var authorPage = getAuthorPage(config);
var authorPageHtml = templates.main({
    titleHtml: authorPage.config.titleHtml,
    styleHref: config.serverDistPath + '/style.css',

    header: getHeader(config, config.serverDistPath + '/author'),
    footer: footer,
    body: authorPage.text
});
fs.writeFileSync(path.join(config.distPath, 'author.html'), authorPageHtml, 'utf8');

// blog pages
blogList.forEach(function(blog) {
    var blogPage = templates.main({
        titleHtml: blog.config.titleHtml,
        styleHref: config.serverDistPath + '/style.css',

        header: getHeader(config, blog.config.href),
        footer: footer,
        body: blog.text
    });

    fs.writeFileSync(path.join(config.distPath, 'blog', blog.config.name + '.html'), blogPage, 'utf8');
});

