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
        {text: 'Shorts', href: config.serverDistPath + '/'},
        {text: 'Author', href: config.serverDistPath + '/author'}
    ]
};

var templates = require('./getTemplates')();
var shortsList = require('./getBlogList')(config);

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

// shorts pages
shortsList.forEach(function(blog) {
    var blogPage = templates.main({
        titleHtml: blog.config.titleHtml,
        styleHref: config.serverDistPath + '/style.css',

        header: getHeader(config, blog.config.href),
        footer: footer,
        body: blog.text
    });

    try {
        fs.mkdirSync(path.join(config.distPath, 'shorts', blog.config.name));
    } catch(e) {}

    if (blog.images) {
        try {
            fs.mkdirSync(path.join(config.distPath, 'shorts', blog.config.name, 'images'));
        } catch(e) {}

        blog.images.forEach(function(name) {
            var image = fs.readFileSync(path.join(__dirname, '../pages/shorts', blog.config.name, 'images', name));
            fs.writeFileSync(path.join(config.distPath, 'shorts', blog.config.name, 'images', name), image);
        });
    }

    fs.writeFileSync(path.join(config.distPath, 'shorts', blog.config.name, 'index.html'), blogPage, 'utf8');
});

