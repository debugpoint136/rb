function facet_tklst_addSelected_repeat()
{
// called by clicking big green butt from the menu
if(menu.facettklstdiv.submit.count==0) return;
var bbj=gflag.menu.bbj;
var lst=menu.facettklsttable.firstChild.childNodes;
var addlst=[];
for(var i=0; i<lst.length; i++) {
	var td=lst[i].firstChild;
	if(td.className=='tkentry_onfocus') {
		var o=duplicateTkobj(td.tkobj);
		o.mode=tkdefaultMode(o);
		addlst.push(o);
	}
}
if(addlst.length==0) return;
menu.facettklstdiv.submit.innerHTML='Working...';
// may add context-specific handling
for(var i=0; i<addlst.length; i++) {
	var oo=bbj.genome.getTkregistryobj(addlst[i].name);
	if(!oo) {
		print2console('registry object not found for '+addlst[i].label,2);
	} else {
		if(oo.defaultmode!=undefined) {
			o.mode=oo.defaultmode;
		}
	}
}

var acclst=[];
//replace .genome.hmtk with entire set of GSM
for(var i=0; i<addlst.length; i++){
	for(var n in browser.genome.hmtk) {
		var t=browser.genome.hmtk[n].name;
		if ( t === addlst[i].name){
			acclst.push(n)
		}
	}
}

// bbj.ajax_addtracks(addlst);
bbj.ajax_addtracks_names(acclst);
}