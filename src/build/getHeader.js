var templates = require('./getTemplates')();

module.exports = function(config, currentHref) {
    var topMenu = config.topMenu;

    topMenu.tabs.forEach(function(tab) {
    	if (currentHref.length == 0) {
    		currentHref = '/';
    	}
    	
        tab.isCurrent = tab.href === currentHref;
    });

    return templates.header({
        topMenu: topMenu
    });
};
