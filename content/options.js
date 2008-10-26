function onAccept() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var enumerator = wm.getEnumerator(null);
	var tree = null;
	
	while(enumerator.hasMoreElements()) {
		var win = enumerator.getNext();
		var main = win.document.getElementById("messengerWindow");
		if(main != null) {
			tree = win.document.getElementById("threadTree");
			break;
		}
	}
	
	if(tree != null) {
		var boxobject = tree.boxObject;
		boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
		var senderCol = boxobject.columns.getNamedColumn("senderCol");
		
		if(senderCol != null) {
			boxobject.invalidateColumn(senderCol);
		}
	}
}