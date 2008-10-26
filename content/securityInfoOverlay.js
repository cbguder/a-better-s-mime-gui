var cs532 = {
	onLoad: function() {
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("cs532-strings");
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
		this.prefs = this.prefs.getBranch("extensions.cs532.");

		document.getElementById("cs532summary").collapsed = !this.prefs.getBoolPref("summary");

		var signedBy = document.getElementById("signedBy");
		var signedByLabel = document.getElementById("signedByLabel");
		var sentByLabel = document.getElementById("sentByLabel");
		var signerEmail = document.getElementById("signerEmail");
		var signerEmailLabel = document.getElementById("signerEmailLabel");
		var signatureExplanation = document.getElementById("signatureExplanation");
		var cs532sender = document.getElementById("cs532sender");
		var strbundle = opener.document.getElementById("cs532-strings");
		
		var temp = signedBy.value;
		signedBy.value = signerEmail.value;
		signerEmail.value = temp;
		signerEmailLabel.textContent = strbundle.getString("cs532signerEmailLabel");
		
		var hdr = opener.GetDBView().hdrForFirstSelectedMessage;
		var sender = opener.cs532.stripAuthor(hdr.author);
		var senderName = opener.cs532.stripName(hdr.mime2DecodedAuthor);
		
		cs532sender.parentNode.collapsed = true;
		
		if(this.prefs.getBoolPref("checkName")) {
			if(senderName != gSignerCert.commonName) {
				document.getElementById("signatureHeader").value = strbundle.getString("cs532sigHeader");
				document.getElementById("signatureHeader").collapsed = false;
				
				if(sender == gSignerCert.emailAddress) {
					document.getElementById("signatureExplanation").textContent = strbundle.getString("cs532sigExplanationName");
				} else {
					document.getElementById("signatureExplanation").textContent = strbundle.getString("cs532sigExplanationBoth");
				}
				
				cs532sender.textContent = hdr.mime2DecodedAuthor;
				signedBy.value = gSignerCert.commonName + " <" + gSignerCert.emailAddress + ">";
				cs532sender.parentNode.collapsed = false;
				signedByLabel.textContent = strbundle.getString("cs532nameMismatchSignedBy");
				sentByLabel.textContent = strbundle.getString("cs532nameMismatchSentBy");
			} else if(sender != gSignerCert.emailAddress) {
				cs532sender.textContent = sender;
				cs532sender.parentNode.collapsed = false;
				signedByLabel.textContent = strbundle.getString("cs532signedByLabel");
			} else {
				signedBy.value = hdr.mime2DecodedAuthor;
			}
		} else {
			if(sender != gSignerCert.emailAddress) {
				cs532sender.textContent = sender;
				cs532sender.parentNode.collapsed = false;
				signedByLabel.textContent = strbundle.getString("cs532signedByLabel");
			}
		}
		
		var url = cs532.stripURL(gSignerCert.issuerName);
		var label = document.getElementById("cpsLink");
		var box = document.getElementById("cs532cpsBox");

		if(url == null)	{
			box.collapsed = true;
			label.href = "";
			label.textContent = "";
		} else {
			label.href = url;
			label.value= url;
			box.collapsed = false;
		}
	},
	
	stripURL: function(string) {
		var result = null;
		var parts = string.split(",");
		
		for(var i = 0; i < parts.length; i++) {
			if(parts[i].indexOf("OU=") == 0) {
				if(parts[i].indexOf("http") != -1) {
					var start = parts[i].indexOf("http");
					var end = parts[i].indexOf(" ", start);
					result = parts[i].substring(start, end);
					break;
				}
			}
		}
		
		return result;
	}
}

window.addEventListener("load", function(e) { cs532.onLoad(e); }, false);