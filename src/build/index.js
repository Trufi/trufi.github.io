var path = require('path');
var fs = require('fs');

var getMainPage = require('./getMainPage');
var saveStyle = require('./saveStyle');

var config = {
    distPath: path.join(__dirname, '../../dist'),
    serverDistPath: '/dist'
};

config.topMenu = {
    tabs: [
        {text: 'Блог', href: config.serverDistPath},
        {text: 'Автор', href: config.serverDistPath + '/about'}
    ]
};

var templates = require('./getTemplates')();
var blogList = require('./getBlogList')(config);

saveStyle(config);

var header = templates.header({
    topMenu: config.topMenu
});

var footer = templates.footer();

// main page
var mainPageBody = getMainPage(config);
var mainPage = templates.main({
    title: 'Trufi.github.io',
    styleHref: config.serverDistPath + '/style.css',

    header: header,
    footer: footer,
    body: mainPageBody
});
fs.writeFileSync(path.join(config.distPath, 'index.html'), mainPage, 'utf8');

blogList.forEach(function(blog) {
    var blogPage = templates.main({
        title: blog.config.title,
        styleHref: config.serverDistPath + '/style.css',

        header: header,
        footer: footer,
        body: blog.html
    });

    fs.writeFileSync(path.join(config.distPath, 'blog', blog.config.name + '.html'), blogPage, 'utf8');
});
