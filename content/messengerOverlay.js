var cs532 = {	
	onLoad: function() {
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("cs532-strings");
		cs532.smimebar = document.getElementById("smimeBar");
		cs532.warningbar = document.getElementById("warningBar");
		cs532.emailMatch = document.getElementById("emailMatch");
		cs532.nameMatch = document.getElementById("nameMatch");
		cs532.strbundle = document.getElementById("cs532-strings");
		cs532.smimebar.appendChild(document.getElementById("smimeBox"));
	},
	
	stripAuthor: function(author) {
		var start = author.indexOf("<");
		var end = author.indexOf(">");
		return author.substring(start + 1, end);
	},
	
	stripName: function(author) {
		var start = author.indexOf("<");
		return author.substring(0, start - 1);
	},
	
	/*
	 * nsIMsgCustomColumnHandler Functions
	 */
	getCellText: function(row, col) {
		//get the message's header so that we can extract the reply to field
		var key = gDBView.getKeyAt(row);
		var hdr = gDBView.db.GetMsgHdrForKey(key);
		return cs532.getSortStringForRow(hdr);
	},
	getSortStringForRow: function(hdr) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.cs532.");
		if(prefs.getBoolPref("displayName")) {
			return hdr.mime2DecodedAuthor;
		} else {
			return this.stripAuthor(hdr.mime2DecodedAuthor);
		}
	},
	isString:            function() {return true;},
	getCellProperties:   function(row, col, props){},
	getRowProperties:    function(row, props){},
	getImageSrc:         function(row, col) {return null;},
	getSortLongForRow:   function(hdr) {return 0;}
};

var DBObserver = {
	// Components.interfaces.nsIObserver
	observe: function(aMsgFolder, aTopic, aData) {
		gDBView.addColumnHandler("senderCol", cs532);
		cs532.smimebar.collapsed   = true;
		cs532.warningbar.collapsed = true;
		cs532.nameMatch.collapsed  = true;
		cs532.emailMatch.collapsed = true;
	}
}

var MsgObserver = {
	observe: function(aMsgFolder, aTopic, aData) {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBranch("extensions.cs532.");
		cs532.smimebar.collapsed   = true;
		cs532.warningbar.collapsed = true;
		cs532.nameMatch.collapsed  = true;
		cs532.emailMatch.collapsed = true;
		
		if(!document.getElementById("signedHdrIcon").collapsed) {
			var description = cs532.smimebar.firstChild;
			var sender = document.getElementById("cs532email");
			sender.textContent = gSignerCert.emailAddress;

			if(gSignerCert == null) {						
				sender.textContent = "";
			} else {
				var hdr = messenger.msgHdrFromURI(aData);

				if(cs532.stripAuthor(hdr.author) == gSignerCert.emailAddress) {
					if(prefs.getBoolPref("checkName")) {
						if(cs532.stripName(hdr.mime2DecodedAuthor) == gSignerCert.commonName) {
							sender.textContent = hdr.mime2DecodedAuthor;
							cs532.smimebar.appendChild(document.getElementById("smimeBox"));
							cs532.smimebar.collapsed = false;
						} else {
							document.getElementById("signedHdrIcon").setAttribute("signed", "mismatch");
//							sender.textContent = gSignerCert.emailAddress;
							cs532.warningbar.appendChild(document.getElementById("smimeBox"));
							cs532.warningbar.collapsed = false;
							cs532.nameMatch.collapsed  = false;
							document.getElementById("cs532warningEmail").textContent = gSignerCert.emailAddress;
						}
					} else {
						sender.textContent = gSignerCert.emailAddress;
						cs532.smimebar.appendChild(document.getElementById("smimeBox"));
						cs532.smimebar.collapsed = false;
					}
				} else {
					cs532.warningbar.appendChild(document.getElementById("smimeBox"));
					cs532.warningbar.collapsed = false;
					cs532.emailMatch.collapsed = false;
				}
			}
		}
	}
}

window.addEventListener("load", function(e) { cs532.onLoad(e); }, false);
var ObserverService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
ObserverService.addObserver(DBObserver, "MsgCreateDBView", false);
ObserverService.addObserver(MsgObserver, "MsgMsgDisplayed", false);
