function __track_Mout(event) {
	var bbj=browser;
	var tk=bbj.findTrack(event.target.tkname);
	tk.header.style.backgroundColor=
	colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
	pica.style.display='none';
}






function trackheader_Mover(event)
{
/* mouse over a track header canvas, show pica
show color bar for:
- numerical track in heatmap style
- lr with score
TODO bed with score
*/
var tk=browser.findTrack(event.target.tkname);
tk.header.style.backgroundColor=colorCentral.hl;
picasays.innerHTML=tk.label+'<br>'+ htmltext_colorscale(tk.minv,tk.maxv,'black', nr,ng,nb,pr,pg,pb);
var pos=absolutePosition(event.target);
pica_go(pos[0]+event.target.clientWidth-document.body.scrollLeft-5,pos[1]-document.body.scrollTop-10);
}

function trackheader_Mout(event) {
	browser.findTrack(event.target.tkname).header.style.backgroundColor='transparent';
	pica_hide();
}

function trackheader_MD(event)
{
/* press mouse on .header to move this single track
a track can be moved into and out of ghm
*/
	if(event.button!=0) return;
	event.preventDefault();
	var bbj=browser;
	for(var i=0; i<bbj.tklst.length; i++) {
		if(bbj.tklst[i].name==event.target.tkname) break;
	}
	var y=absolutePosition(bbj.hmdiv)[1];
	gflag.headerMove={
		y1:y,
		y2:y+bbj.hmdiv.clientHeight,
		oldy:event.clientY+document.body.scrollTop,
		tkidx:i,
	}
	document.body.addEventListener('mousemove',trackheader_MM,false);
	document.body.addEventListener('mouseup',trackheader_MU,false);
	bbj.highlighttrack([bbj.tklst[i]]);
}
function trackheader_MM(event) {
	var bbj=browser;
	var cy=event.clientY+document.body.scrollTop;
	var m=gflag.headerMove;
	if(cy>m.oldy) {
		/* moving down */
		if(cy-m.oldy>=Math.min(bbj.tklst[m.tkidx+1].canvas.height, m.y1+bbj.tklst[m.tkidx+1].canvas.offsetTop-m.oldy)) {
			bbj.movetk_hmtk([m.tkidx],false);
			m.tkidx++;
			bbj.highlighttrack([bbj.tklst[m.tkidx]]);
			m.oldy=cy;
			indicator3.style.top=m.y1+bbj.tklst[m.tkidx].canvas.offsetTop+cy-m.oldy;
			return;
		}
	} else if(cy<m.oldy) {
		/* moving up */
		if(m.tkidx>0) {
			if(m.oldy-cy>=Math.min(bbj.tklst[m.tkidx-1].canvas.height, m.oldy-m.y1-bbj.tklst[m.tkidx].canvas.offsetTop)) {
				bbj.movetk_hmtk([m.tkidx],true);
				m.tkidx--;
				bbj.highlighttrack([bbj.tklst[m.tkidx]]);
				m.oldy=cy;
				indicator3.style.top=m.y1+bbj.tklst[m.tkidx].canvas.offsetTop+cy-m.oldy;
				return;
			}
		}
	}
}
function trackheader_MU(event) {
	indicator3.style.display='none';
	document.body.removeEventListener('mousemove',trackheader_MM,false);
	document.body.removeEventListener('mouseup',trackheader_MU,false);
}



/* __menu__ */

function menu_track_mcm(event)
{
var tkarr=browser.getHmtkIdxlst_mcmCell(parseInt((event.clientX-absolutePosition(event.target)[0])/tkAttrColumnWidth), event.target.tkname);
if(tkarr==null) {
	menu_hide();
	return;
}
menu_shutup();
gflag.menu.tklst=[];
var lst=[];
for(var i=0; i<tkarr.length; i++) {
	gflag.menu.tklst.push(gflag.browser.tklst[tkarr[i]]);
	lst.push(gflag.browser.tklst[tkarr[i]]);
}
gflag.browser.highlighttrack(lst);
menu.c4.style.display='block';
menu_show(2, event.clientX, event.clientY);
return false;
}



function menu_track_bigmap(event)
{
/* right click over a track only in bigmap
*/
menu_shutup();
menu_show(1, event.clientX, event.clientY);
var bbj=gflag.browser;
var tk=bbj.findTrack(event.target.tkname);
gflag.menu.tklst=[tk];
bbj.highlighttrack([tk]);
menu.c4.style.display=
menu.c16.style.display=
menu.tksort.style.display= 'block';
return false;
}

/* __menu__ ends */

Browser.prototype.ajax_addtracks_names=function(geoAcclst)
{
/* arg: list of GSMs
*/
var lst2=[];
for(var i=0; i<geoAcclst.length; i++) {
	var gsm=geoAcclst[i];
	if(gsm in geo2id) {
		// a geo that has a record in db
		make_a_track(gsm);
		lst2.push(geo2id[gsm]);
	}
}
pagemask();
this.ajax('repeatbrowser=on&geoaccidlst='+lst2.join(',')+'&rpbrDbname='+infodb,function(data){alethiometer_addtk_cb(data,geoAcclst);});
}

Browser.prototype.__mcm_termchange=function() {
this.mcm.tkholder.parentNode.style.width=this.mcm.lst.length*tkAttrColumnwidth;
}


function __request_tk_registryobj(name, ft)
{
/* requesting a registry object for a genome bedgraph track
that is not in basedb track repository
*/
return {name:name, ft:ft, mode:M_show};
}

