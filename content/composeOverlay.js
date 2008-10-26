var cs532 = {
	onLoad: function(e) {
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("cs532-strings");
		this.smimebar = document.getElementById("smimeBar");
				
		var id = document.getElementById("msgIdentity").value;
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		this.prefs = this.prefs.getBranch("mail.identity." + id + ".");
		
		this.smimebar.height = 39;
		
		cs532.onReopen(e);
	},
	
	onClose: function(e) {
		this.smimebar.collapsed = !this.sign_mail;
	},
	
	onReopen: function(e) {
		var sign_mail = this.prefs.getBoolPref("sign_mail");
		this.smimebar.collapsed = !sign_mail;
	},
	
	onSign: function() {
		this.smimebar.collapsed = !this.smimebar.collapsed;
		setNextCommand('signMessage');
	}
};

window.addEventListener("load", function(e) { cs532.onLoad(e); }, false);
window.addEventListener("compose-window-close", function(e) { cs532.onClose(e); }, true);
window.addEventListener("compose-window-reopen", function(e) { cs532.onReopen(e); }, true);
