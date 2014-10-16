Alloy.Globals.AJAX = require("AJAX");

Alloy.Models.menuModel = Alloy.createModel("MenuDB");
Alloy.Collections.menu = Alloy.createCollection('MenuDB');

var titouchdb = require('com.obscure.titouchdb');
var manager = titouchdb.databaseManager;
var categoriesDB = manager.getDatabase("categories");
var categoriesPull = categoriesDB.createPullReplication(Alloy.CFG.couchdb_server + "divinity_menu");

var timeout = null;
categoriesPull.addEventListener('status', function(e) {
	if (e.status == 1) {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			Alloy.Collections.menu.reload();
			categoriesPull.stop();
		}, 8000);
	} else if (e.status == 0) {
		if (timeout) {
			clearTimeout(timeout);
		}
		Alloy.Collections.menu.reload();
	}
});
categoriesPull.start();

function isiOS7Plus() {
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0], 10);

		if (major >= 7) {
			return true;
		}
	}
	return false;
}

Alloy.Globals.iOS7 = isiOS7Plus();
Alloy.CFG.top = Alloy.Globals.iOS7 ? 20 : 0;
