'use strict';

var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var path = require('path');
var dot = require('dot');
var fs = require('fs');

var join = path.join;

var getMainPage = require('./getMainPage');
var getAuthorPage = require('./getAuthorPage');
var getHeader = require('./getHeader');
var saveStyle = require('./saveStyle');

var config = {
    distPath: join(__dirname, '../..'),
    serverDistPath: '',
    serverAbsoluteDistPath: 'https://trufi.github.io',
    sourcePath: 'https://github.com/Trufi/trufi.github.io/blob/master'
};

config.topMenu = {
    tabs: [
        {text: 'Blog', href: config.serverDistPath + '/'},
        {text: 'Author', href: config.serverDistPath + '/author'}
    ]
};

var templates = require('./getTemplates')();

// create dist folder
mkdirp.sync(config.distPath);

saveStyle(config);

var footer = templates.footer();

const projectSrc = join(__dirname, '..');
const pagesSrc = 'pages/blog';
const mainPageArticleList = [];

const articleDirNames = fs.readdirSync(join(projectSrc, pagesSrc));
articleDirNames.forEach(createArticle);

function createArticle(articleDirName) {
    const articleSrc = join(projectSrc, pagesSrc, articleDirName);
    const articleConfig = require(join(articleSrc, 'config.json'));

    if (articleConfig.draft) { return; }

    articleConfig.sourcePath = config.sourcePath + '/src/' + pagesSrc + '/' + articleDirName;
    articleConfig.href = articleConfig.href || (config.serverDistPath + '/blog/' + articleDirName);
    articleConfig.name = articleDirName;
    articleConfig.readmore = articleConfig.readmore || 'Читать дальше';

    const descriptionTemplate = fs.readFileSync(join(articleSrc, 'description.html'), 'utf8');
    const descriptionText = dot.template(descriptionTemplate)(articleConfig);

    let fullTemplate;

    try {
        fullTemplate = fs.readFileSync(join(articleSrc, 'index.html'), 'utf8');
    } catch (e) {}

    mkdirp.sync(join(config.distPath, 'blog', articleDirName));

    // копируем ассеты
    ncp(
        join(articleSrc, 'assets'),
        join(config.distPath, 'blog', articleDirName, 'assets'),
        function (error) {
            if (error) {
                return console.error(error);
            }
    });

    if (fullTemplate) {
        const fullText = dot.template(fullTemplate)(articleConfig);

        const page = templates.main({
            titleHtml: articleConfig.titleHtml,
            description: articleConfig.description,
            styleHref: config.serverDistPath + '/style.css',

            pageHref: config.serverDistPath + '/blog',
            pageAbsoluteHref: config.serverAbsoluteDistPath + '/blog',

            header: getHeader(config, articleConfig.href),
            footer: footer,
            body: templates.article({
                text: fullText,
                config: articleConfig
            })
        });

        fs.writeFileSync(join(config.distPath, 'blog', articleDirName, 'index.html'), page, 'utf8');
    }

    mainPageArticleList.push({
        config: articleConfig,
        description: descriptionText
    });
}

// main page
var mainPage = getMainPage(config, mainPageArticleList);
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
