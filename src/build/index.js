var ncp = require('ncp').ncp;
var path = require('path');
var fs = require('fs');

var getMainPage = require('./getMainPage');
var getAuthorPage = require('./getAuthorPage');
var getHeader = require('./getHeader');
var saveStyle = require('./saveStyle');

var config = {
    distPath: path.join(__dirname, '../..'),
    serverDistPath: '',
    serverAbsoluteDistPath: 'https://trufi.github.io',
    sourcePath: 'https://github.com/Trufi/trufi.github.io/blob/master'
};

config.topMenu = {
    tabs: [
        {text: 'Short', href: config.serverDistPath + '/'},
        {text: 'Long', disable: true},
        {text: 'Author', href: config.serverDistPath + '/author'}
    ]
};

var templates = require('./getTemplates')();
var shortList = require('./getBlogList')(config);

saveStyle(config);

var footer = templates.footer();

// main page
var mainPage = getMainPage(config);
var mainPageHtml = templates.main({
    titleHtml: mainPage.config.titleHtml,
    description: "Вебные заметки @trufid",
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
    description: "Вебные заметки @trufid",
    styleHref: config.serverDistPath + '/style.css',

    header: getHeader(config, config.serverDistPath + '/author'),
    footer: footer,
    body: authorPage.text
});
fs.writeFileSync(path.join(config.distPath, 'author.html'), authorPageHtml, 'utf8');

// short pages
shortList.forEach(function(blog) {
    var blogPage = templates.main({
        titleHtml: blog.config.titleHtml,
        description: blog.config.description,
        styleHref: config.serverDistPath + '/style.css',

        pageHref: config.serverDistPath + '/short',
        pageAbsoluteHref: config.serverAbsoluteDistPath + '/short',

        header: getHeader(config, blog.config.href),
        footer: footer,
        body: blog.text
    });

    try {
        fs.mkdirSync(path.join(config.distPath, 'short', blog.config.name));
    } catch(e) {}

    // копируем ассеты
    ncp(
        path.join(__dirname, '../pages/short', blog.config.name, 'assets'),
        path.join(config.distPath, 'short', blog.config.name, 'assets'),
        function (error) {
            if (error) {
                return console.error(error);
            }
    });

    fs.writeFileSync(path.join(config.distPath, 'short', blog.config.name, 'index.html'), blogPage, 'utf8');
});

