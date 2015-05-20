/** special notice, nasty quick fix, D'Arvit
1.
in db table ratiomatrix it uses geoid but not track name
in browser it converts geo to a matching track
but this tkobj remembers its geo
2.
subfam bed track are not officially in sukn
but can be sneaked in and displayed in splinters
as their tabix files are in /subtleKnife/hg19/
but those tracks can't be shown as natives in sukn
so they have to be represented as custom bed in hubs

**/


// default and constant values
var browser;
var infodb='hg19repeat';
var basedb='hg19';
var datahuburllst=[ 'http://vizhub.wustl.edu/public/hg19/roadmap', 'http://vizhub.wustl.edu/public/hg19/encode'
];
var defaultGeneTrack='refGene';

// this is for hg19 only
var url_base='http://epigenomegateway.wustl.edu/browser/';
var url_genomebedgraph=url_base+'repeat/_d/genome_bedgraph/';
var url_subfambed=url_base+'repeat/_d/subfam_bed/';

var geneTrackColor='#00A4DB';
var defaultRepeatEnsembleTrack='rmsk_ensemble';
var geopreload='GSM733769,GSM733708,GSM945188,GSM733772,GSM733664,GSM733677,GSM733758,GSM945196,GSM733771,GSM733679,GSM945212,GSM733736,GSM733642,GSM733767,GSM736620,GSM816665,GSM733752,GSM749706,GSM822312,GSM935611,GSM803355,GSM822270,GSM935386,GSM803485,GSM935612,GSM935608,GSM733734,GSM733682,GSM945201,GSM798322,GSM1003480,GSM733756,GSM733696,GSM945208,GSM733684,GSM733711,GSM945230,GSM733669,GSM733689,GSM1003483,GSM1003520,GSM736564,GSM816633,GSM816643,GSM733785,GSM749739,GSM822285,GSM733759,GSM803533,GSM822273,GSM935395,GSM935360,GSM935383';
//var geopreload='GSM935580,GSM935360,GSM733769,GSM733708';

var apply_weight=false;

var pr=255,pg=255,pb=0,
	nr=0,ng=0,nb=255;

// to configure the behavior, adjustable
var rowlabelwidth=150; // width
var cellwidth=2;
var cellwidth_zoomout=2;
var cellheight=10;


var wiggleheight=40;
var qtc_treat_a={pr:255,pg:255,pb:0,thtype:0,height:50,uselog:false};
var qtc_treat_u={pr:234,pg:145,pb:23,thtype:0,height:50,uselog:false};
var qtc_input_a={pr:37,pg:234,pb:23,thtype:0,height:50,uselog:false};
var qtc_input_u={pr:77,pg:129,pb:73,thtype:0,height:50,uselog:false};
var qtc_density={pr:194,pg:105,pb:114,thtype:0,height:50,uselog:false};

var mdlst_row=['Sample','Epigenetic Mark','Transcription Regulator'];
var temcm_attrlst=['total bp #',
	'SINE','LINE','LTR','DNA',
	'Simple_repeat','Low_complexity','Satellite',
	'RNA','Other','Unknown']; /* subfam and temcm: repeat metadata colormap on top */
var temcm_cellheight=11; // TE mcm cell height
var subfamlabelheight=30;
var tkAttrColumnwidth=18;
var colorscalewidth=200;


// globals
var geo2id={};
var id2geo={};
var geoid2realtrack={};
var realtrack2geoid={};
/* quick fix, realtrack is the ones in sukn trackdb, linked to the geo here for querying info */
var subfam2id={};
var id2subfam={};
var col_runtime=[]; // run time
var col_runtime_all=[]; // all of the sub families
//var geo2md={}; // md transfered from hmtk to geo
var highlight_subfamid=null; // the id of the subfam to be highlighted

// doms
var colheader_holder;
var pica, picasays;
var pane;

var useRatioIdx=0; // 0 for ratio_1 (all reads), 2 for ratio_2 (unique only)






function colheader_getlanding(xpos)
{
// xpos is absolute page offset
var pos=absolutePosition(colheader_holder.parentNode);
var x=xpos-pos[0];
var left=parseInt(colheader_holder.style.left);
if(x<=left) {
	// beyond the left edge
	return -1;
}
var right=colheader_holder.clientWidth+left;
if(x>=right) {
	// beyond the right edge
	return -1;
}
return Math.min(parseInt((x-parseInt(colheader_holder.style.left))/cellwidth), col_runtime.length-1);
}

function drawBigmap(recordtkminmax)
{
/* arg:
- recordtkminmax: boolean,
	if true, means displaying data for all subfam, will compute min/max and record as .minv .maxv
	if false, means displaying data for a subset of subfam, won't compute min/max
*/
stripChild(browser.mcm.tkholder,0);
stripChild(browser.hmheaderdiv,0);
stripChild(colheader_holder,0);
stripChild(browser.hmdiv,0);


for(var i=0; i<browser.tklst.length; i++) {
	var tk=browser.tklst[i];

	tk.canvas.width=col_runtime.length * cellwidth;
	tk.canvas.height=cellheight;
	browser.hmdiv.appendChild(tk.canvas);

	tk.header.width=rowlabelwidth;
	tk.header.height=cellheight;
	tk.header.alethiometer=true;
	var ctx=tk.header.getContext('2d');
	ctx.fillStyle='white';
	ctx.fillText(tk.label,5,cellheight);
	browser.hmheaderdiv.appendChild(tk.header);

	tk.atC.width=browser.mcm.lst.length*tkAttrColumnwidth;
	tk.atC.height=cellheight;
	browser.mcm.tkholder.appendChild(tk.atC);
}

colheader_holder.style.width=col_runtime.length*cellwidth;
colheader_holder.style.height=
colheader_holder.parentNode.style.height= temcm_attrlst.length*temcm_cellheight+subfamlabelheight;
browser.mcm.tkholder.parentNode.style.width=browser.mcm.lst.length*tkAttrColumnwidth;
browser.hmheaderdiv.parentNode.style.width=rowlabelwidth;


/* temcm, prepare attribute data for each repeat subfam
this is not part of the browser object
*/
var ctxlst=[];
for(var i=0; i<col_runtime.length; i++) {
	var c=document.createElement('canvas');
	c.width=cellwidth;
	c.height=subfamlabelheight+temcm_attrlst.length*temcm_cellheight;
	c.oncontextmenu=menu_temcm;
	colheader_holder.appendChild(c);
	var ctx= c.getContext('2d');
	ctxlst.push(ctx);
	// highlight need to be applied before any drawing
	if(highlight_subfamid!=null) {
		if(highlight_subfamid==col_runtime[i]) {
			// fill a faint red
			ctx.fillStyle='rgba(255,0,0,0.5)';
			ctx.fillRect(0,0,cellwidth,c.height);
		}
	}
	// draw a separating line
	ctx.fillStyle='#22223A';
	ctx.fillRect(0,cellwidth,1,c.height);
	// if enough width, draw name
	if(cellwidth>=10) {
		ctx.fillStyle='white';
		ctx.font='10px Sans-serif';
		ctx.rotate(Math.PI*1.5);
		ctx.fillText(id2subfam[col_runtime[i]].name, -c.height+2, 10);
		ctx.rotate(-Math.PI*1.5);
	}
}

// first, draw total bp # color gradient
var max=0;
for(i=0; i<col_runtime.length; i++) max=Math.max(id2subfam[col_runtime[i]].genomelen,max);
for(i=0; i<col_runtime.length; i++) {
	ctxlst[i].fillStyle='rgba('+pr+','+pg+','+pb+','+id2subfam[col_runtime[i]].genomelen/max+')';
	ctxlst[i].fillRect(0,0,cellwidth,temcm_cellheight);
}
// then, draw attributes in temcm
for(i=1; i<temcm_attrlst.length; i++) {
	// must start from 1, 0 is total bp
	var attr2color=[];
	for(var j=0; j<col_runtime.length; j++) {
		var info=id2subfam[col_runtime[j]];
		if(info.cls==temcm_attrlst[i]) {
			// check color
			var color=null;
			for(var k=0; k<attr2color.length; k++) {
				if(attr2color[k][0]==info.fam) {
					color=attr2color[k][1];
					break;
				}
			}
			if(color==null) {
				color= colorCentral.longlst[attr2color.length % (colorCentral.longlst.length-1)];
				attr2color.push([info.fam, color]);
			}
			ctxlst[j].fillStyle=color;
			ctxlst[j].fillRect(0, i*temcm_cellheight, cellwidth, temcm_cellheight);
		}
	}
}


// remaining, one row for a geo, as a track in browser.tklst
for(i=0; i<browser.tklst.length; i++) {
	var tkobj=browser.tklst[i];

	ctx=tkobj.canvas.getContext('2d');

	var vlst=[];
	for(var j=0; j<col_runtime.length; j++) {
		var vv=tkobj.data[col_runtime[j]][useRatioIdx];

		if(apply_weight) vv*=id2subfam[col_runtime[j]].weight;

		vlst.push(vv);
	}
	var max=0, min=0;
	if(recordtkminmax) {
		// summarize max/min
		for(var j=0; j<vlst.length; j++) {
			var vv=vlst[j];
			if(vv>max) max=vv;
			else if(vv<min) min=vv;
		}
		tkobj.minv=min;
		tkobj.maxv=max;
	} else {
		max=tkobj.maxv;
		min=tkobj.minv;
	}
		
	for(j=0; j<vlst.length; j++) {
		if(vlst[j]>0) {
			ctx.fillStyle='rgba('+pr+','+pg+','+pb+','+(vlst[j]/max)+')';
			ctx.fillRect(cellwidth*j, 0, cellwidth,cellheight);
		} else if(vlst[j]<0) {
			ctx.fillStyle='rgba('+nr+','+ng+','+nb+','+(vlst[j]/min)+')';
			ctx.fillRect(cellwidth*j, 0, cellwidth,cellheight);
		}
	}
}
browser.prepareMcm();
browser.drawMcm(false);
}




function bigmap_move_Md(event)
{
if(event.button!=0) return;
event.preventDefault();
gflag.move={x:event.clientX,y:event.clientY};
document.body.addEventListener('mousemove',bigmap_move_Mm,false);
document.body.addEventListener('mouseup',bigmap_move_Mu,false);
}

function bigmap_move_Mm(event)
{
event.preventDefault();
if(event.clientX!=gflag.move.x) {
	browser.move.styleLeft=
	browser.hmdiv.style.left=
	colheader_holder.style.left=parseInt(browser.hmdiv.style.left)+event.clientX-gflag.move.x;
	gflag.move.x=event.clientX;
}
if(event.clientY!=gflag.move.y) {
	browser.hmdiv.style.top=
	browser.mcm.tkholder.style.top=
	browser.hmheaderdiv.style.top=parseInt(browser.hmdiv.style.top)+event.clientY-gflag.move.y;
	gflag.move.y=event.clientY;
}
}
function bigmap_move_Mu(event)
{
document.body.removeEventListener('mousemove',bigmap_move_Mm,false);
document.body.removeEventListener('mouseup',bigmap_move_Mu,false);
}

function sortcolumn_bytrack()
{
/* called by menu option
sort columns using data from a track
*/
var data=gflag.menu.tklst[0].data;
var hash={};
for(var i=0; i<col_runtime.length; i++) {
	var v=data[col_runtime[i]][useRatioIdx];
	if(v in hash)
		hash[v].push(col_runtime[i]);
	else
		hash[v]=[col_runtime[i]];
}
var lst=[];
for(var v in hash) lst.push(v);
lst.sort(function(a,b){return b-a});
col_runtime=[];
for(var i=0; i<lst.length; i++) {
	for(var j=0; j<hash[lst[i]].length; j++)
		col_runtime.push(hash[lst[i]][j]);
}
menu_hide();
drawBigmap(false);
}

function colheader_Mmove(event)
{
// mouse over a column header, highlight and show tooltip
// dont do it when zoomin in
if(gflag.zoomin.inuse) return;
var x=colheader_getlanding(event.clientX);
if(x==-1) return;
colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
// highlight current column
colheader_holder.childNodes[x].style.backgroundColor=colorCentral.hl;
pica.x=x;
picasays.innerHTML=htmltext_subfaminfo(col_runtime[x],true);
pica_go(event.clientX-10,absolutePosition(colheader_holder)[1]+colheader_holder.clientHeight-document.body.scrollTop-10);
}

function colheader_Mout(event) {
	colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
	pica_hide();
}


function __track_Mmove(event)
{
/* show data of the point under the cursor
must tell if this track is from a splinter
*/
var tkobj=browser.findTrack(event.target.tkname);
var x=colheader_getlanding(event.clientX);
if(x==-1) return;
tkobj.header.style.backgroundColor=colorCentral.hl;
// clear hl of previous column header
colheader_holder.childNodes[pica.x].style.backgroundColor='transparent';
// highlight current column
colheader_holder.childNodes[x].style.backgroundColor=colorCentral.hl;
pica.x=x;
//pica_go((event.clientX>document.body.clientWidth-300)?event.clientX-300:event.clientX, (event.clientY>document.body.clientHeight-200)?event.clientY-200:event.clientY);
pica_go(event.clientX,event.clientY);
var v=tkobj.data[col_runtime[x]][useRatioIdx];
picasays.innerHTML='<table style="margin:5px;white-space:nowrap;"><tr><td colspan=2 style="font-size:16px;color:white;">'+
	htmltext_bigmapcell(v,tkobj.maxv,tkobj.minv)+
	'</td></tr>'+
	'<tr><td class=tph>experiment</td>'+
		'<td style="font-size:12px">'+tkobj.label+'</td></tr>'+
	'<tr><td class=tph>TE subfamily</td>'+
		'<td style="font-size:12px">'+id2subfam[col_runtime[x]].name+'</td></tr>'+
	'<tr><td class=tph>max</td>'+
		'<td style="font-size:12px">'+tkobj.maxv+'</td></tr>'+
	'<tr><td class=tph>min</td>'+
		'<td style="font-size:12px">'+tkobj.minv+'</td></tr>'+
	'</table>';
}

function make_a_track(geoAcc)
{
/* make a track for showing in bigmap
*** not splinters!! ***
behaves differently compared with sukn tklst
args: GSM geo accession
.genome.hmtk must already been replaced
with GSM as keys, not hmtk name
*/
var tk=browser.makeTrackDisplayobj(geoAcc, browser.genome.hmtk[geoAcc].ft);
// the treatment of *polymorphism*
tk.canvas.removeEventListener('mouseout', track_Mout, false);
tk.canvas.removeEventListener('mousemove', track_Mmove, false);
tk.canvas.addEventListener('mouseout', __track_Mout, false);
tk.canvas.addEventListener('mousemove', __track_Mmove, false);

// redefine right click behavior
var geoid=geo2id[geoAcc];
tk.label=id2geo[geoid].label;
tk.canvas.oncontextmenu=menu_bigmap;
tk.geoid=geoid;
browser.tklst.push(tk);
}


function temcm_click(event) {
/* clicking on a repeat mcm header
first attribute is length
rest is class, different sorting method!!
*/
if(event.target.idx==0) {
	var len2id={};
	for(var i=0; i<col_runtime.length; i++) {
		var j=col_runtime[i];
		var L=id2subfam[j].genomelen;
		if(L in len2id)
			len2id[L].push(j);
		else
			len2id[L]=[j];
	}
	var numlst=[];
	for(var n in len2id) numlst.push(n);
	numlst.sort(numSort2);
	col_runtime=[];
	for(i=0; i<numlst.length; i++) {
		for(var j=0; j<len2id[numlst[i]].length; j++)
			col_runtime.push(len2id[numlst[i]][j]);
	}
	drawBigmap(false);
	return;
}
var hitlst=[], restlst=[];
var hitclass=temcm_attrlst[event.target.idx];
for(var i=0; i<col_runtime.length; i++) {
	var j=col_runtime[i];
	if(id2subfam[j].cls==hitclass)
		hitlst.push(j);
	else
		restlst.push(j);
}
// group hitlst together
var fam2id={};
for(i=0; i<hitlst.length; i++) {
	var fam=id2subfam[hitlst[i]].fam;
	if(fam in fam2id)
		fam2id[fam].push(hitlst[i]);
	else
		fam2id[fam]=[hitlst[i]];
}
var newhitlst=[];
for(var fam in fam2id)
	newhitlst=newhitlst.concat(fam2id[fam]);
col_runtime=newhitlst.concat(restlst);
drawBigmap(false);
}

function colheader_select_Md(event)
{
/* mouse down on col header holder to zoom in and show a subset
to make things simple and life easier
there's only one level of zoomin
at zoomin level, each cell will be blown to 10px width
gflag.zoomin.atfinest tells whether is currently at zoom-in level
*/
// check x position, detect whether pressed on actual header but not blank
if(event.button!=0) return;
var xidx=colheader_getlanding(event.clientX);
if(xidx==-1) return;
event.preventDefault();
var pos=absolutePosition(colheader_holder.parentNode);
gflag.zoomin.x=event.clientX;
gflag.zoomin.x0=event.clientX; // original x
gflag.zoomin.borderleft=Math.max(parseInt(colheader_holder.style.left)+pos[0],pos[0]);
gflag.zoomin.borderright=pos[0]+Math.min(colheader_holder.parentNode.clientWidth, colheader_holder.clientWidth+parseInt(colheader_holder.style.left));
gflag.zoomin.inuse=true;
indicator.style.display='block';
indicator.style.width=1;
indicator.style.height=colheader_holder.clientHeight+1;
indicator.style.left=event.clientX;
indicator.style.top=pos[1]-1;
indicator.firstChild.style.backgroundColor=
indicator.style.borderColor= gflag.zoomin.atfinest?'red':'blue';
document.body.addEventListener('mousemove',colheader_select_Mm,false);
document.body.addEventListener('mouseup',colheader_select_Mu,false);
}
function colheader_select_Mm(event)
{
if(event.clientX==gflag.zoomin.x) return;
if(event.clientX>gflag.zoomin.x0) {
	// on right of original point, only change width
	if(event.clientX>gflag.zoomin.borderright)
		return;
	indicator.style.width=parseInt(indicator.style.width)+event.clientX-gflag.zoomin.x;
} else {
	// on left of original point, change both width and left
	if(event.clientX<gflag.zoomin.borderleft)
		return;
	var c=event.clientX-gflag.zoomin.x;
	indicator.style.width=parseInt(indicator.style.width)-c;
	indicator.style.left=parseInt(indicator.style.left)+c;
}
gflag.zoomin.x=event.clientX;
}
function colheader_select_Mu(event)
{
document.body.removeEventListener('mousemove',colheader_select_Mm,false);
document.body.removeEventListener('mouseup',colheader_select_Mu,false);
gflag.zoomin.inuse=false;
var w=parseInt(indicator.style.width);
if(!gflag.zoomin.atfinest && w>cellwidth*5) {
	// carry out zoom in, find all subfams covered by indicator
	// offset of indicator relative to subfam holder
	var x=colheader_getlanding(parseInt(indicator.style.left));
	var newlst=[];
	for(var i=Math.max(x,0); i<=Math.min(x+parseInt(w/cellwidth),col_runtime.length-1); i++)
		newlst.push(col_runtime[i]);
	col_runtime=newlst;
	cellwidth=10;
	gflag.zoomin.atfinest=true;
	document.getElementById('zoomoutbutt').style.display='inline-block';
	// reset movable horizontal position
	pica.x=
	browser.move.styleLeft=
	browser.hmdiv.style.left=
	colheader_holder.style.left=0;
	drawBigmap(false);
}
indicator.style.display='none';
}

function zoomout() {
// called by pushing button <zoom>
	col_runtime=[];
	for(var i=0; i<col_runtime_all.length; i++)
		col_runtime.push(col_runtime_all[i]);
	cellwidth=cellwidth_zoomout;
	gflag.zoomin.atfinest=false;
	document.getElementById('zoomoutbutt').style.display='none';
	// reset movable horizontal position
	pica.x=
	browser.move.styleLeft=
	browser.hmdiv.style.left=
	colheader_holder.style.left=0;
	drawBigmap(true);
}




/* __menu__ */

function menu_bigmap(event)
{
/* right click on bigmap, show wiggle data for the track/subfam combination
*/
var tkobj=browser.findTrack(event.target.tkname);
var geoid=tkobj.geoid;
// the subfam
var x= colheader_getlanding(event.clientX);
var subfamid=col_runtime[x];
menu_shutup();
menu.c1.style.display='block';
menu.c1.innerHTML='<table style="margin-left:15px;white-space:nowrap;">'+
	'<tr><td class=tph>experiment</td><td>'+id2geo[geoid].label+'</td></tr>'+
	'<tr><td class=tph>TE subfamily</td><td>'+id2subfam[subfamid].name+'</td></tr>'+
	'<tr><td class=tph>genome copy #</td><td>'+id2subfam[subfamid].copycount+'</td></tr>'+
	'<tr><td class=tph>has consensus?</td><td>'+
	(id2subfam[subfamid].consensuslen==0?'no':'yes')+
	'</td></tr></table>';
menu.c200.style.display='block';

gflag.menu.subfamid=subfamid;
gflag.menu.geoid=geoid;
gflag.menu.pointdata=tkobj.data[subfamid];

// highlight
var pos1=absolutePosition(tkobj.header);
var pos2=absolutePosition(colheader_holder.childNodes[x]);
indicator7.style.display='block';
indicator7.style.left=pos1[0];
indicator7.style.top=pos2[1];
indicator7.style.width=pos2[0]-pos1[0]+cellwidth;
indicator7.style.height=pos1[1]-pos2[1]+cellheight;

menu_show(0,event.clientX,event.clientY);
return false;
}

function menu_temcm(event)
{
// right click on a subfam
menu_shutup();
menu.c201.style.display=
menu.c203.style.display='block';
menu_show(0, event.clientX, event.clientY);
var x= colheader_getlanding(event.clientX);
gflag.menu.subfamid=col_runtime[x];
document.getElementById('cmo3_says').innerHTML=id2subfam[gflag.menu.subfamid].name;
var c= colheader_holder.childNodes[x];
var pos=absolutePosition(c);
placeIndicator3(pos[0],pos[1],c.width,c.height);
return false;
}

function menu_showsearchui()
{
menu_shutup();
menu.c202.style.display='block';
document.getElementById('find_te_msg').style.display='none';
indicator3.style.display='none';
}

function find_te_ku(event) {if(event.keyCode==13) find_te();}

function find_te()
{
// called by pushing butt
highlight_subfamid=null;
var _s=document.getElementById('find_te_input').value;
var msg=document.getElementById('find_te_msg');
msg.style.display='block';
if(_s=='enter transposon name') {
	msg.innerHTML='Please enter transposon name';
	return;
}
var s=_s.toUpperCase();
for(var id in id2subfam) {
	var s2=id2subfam[id].name.toUpperCase();
	if(s==s2) {
		highlight_subfamid=id;
		msg.innerHTML='Found!<br>This transposon is now highlighted with red background.';
		setTimeout(menu_hide,500);
		setTimeout('drawBigmap(false)',500);
		return;
	}
}
msg.innerHTML='No match found.';
}

/* __menu__ ends */



function pane_hide() {
panelFadeout(apps.gg.main);
pagecloak.style.display='none';
}




function htmltext_bigmapcell(v,max,min) {
	return '<div class=squarecell style="display:inline-block;background-color:'+
		((v>0)?'rgba('+pr+','+pg+','+pb+','+(v/max)+');':'rgba('+nr+','+ng+','+nb+','+(v/min)+');')+
		'"> </div> '+v.toFixed(3);
}

function htmltext_subfaminfo(sfid, lightfg) {
// light foreground?
var ii=id2subfam[sfid];
return '<table>'+
'<tr><td class=tph>subfamily</td><td><span style="font-weight:bold;'+(lightfg?'color:white;':'')+'">'+
ii.name+'</span></td></tr>'+
'<tr><td class=tph>family</td><td>'+ii.fam+'</td></tr>'+
'<tr><td class=tph>class</td><td>'+ii.cls+'</td></tr>'+
'<tr><td class=tph>total bp #</td><td>'+ii.genomelen+'</td></tr>'+
'<tr><td class=tph>genome copy #</td><td>'+ii.copycount+'</td></tr>'+
(ii.consensuslen>0 ?
	'<tr><td class=tph>consensus length</td><td>'+ii.consensuslen+'</td></tr>':
	'<tr><td class=tph colspan=2 style="text-align:left">does not have consensus</td></tr>'
)+
'</table>';
}

function make_subfamhandle(subfamid) {
var h=document.createElement('table');
h.cellSpacing=0;
h.className='subfamhandle';
h.subfamid=subfamid;
var tr=h.insertRow(0);
var td=tr.insertCell(0);
td.innerHTML='&nbsp;'+id2subfam[subfamid].name+'&nbsp;';
td=tr.insertCell(1);
td.className='handlebutt';
td.innerHTML='&#8505;';
td.addEventListener('click',subfamhandle_click,false);
return h;
}
function subfamhandle_click(event)
{
/* clicking on a file handle, show info and options
*/
var t=event.target;
while(t.tagName!='TABLE') t=t.parentNode;
menu_shutup();
menu_show(0, event.clientX, event.clientY);
var w=menu.infowrapper;
w.style.display='block';
w.innerHTML=htmltext_subfaminfo(t.subfamid,false);
}
function make_filehandle(tkname,basename,totalnum,idx) {
var h=document.createElement('table');
h.cellSpacing=0;
h.className='filehandle';
h.tkname=tkname;
var tr=h.insertRow(0);
var td=tr.insertCell(0);
td.innerHTML='&nbsp;'+basename+(totalnum==1?'':' '+(idx+1))+'&nbsp;';
td=tr.insertCell(1);
td.className='handlebutt';
td.innerHTML='&#8505;';
td.addEventListener('click',filehandle_click,false);
return h;
}
function filehandle_click(event)
{
/* clicking on a file handle, show info and options
*/
var t=event.target;
while(t.tagName!='TABLE') t=t.parentNode;
gflag.menu.x=event.clientX;
gflag.menu.y=event.clientY;
get_file_info(t.tkname);
}

function get_file_info(filename)
{
browser.ajax('repeatbrowser=on&getfileinfo='+filename+'&rpbrDbname='+infodb,function(data){
	menu_shutup();
	menu_show(0, gflag.menu.x, gflag.menu.y);
	menu.infowrapper.style.display='block';
	stripChild(menu.infowrapper,0);
	var x={};
	tkinfo_parse(data.text,x);
	browser.tkinfo_show_do({details:x});
});
}
function make_geohandle(geoid,label) {
var h=document.createElement('table');
h.cellSpacing=0;
h.className='geohandle';
h.geoid=geoid;
var tr=h.insertRow(0);
var td=tr.insertCell(0);
td.innerHTML='&nbsp;'+(label?label:id2geo[geoid].label)+'&nbsp;';
td=tr.insertCell(1);
td.className='handlebutt';
td.innerHTML='&#8505;';
td.addEventListener('click',geohandle_click,false);
return h;
}
function geohandle_click(event)
{
/* clicking on a file handle, show info and options
*/
var t=event.target;
while(t.tagName!='TABLE') t=t.parentNode;
menu_getExperimentInfo(t.geoid, event.clientX, event.clientY);
}

Browser.prototype.getTrackdetail=function(geoacc)
{
/* override existing method from base.js
safe?
*/
menu_getExperimentInfo(geo2id[geoacc]);
};;



function menu_getExperimentInfo(geoid, x,y)
{
// x,y are optional
if(x!=undefined) {
	menu_show(0, x,y);
}
menu_shutup();
browser.tkinfo_show(id2geo[geoid].acc);
}
function menu_click4geo()
{
window.open('http://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc='+id2geo[gflag.geoid].acc);
}

function menu_getExperimentInfo_2()
{
// always invoked on a single track
var tk=gflag.menu.tklst[0];
if(gflag.menu.bbj.splinterTag) {
	// on a real browser track in splinter
	// risky way to detect whether it is assay track
	if(tk.name in gflag.menu.bbj.genome.decorInfo) {
		menu_shutup();
		menuGetonetrackdetails(tk.name);
		return;
	}
	gflag.menu.x=parseInt(menu.style.left);
	gflag.menu.y=parseInt(menu.style.top);
	get_file_info(tk.name);
} else {
	// on a bigmap track
	menu_getExperimentInfo(tk.geoid);
}
}


function show_info(event)
{
menu_shutup();
menu.linkholder.style.display='block';
var p=absolutePosition(event.target);
menu_show(0,p[0]-200,40);
}



function showinpane_te()
{
}




/* __genome__ graph **/

function tab_click(event)
{
// clicking on a tab
var w=event.target.which;
var t=apps.gg.view[event.target.key].tabs;
t.info[0].disabled=w==1;
t.cons[0].disabled=w==2;
t.bev[0].disabled=w==3;
t.info[1].style.display=w==1?'block':'none';
t.cons[1].style.display=w==2?'block':'none';
t.bev[1].style.display=w==3?'block':'none';
}


function subfamtrackparam(sid)
{
var lst2=[];
var lst=apps.gg.chrlst;
for(var i=0; i<lst.length; i++) {
	lst2.push(lst[i]);
	lst2.push(browser.genome.scaffold.len[lst[i]]);
}
var s=id2subfam[sid];
return '&rpbrDbname='+infodb+'&dbName='+basedb+'&rpbr_class='+s.cls+'&rpbr_family='+s.fam+'&rpbr_subfam='+s.name.replace('/','_')+'&chrlst='+lst2.join(',');
}

function scoreSort(a,b) {return b[2]-a[2];}
function coordSort(a,b) {return a[0]-b[0];}

function draw_genomebev_1(key)
{
// show genome location of one subfam
var clst=apps.gg.chrlst;
var vobj=apps.gg.view[key];
var chr2xpos={};
for(var i=0; i<clst.length; i++) {
	var c=vobj.bev.chr2canvas[clst[i]];
	var ctx=c.getContext('2d');
	ctx.clearRect(0,0,c.width,c.height);
	var dd=vobj.bev.data[clst[i]];
	var xpos=[];
	for(var j=0; j<dd.length; j++) {
		// [ start, stop, strand ]
		var x=apps.gg.sf*dd[j][0];
		ctx.fillStyle='white';
		ctx.fillRect(x,0,1,c.height);
		xpos.push(x);
	}
	chr2xpos[clst[i]]=xpos;
}
vobj.bev.chr2xpos=chr2xpos;
}

function draw_genomebev_experiment(vobj,bev)
{
/* draw bev graph on which the TEs from a subfam is plotted
colored by experiment assay data
*/
var chr2xpos={};
var basev=bev.csbj.baseline;
var num=0;
var clst=apps.gg.chrlst;
for(var i=0; i<clst.length; i++) {
	var c=bev.chr2canvas[clst[i]];
	var ctx=c.getContext('2d');
	ctx.clearRect(0,0,c.width,c.height);
	var dd=bev.data[clst[i]];
	var xpos=[];
	for(var j=0; j<dd.length; j++) {
		// [ start, stop, strand, swscore ]
		var v=dd[j][(vobj.type==1?3:4)];
		var x=apps.gg.sf*dd[j][0];
		if(v<basev) {
			ctx.fillStyle='rgba(0,0,255,'+((basev-v)/(basev-bev.minv))+')';
		} else {
			num++;
			ctx.fillStyle='rgba(255,255,0,'+((v-basev)/(bev.maxv-basev))+')';
		}
		ctx.fillRect(x,0,1,c.height);
		xpos.push(x);
	}
	chr2xpos[clst[i]]=xpos;
}
bev.chr2xpos=chr2xpos;

// number of repeats beyond cutoff, only for main experiment
if(bev.ismain) {
	vobj.colorscale.numAboveThreshold.innerHTML=num;
	var s=vobj.rank.beambutt;
	s.innerHTML='view in WashU Browser';
	s.className='clb4';
	s.addEventListener('click',beam_rankitem,false);
}
/*over*/
}

function make_genomebev_base(vobj,key)
{
/* draw barebone genomegraph
argument is view object that hasn't been initialized
*/
var table=dom_create('table',vobj.bev.holder);
var tr=table.insertRow(0);
var td=tr.insertCell(0);
td.colSpan=2;
if(vobj.colorscale) {
	/* make color scale scaffold, on top of bev
	will hold color scale of many tracks
	*/
	var d=dom_create('div',td);
	d.style.display='inline-block';
	vobj.colorscale.holder=d;
	var table2=dom_create('table',d);
	table2.style.margin=15;
	table2.style.fontSize='12px';
	// row 0
	var tr=table2.insertRow(0);
	// 0-1
	tr.insertCell(0);
	// 0-2
	vobj.colorscale.cell0=tr.insertCell(-1);
	// 0-3
	var td=tr.insertCell(-1);
	td.rowSpan=5;
	td.style.fontSize=16;
	td.style.paddingLeft=100;
	vobj.colorscale.numAboveThreshold=dom_addtext(td);
	dom_addtext(td,' TEs are above threshold');
	dom_create('br',td);
	var s=dom_addtext(td,'download',null,'clb4');
	s.key=key;
	s.addEventListener('click',beam_rankitem,false);
	s.sukngsv=false;
	s.style.marginRight=10;
	s=dom_addtext(td,'view in WashU Browser',null,'clb4');
	s.key=key;
	s.addEventListener('click',beam_rankitem,false);
	s.sukngsv=true;
	vobj.rank.beambutt=s;
	var b=dom_addbutt(td,'Add another experiment',add2gg_invoketkselect);
	b.key=key;
	b.style.display='block';
	b.style.marginTop=10;
	vobj.add_experiment_butt=b;
	// row 1-1
	tr=table2.insertRow(-1);
	td=tr.insertCell(0);
	td.align='right';
	td.vAlign='bottom';
	td.innerHTML='drag to adjust';
	// row 1-2
	td=tr.insertCell(-1);
	td.vAlign='bottom';
	vobj.colorscale.cell1=td;

	tr=table2.insertRow(-1);
	// row 2-1
	td=tr.insertCell(0);
	td.align='right';
	td.vAlign='bottom';
	td.innerHTML='score histogram';
	// row 2-2
	td=tr.insertCell(-1);
	vobj.colorscale.cell2=td;

	tr=table2.insertRow(-1);
	// row 3-1
	td=tr.insertCell(0);
	td.align='right';
	td.vAlign='bottom';
	td.innerHTML='plot color';
	// row 3-2
	td=tr.insertCell(-1);
	vobj.colorscale.cell3=td;

	tr=table2.insertRow(-1);
	// row 4-1
	td=tr.insertCell(0);
	// row 4-2
	td=tr.insertCell(-1);
	td.vAlign='top';
	vobj.colorscale.cell4=td;
}
// draw graph
var lst=apps.gg.chrlst;
var chr2canvas={};
var chr2holder={};
for(var i=0; i<lst.length; i++) {
	var tr=table.insertRow(-1);
	var td=tr.insertCell(0);
	td.align='right';
	td.vAlign='top';
	td.innerHTML=lst[i];
	td=tr.insertCell(1);
	chr2holder[lst[i]]=td;
	var c=dom_create('canvas',td);
	c.style.display='block';
	c.chrom=lst[i];
	c.key=key;
	chr2canvas[lst[i]]=c;
	c.width=apps.gg.sf*browser.genome.scaffold.len[lst[i]];
	c.height=apps.gg.chrbarheight;
	c.className='clb5';
	var ctx=c.getContext('2d');
	ctx.fillStyle='black';
	ctx.fillRect(0,0,c.width,c.height);
	c.addEventListener('mousemove', genomebev_tooltip_mousemove, false);
	c.addEventListener('mouseout', pica_hide, false);
	c.addEventListener('mousedown', genomebev_zoomin_md, false);
}
vobj.bev.chr2canvas=chr2canvas;
vobj.bev.chr2holder=chr2holder;
}

function genomebev_tooltip_mousemove(event)
{
// mouse over a chrom graph
if(gflag.zoomin.inuse) {
	pica_hide();
	return;
}
var vobj=apps.gg.view[event.target.key];
var pos=absolutePosition(event.target);
pos[1]-=document.body.scrollTop;
var x=event.clientX-pos[0];
var chr=event.target.chrom;
var lst=vobj.bev.chr2xpos[chr];
var idlst=[];
for(var i=0; i<lst.length; i++) {
	var d=Math.abs(lst[i]-x);
	if(Math.abs(lst[i]-x)<=1) {
		idlst.push(i);
	} else if(lst[i]>x+1) {
		break;
	}
}
if(idlst.length==0) {
	// no hit
	picasays.innerHTML=chr+' '+parseInt(x/apps.gg.sf);;
	pica_go(event.clientX, pos[1]+apps.gg.chrbarheight);
} else {
	var text=['<table><tr>'];
	for(var i=0; i<idlst.length; i++) {
		var t=vobj.bev.data[chr][idlst[i]];
		var tmp= '<table><tr><td class=tph>start</td><td>'+t[0]+'</td></tr>'+
			'<tr><td class=tph>stop</td><td>'+t[1]+'</td></tr>'+
			'<tr><td class=tph>length</td><td>'+(t[1]-t[0])+' bp</td></tr>'+
			'<tr><td class=tph>strand</td><td>'+t[2]+'</td></tr>'+
			'</table></td>';
			//'<tr><td class=tph>SW score</td><td>'+t[3]+'</td></tr></table></td>';
		if(vobj.type==1) {
			text.push('<td>'+tmp);
		} else {
			text.push('<td>'+htmltext_bigmapcell(t[4],vobj.bev.maxv,vobj.bev.minv)+'<br>'+tmp);
		}
	}
	picasays.innerHTML=text.join('')+'</tr></table>';
	pica_go(event.clientX, pos[1]+apps.gg.chrbarheight);
}
}

function wiggle_maxmin(data) {
	var max=0, min=0;
	for(var i=0; i<data.length; i++) {
		for(var j=0; j<data[i][1].length; j++) {
			var v=data[i][1][j];
			if(max<v) max=v;
			else if(min>v) min=v;
		}
	}
	return [max, min];
}


function init_newgg(vobj)
{
var key=Math.random();
apps.gg.view[key]=vobj;
// color index
var cidx=0;
var inuse=true;
while(inuse) {
	inuse=false;
	for(var k in apps.gg.view) {
		if(apps.gg.view[k].coloridx==cidx) {
			inuse=true;
			cidx+=1;
			break;
		}
	}
}
vobj.coloridx=cidx;
// handle
var h=make_skewbox_butt(apps.gg.handleholder);
h.style.marginLeft=15;
h.firstChild.style.borderTop='solid 3px '+colorCentral.longlst[cidx];
h.firstChild.style.backgroundColor=colorCentral.foreground;
h.childNodes[1].innerHTML='&nbsp;';
h.addEventListener('click',click_gghandle,false);
h.viewkey=key;
vobj.handle=h;

vobj.main=dom_create('div',apps.gg.holder);
// header
var d=make_headertable(vobj.main,0);
d._h.style.borderBottom='solid 2px '+colorCentral.longlst[cidx];
d._h.align='left';
vobj.content=d._c;
d=dom_create('div',d._h);
d.style.position='relative';
d.style.padding='10px 200px 10px 50px';
vobj.header=d;
var d2=dom_create('div',d);
d2.style.position='absolute';
d2.style.top=15;
d2.style.right=20;
d2.style.color='rgba(255,0,0,0.7)';
d2.style.cursor='default';
d2.innerHTML='Delete';
d2.addEventListener('click',delete_gg,false);
d2.key=key;
return key;
}

function delete_gg(event)
{
var v=apps.gg.view[event.target.key];
apps.gg.holder.removeChild(v.main);
apps.gg.handleholder.removeChild(v.handle);
delete apps.gg.view[event.target.key];
var c=document.getElementById('viewcount');
c.innerHTML=parseInt(c.innerHTML)-1;
}

function menu_genomegraph_1()
{
/* from menu option, render graph for a given context
*/
menu_hide();
for(var key in apps.gg.view) {
	var v=apps.gg.view[key];
	if(v.type==1 && v.subfamid==gflag.menu.subfamid) {
		view_gg(key);
		return;
	}
}
// only draw copies
gflag.subfamid=gflag.menu.subfamid;
cloakPage();
browser.ajax('repeatbrowser=on&getsubfamcopiesonly=on'+subfamtrackparam(gflag.subfamid),function(data){
	var chr2data={};
	var lst=apps.gg.chrlst;
	for(var i=0; i<lst.length; i++)
		chr2data[lst[i]]=[];
	//var min=0, max=0;
	for(i=0; i<data.genomecopies.length; i++) {
		var x=data.genomecopies[i];
		chr2data[x[0]].push([x[1],x[2],x[3]]);
		/* smith-waterman score
		var sw=x[4];
		if(sw>max) max=sw;
		else if(sw<min) min=sw;
		*/
	}
	var sid=gflag.subfamid;
	var vobj={
		type:1,
		subfamid:sid,
		bev:{ data:chr2data, // minv:min, maxv:max, scoreType:'SW score'
		},
	};
	// make ui
	var key=init_newgg(vobj);

	dom_addtext(vobj.header,'Showing '+id2subfam[sid].copycount+' copies of&nbsp;&nbsp;');
	vobj.header.appendChild(make_subfamhandle(sid));

	vobj.bev.holder=vobj.content;
	make_genomebev_base(vobj,key);
	draw_genomebev_1(key);
	view_gg(key);
	panelFadein(apps.gg.main,50,20);
	document.getElementById('viewlstbutt').style.display='inline';
	var c=document.getElementById('viewcount');
	c.innerHTML=parseInt(c.innerHTML)+1;
});
}

function menu_genomegraph_2()
{
/* view an experiment over a subfam
*/
menu_hide();
for(var key in apps.gg.view) {
	var v=apps.gg.view[key];
	if(v.type==2 && v.geoid==gflag.menu.geoid && v.subfamid==gflag.menu.subfamid) {
		view_gg(key);
		return;
	}
}
var geoinfo=id2geo[gflag.menu.geoid];
var sfinfo=id2subfam[gflag.menu.subfamid];
var has_consensus=sfinfo.consensuslen>0;
// TODO check if this view has been made

/* generate this view */
var viewobj={
	type:2,
	subfamid:gflag.menu.subfamid,
	geoid:gflag.menu.geoid,
	tabs:{info:[],cons:[],bev:[],rank:[]},
	bev:{},
	rank:{},
	has_input:geoinfo.input!=null,
	tklst:[],
};
var key=init_newgg(viewobj);

viewobj.header.appendChild(make_geohandle(gflag.menu.geoid));
dom_addtext(viewobj.header,'&nbsp;&nbsp;over&nbsp;&nbsp;');
viewobj.header.appendChild(make_subfamhandle(gflag.menu.subfamid));

/*******
   tab headers
**/
var b=dom_addbutt(viewobj.header,'Description',tab_click);
b.which=1;
b.key=key;
b.style.marginLeft=20;
b.disabled=true;
viewobj.tabs.info[0]=b;
if(has_consensus) {
	b=dom_addbutt(viewobj.header,'Loading...',tab_click);
	b.which=2;
	b.key=key;
	viewobj.tabs.cons[0]=b;
} else {
	viewobj.tabs.cons=[document.createElement('button'),document.createElement('div')];
}
// bev
b=dom_addbutt(viewobj.header,'Loading...',tab_click);
b.key=key;
b.which=3;
viewobj.tabs.bev[0]=b;

/**********
first section: geo/tk info, consensus wiggle plot
*/
var table=dom_create('table',viewobj.content);
viewobj.tabs.info[1]=table;
// row 1
var tr=table.insertRow(0);
var td=tr.insertCell(0);
td.className='tph';
td.innerHTML='Experiment';
tr.insertCell(1).appendChild(make_geohandle(gflag.menu.geoid));
// row 2
tr=table.insertRow(-1);
td=tr.insertCell(0);
td.className='tph';
td.innerHTML=viewobj.has_input==null?'Data files':'Treatment data files';
td=tr.insertCell(1);
for(var i=0; i<geoinfo.treatment.length; i++) {
	td.appendChild(make_filehandle(geoinfo.treatment[i], viewobj.has_input?'treatment':'file',geoinfo.treatment.length,i));
}
// row 2.5
if(viewobj.has_input) {
	tr=table.insertRow(-1);
	td=tr.insertCell(0);
	td.className='tph';
	td.innerHTML='Input/Control data files';
	td=tr.insertCell(1);
	for(var i=0; i<geoinfo.input.length; i++) {
		td.appendChild(make_filehandle(geoinfo.input[i], 'input', geoinfo.input.length,i));
	}
}
// row 3
tr=table.insertRow(-1);
td=tr.insertCell(0);
td.className='tph';
td.innerHTML='Log ratio of average score';
tr.insertCell(1).innerHTML=gflag.menu.pointdata[0]+' <span style="font-size:10px;">iteres</span><br>'+gflag.menu.pointdata[1]+' <span style="font-size:10px;">BWA</span>';
// row 4
tr=table.insertRow(-1);
td=tr.insertCell(0);
td.className='tph';
td.innerHTML='Repeat subfamily';
tr.insertCell(1).appendChild(make_subfamhandle(viewobj.subfamid));

/*******
second section, consensus plot
TODO draw for all subfams
*/
if(sfinfo.consensuslen>0) {
	var d=dom_create('div',viewobj.content);
	d.style.display='none';
	viewobj.tabs.cons[1]=d;
	var d2=document.createElement('div');
	d.appendChild(d2);
	if(viewobj.has_input) {
		var s=document.createElement('span');
		s.innerHTML='Treatment read count&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;iteres&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;BWA&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.innerHTML='&nbsp;&nbsp;Input read count&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_input_a.pr+','+qtc_input_a.pg+','+qtc_input_a.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;iteres&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;BWA&nbsp;';
		d2.appendChild(s);
	} else {
		var s=document.createElement('span');
		s.innerHTML='All aligned reads by itere&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.innerHTML='Uniquely aligned reads by BWA&nbsp;';
		d2.appendChild(s);
		s=document.createElement('span');
		s.style.backgroundColor='rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')';
		s.style.color='black';
		s.innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;';
		d2.appendChild(s);
	}
	var s=document.createElement('span');
	s.innerHTML='&#10092;ALL&#10093;';
	s.className='clb4';
	s.style.display='none';
	s.style.marginLeft=50;
	s.key=key;
	s.addEventListener('click', consensusPlot_showall, false);
	viewobj.consensusplot={
		allbutt:s,
		scrollable:[],
		preset_left:0,
		tk2canvas:{},
		};
	d2.appendChild(s);

	d2=document.createElement('div');
	d.appendChild(d2);
	viewobj.consensuswigglediv=d2;
	browser.ajax('repeatbrowser=on&getconsensuswig=on&rpbrDbname='+infodb+'&geo='+geoinfo.acc+'&subfam='+sfinfo.name+'&viewkey='+key,function(data){
		/* construct canvas and scroll holders
		*/
		var vobj=apps.gg.view[data.key];
		var holder=vobj.consensuswigglediv;
		var cplot=vobj.consensusplot;

		var conlen=id2subfam[vobj.subfamid].consensuslen;
		cplot.holderwidth=800;
		cplot.sf=cplot.holderwidth/conlen; // px per bp

		var table=document.createElement('table');
		table.style.marginTop=20;
		holder.appendChild(table);

		/* bp ruler */
		var tr=table.insertRow(0);
		tr.insertCell(0);
		var td=tr.insertCell(1);
		var div=document.createElement('div');
		div.className='scholder';
		div.style.width=cplot.holderwidth;
		td.appendChild(div);
		var c=document.createElement('canvas');
		c.key=data.key;
		c.className='sclb';
		c.height=div.style.height=15; // hard coded?
		c.addEventListener('mousedown',consensusPlot_ruler_md,false);
		div.appendChild(c);
		cplot.scrollable.push(c);
		cplot.rulercanvas=c;

		/* get max/min from assay tracks */
		var max=0, min=0;
		var tmp=wiggle_maxmin(data.treatment_all);
		if(max<tmp[0]) max=tmp[0];
		if(min>tmp[1]) min=tmp[1];
		tmp=wiggle_maxmin(data.treatment_unique);
		if(max<tmp[0]) max=tmp[0];
		if(min>tmp[1]) min=tmp[1];
		if(vobj.has_input) {
			tmp=wiggle_maxmin(data.input_all);
			if(max<tmp[0]) max=tmp[0];
			if(min>tmp[1]) min=tmp[1];
			tmp=wiggle_maxmin(data.input_unique);
			if(max<tmp[0]) max=tmp[0];
			if(min>tmp[1]) min=tmp[1];
		}
		cplot.assayMax=max;
		cplot.assayMin=min;

		/* wiggle treat-all */
		for(var i=0; i<data.treatment_all.length; i++) {
			var dd=data.treatment_all[i];
			var tr=table.insertRow(-1);
			var td=tr.insertCell(0);
			td.align='right';
			td.vAlign='middle';
			td.appendChild(make_filehandle(dd[0], vobj.has_input?'treatment':'file', id2geo[vobj.geoid].treatment.length, i));

			td=tr.insertCell(1);
			div=document.createElement('div');
			div.className='scholder';
			div.style.width=cplot.holderwidth;
			td.appendChild(div);

			var c=document.createElement('canvas');
			c.className='sclb';
			c.key=data.key;
			c.addEventListener('mousedown', consensusPlot_md,false);
			div.appendChild(c);
			c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
			cplot.tk2canvas[dd[0]]=c;
			cplot.scrollable.push(c);
		}
		cplot.treatment_all=data.treatment_all;
		cplot.treatment_unique=data.treatment_unique;

		if(vobj.has_input) {
			// plot input-all
			for(i=0; i<data.input_all.length; i++) {
				var dd=data.input_all[i];
				var tr=table.insertRow(-1);
				var td=tr.insertCell(0);
				td.align='right';
				td.vAlign='middle';
				td.appendChild(make_filehandle(dd[0], 'input', id2geo[vobj.geoid].input.length, i));
				td=tr.insertCell(1);
				div=document.createElement('div');
				div.className='scholder';
				div.style.width=cplot.holderwidth;
				td.appendChild(div);

				var c=document.createElement('canvas');
				c.className='sclb';
				c.key=data.key;
				c.addEventListener('mousedown', consensusPlot_md,false);
				div.appendChild(c);
				c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
				cplot.tk2canvas[dd[0]]=c;
				cplot.scrollable.push(c);
			}
			cplot.input_all=data.input_all;
			cplot.input_unique=data.input_unique;
		}

		/* density wiggle */
		var dmax=0;
		for(i=0; i<data.density.length; i++) {
			var v=data.density[i];
			if(dmax<v) dmax=v;
		}
		cplot.densityMax=dmax;
		cplot.densitydata=data.density;

		tr=table.insertRow(-1);
		td=tr.insertCell(0);
		td.align='center';
		td.vAlign='middle';
		td.innerHTML='TE coverage';
		td=tr.insertCell(1);
		div=document.createElement('div');
		div.className='scholder';
		div.style.width=cplot.holderwidth;
		td.appendChild(div);
		c=document.createElement('canvas');
		c.className='sclb';
		c.key=data.key;
		c.addEventListener('mousedown', consensusPlot_md,false);
		div.appendChild(c);
		c.height=div.style.height=wiggleheight+densitydecorpaddingtop;
		cplot.scrollable.push(c);
		cplot.densitycanvas=c;

		/* sequence */
		if('consensusseq' in data) {
			cplot.sequence=data.consensusseq;
			tr=table.insertRow(-1);
			td=tr.insertCell(0);
			td.align='center';
			td.vAlign='middle';
			td.style.fontWeight='bold';
			td.innerHTML= '<span style="color:'+ntbcolor.a+'">A</span>'+
				'<span style="color:'+ntbcolor.t+'">T</span>'+
				'<span style="color:'+ntbcolor.c+'">C</span>'+
				'<span style="color:'+ntbcolor.g+'">G</span>'+
				'<span style="color:'+ntbcolor.n+'">N</span>';
			td=tr.insertCell(1);
			div=document.createElement('div');
			div.className='scholder';
			div.style.width=cplot.holderwidth;
			td.appendChild(div);
			c=document.createElement('canvas');
			c.className='sclb';
			c.key=data.key;
			c.addEventListener('mousedown', consensusPlot_md,false);
			div.appendChild(c);
			c.height=div.style.height=ideoHeight;
			cplot.scrollable.push(c);
			cplot.seqcanvas=c;
		}

		vobj.tabs.cons[0].innerHTML='Consensus';

		draw_consensusPlot(data.key);
	});
}

/********************
third section, bev
*/
var d=dom_create('div',viewobj.content);
d.style.display='none';
viewobj.tabs.bev[1]=d;
viewobj.bev.holder=d;
viewobj.bev.scoreType=viewobj.has_input?'Log ratio':'Track score';
viewobj.bev.ismain=true;
viewobj.colorscale={};
// this part is duplicated in tkentryclick_add2gg
browser.ajax('repeatbrowser=on&getsubfamcopieswithtk=on'+subfamtrackparam(viewobj.subfamid)+'&geo='+geoinfo.acc+'&viewkey='+key,function(data){
	var vobj=apps.gg.view[data.key];
	make_genomebev_base(vobj,data.key);

	parseData_exp_bev(data,vobj,vobj.bev);

	make_bevcolorscale(vobj,vobj.bev,data.key);

	draw_genomebev_experiment(vobj,vobj.bev);

	vobj.tabs.bev[0].innerHTML='Genome';

	/* rank the repeats by assay value
	*/
	var tosort=[];
	for(var chr in vobj.bev.data) {
		var lst=vobj.bev.data[chr];
		for(i=0; i<lst.length; i++)
			tosort.push([chr, i, lst[i][4]]);
		/* 0: chr, 1: in-chr array idx, 2: data
		*/
	}
	tosort.sort(scoreSort);
	var _r=vobj.rank;
	_r.rarr=tosort;

});

simulateEvent(viewobj.tabs.info[0],'click');

view_gg(key);
cloakPage();
panelFadein(apps.gg.main,50,20);
document.getElementById('viewlstbutt').style.display='inline';
var c=document.getElementById('viewcount');
c.innerHTML=parseInt(c.innerHTML)+1;
/* over, geo+subfam */
}

/* __genome__ graph ends **/



function parseData_exp_bev(data,vobj,bev)
{
var chr2data={};
var lst=apps.gg.chrlst;
for(var i=0; i<lst.length; i++)
	chr2data[lst[i]]=[];
/* genomecopies: raw string from cgi forking
parse it into fields
*/
var Data=[];
for(i=0; i<data.genomecopies.length; i++) {
	var lst=data.genomecopies[i].split(' ');
	var s=lst[5].split(',');
	var ts=[];
	// need to skip the last comma
	for(var j=0; j<s.length-1; j++) ts.push(parseFloat(s[j]));
	var is=[];
	if(vobj.has_input) {
		s=lst[6].split(',');
		for(j=0; j<s.length-1; j++) is.push(parseFloat(s[j]));
	}
	Data.push([lst[0],parseInt(lst[1]),parseInt(lst[2]), lst[3], parseInt(lst[4]), ts, is]);
	/* 0 chrom
	1 start
	2 stop
	3 strand
	4 bed item id
	5 [] treat score
	6 [] input score, could be empty
	*/
}
/* figure out *baseline* value for both treatment and input in computing ratio,
(not the baseline for color scale)
any value lower than baseline will be replaced by baseline
*/
var treatValueLst=[];
var inputValueLst=[];
var mean_t=0; // mean of treatment
var mean_i=0; // mean of input
var count=0; // divisor
for(i=0; i<Data.length; i++) {
	var x=Data[i];
	count++;
		{ // treat
		var s=0;
		for(var j=0; j<x[5].length; j++) s+=x[5][j];
		var v=s/j;
		treatValueLst.push(v);
		mean_t+=v;
		}
	if(vobj.has_input) {
		// input
		var s=0;
		for(var j=0; j<x[6].length; j++) s+=x[6][j];
		var v=s/j;
		inputValueLst.push(v);
		mean_i+=v;
	}
}
mean_t/=count;
mean_i/=count;
/* important change here
if actual value is lower than mean_t/_i, replace with 1
so that their log ratio can be 0
*/
for(i=0; i<treatValueLst.length; i++) {
	var v=treatValueLst[i];
	treatValueLst[i]=v<mean_t?1:v;
}
if(vobj.has_input) {
	for(i=0; i<inputValueLst.length; i++) {
		var v=inputValueLst[i];
		inputValueLst[i]=v<mean_i?1:v;
	}
}
/* compute ratio for each individual repeat
*/
var minv=0, maxv=0;
for(i=0; i<Data.length; i++) {
	var x=Data[i];
	var v=treatValueLst[i];
	if(vobj.has_input) {
		v=Math.log(v/inputValueLst[i])/Math.log(2);
	}
	if(v>maxv) maxv=v;
	else if(v<minv) minv=v;
	chr2data[x[0]].push([x[1],x[2],x[3],x[4],v]);
	/* 
	0 start
	1 stop
	2 strand
	3 bed item id
	4 log ratio
	*/
}
/* !! this array must be sorted by chromosomal order
or tooltipping won't work
*/
for(var c in chr2data)
	chr2data[c].sort(coordSort);
bev.data=chr2data;
bev.minv=minv;
bev.maxv=maxv;
}


function make_bevcolorscale(vobj,bev,key)
{
/*
args:
vobj: obj in apps.gg.view
bev: track specific bev object
key: string
ismain: boolean

!! don't confuse about the two colorscale objects !!
csbj - track-specific colorscale runtime object, attached to a bev object
vobj.colorscale contains scaffold that is shared by all csbj
*/
var csbj={baseline:0}; // colorscale object, track-specific

var d=dom_create('div',vobj.colorscale.cell0);
d.style.display='inline-block';
d.style.width=colorscalewidth;
d.style.textAlign='center';
csbj.header=d;

d=dom_create('div',vobj.colorscale.cell1);
d.style.position='relative';
d.style.width=colorscalewidth;
d.style.display='inline-block';

// slider
var d3=dom_create('div',d);
csbj.sliderpad=d3;
d3.style.position='absolute';
d3.style.top=-15;
d3.style.cursor='default';
d3.bev=bev;
d3.addEventListener('mousedown',colorscale_slider_md,false);
d3.viewkey=key;
d3.style.border='solid 1px #858585';
d3.style.padding='2px 5px';
d3.style.backgroundColor='rgba(255,255,255,0.2)';
d3.style.borderTopLeftRadius=d3.style.borderTopRightRadius=d3.style.borderBottomRightRadius=
d3.style.mozBorderRadiusTopleft=d3.style.mozBorderRadiusTopright=d3.style.mozBorderRadiusBottomright=5;
d3=dom_create('div',d);
d3.style.position='absolute';
csbj.sliderpole=d3;
d3.style.borderLeft='solid 1px #858585';
d3.style.height=45;
d3.style.width=1;

var c=dom_create('canvas',vobj.colorscale.cell2);
csbj.distributionCanvas=c;
c.width=colorscalewidth;
c.height=20;
c.viewkey=key;
c.bev=bev;
c.vobj=vobj;
c.addEventListener('mousemove',scoredistribution_mm,false);
c.addEventListener('mouseout',pica_hide,false);

var d3=dom_create('div',vobj.colorscale.cell3);
d3.className='belowBaselineGradient';
csbj.lowGradient=d3;
d3=dom_create('div',vobj.colorscale.cell3);
d3.className='aboveBaselineGradient';
csbj.highGradient=d3;

c=dom_create('canvas',vobj.colorscale.cell4);
csbj.ruler=c;
c.width=colorscalewidth;
c.height=15;

/***** draw the color scale panel ***/
/* 1. calculate distribution, width of color scale defines resolution
in calculating ratio, many te got value of 0 for below baseline
the 0 ratio count must be escaped so it won't screw histogram
*/
var chr2data=bev.data;
var minv=bev.minv;
var maxv=bev.maxv;
var arr=[]; // histogram
var zc=0; // only in case has_input
for(i=0; i<colorscalewidth; i++) arr[i]=0;
var step=(maxv-minv)/colorscalewidth;
if(vobj.has_input) {
	for(var c in chr2data) {
		var lst=chr2data[c];
		for(i=0; i<lst.length; i++) {
			if(lst[i][4]==0)
				zc++;
			else
				arr[parseInt((lst[i][4]-minv)/step)]+=1;
		}
	}
} else {
	for(var c in chr2data) {
		var lst=chr2data[c];
		for(i=0; i<lst.length; i++)
			arr[parseInt((lst[i][4]-minv)/step)]+=1;
	}
}
csbj.distributionArr=arr;
csbj.scorestep=step;
if(vobj.has_input)
	csbj.zeroRatioCount=zc;
// 2. draw distribution
var _max=0; // max of histogram, escape value at 0
for(i=0; i<arr.length; i++) {if(arr[i]>_max) _max=arr[i];}
var ctx=csbj.distributionCanvas.getContext('2d');
ctx.fillStyle='rgba(255,255,0,0.5)';
var h=csbj.distributionCanvas.height;
for(i=0; i<colorscalewidth; i++) {
	if(arr[i]>0) {
		var h2=(arr[i]/_max)*h;
		ctx.fillRect(i,h-h2,1,h2);
	}
}
if(vobj.has_input) {
	// 2.1 draw zero ratio bar
	ctx.fillStyle='rgba(255,0,0,0.8)';
	ctx.fillRect((0-minv)/step,0,1,h);
}
// 4. draw ruler
plot_ruler({horizontal:true,
	yoffset:0,
	start:0,
	stop:csbj.ruler.width-1,
	min:minv,
	max:maxv,
	ctx:csbj.ruler.getContext('2d'),
	color:'rgba(255,255,255,.6)'}
);

// 5. place slider
csbj.sliderpad.style.left=csbj.sliderpole.style.left=(csbj.baseline-minv)/step;
bev.csbj=csbj;
colorscale_slidermoved(bev);
/*over*/
}

function colorscale_slidermoved(obj)
{
/* take the bev object
*/
var x=parseInt(obj.csbj.sliderpad.style.left);
if(x<0) {
	x=obj.csbj.sliderpad.style.left=
	obj.csbj.sliderpole.style.left=0;
} else if(x>colorscalewidth) {
	x=obj.csbj.sliderpad.style.left=obj.csbj.sliderpole.style.left=colorscalewidth;
}
var bv=obj.minv+x*obj.csbj.scorestep;
obj.csbj.baseline=bv;
obj.csbj.sliderpad.innerHTML=neatstr(bv);
obj.csbj.lowGradient.style.width=x;
obj.csbj.highGradient.style.width=colorscalewidth-x;
}


function colorscale_slider_md(event)
{
event.preventDefault();
document.body.addEventListener('mousemove',colorscale_slider_mm,false);
document.body.addEventListener('mouseup',colorscale_slider_mu,false);
gflag.css={bev:event.target.bev,
viewkey:event.target.viewkey,
oldx:event.clientX,
}
}

function colorscale_slider_mm(event)
{
var bev=gflag.css.bev;
var left=parseInt(bev.csbj.sliderpad.style.left);
var dif=event.clientX-gflag.css.oldx;
if(dif>0) {
	bev.csbj.sliderpad.style.left=bev.csbj.sliderpole.style.left=Math.min(colorscalewidth,left+dif);
} else {
	bev.csbj.sliderpad.style.left=bev.csbj.sliderpole.style.left=Math.max(0,left+dif);
}
colorscale_slidermoved(bev);
gflag.css.oldx=event.clientX;
}

function colorscale_slider_mu(event)
{
document.body.removeEventListener('mousemove',colorscale_slider_mm,false);
document.body.removeEventListener('mouseup',colorscale_slider_mu,false);
draw_genomebev_experiment(apps.gg.view[gflag.css.viewkey],gflag.css.bev);
}



function scoredistribution_mm(event)
{
// over a score distribution graph along with color scale
var vobj=event.target.vobj;
var bev=event.target.bev;
var x=event.clientX-absolutePosition(event.target)[0];
var v=bev.minv+bev.csbj.scorestep*x;
/* in case of has_input, 0 ratio count is omitted because it usually has large number
*/
if(vobj.has_input && v<=0 && v+bev.csbj.scorestep>=0) {
	picasays.innerHTML= neatstr(v)+' to '+neatstr(v+bev.csbj.scorestep)+
	'<br><b>'+bev.csbj.zeroRatioCount+'</b> TEs with 0 ratio'+
	'<div style="color:rgba(255,0,0,0.7)">not represented on the histogram</div>';
} else {
	var num=bev.csbj.distributionArr[x];
	picasays.innerHTML= neatstr(v)+' to '+neatstr(v+bev.csbj.scorestep)+
	(num>0?'<br><b>'+num+'</b> TEs within this range':'');
}
pica_go(event.clientX,absolutePosition(bev.csbj.distributionCanvas)[1]+bev.csbj.distributionCanvas.height-7);
}





/* __rank__ plot, rectangular or spiral **/

function beam_rankitem(event)
{
/* called by pressing <span>, executes once for each rank view
*/
var butt=event.target;
var v=apps.gg.view[butt.key];

var n=parseInt(v.colorscale.numAboveThreshold.innerHTML);
if(!butt.sukngsv) {
	// print coord of all items
	var d=window.open().document;
	for(var i=0; i<n; i++) {
		var t=v.rank.rarr[i];;
		var j=v.bev.data[t[0]][t[1]];
		d.write(t[0]+':'+j[0]+'-'+j[1]+'<br>');
	}
	return;
}

var gi=id2geo[v.geoid];
var si=id2subfam[v.subfamid];
var subfamfile=si.cls+si.fam+si.name;


butt.removeEventListener('click',beam_rankitem,false);
butt.className='';
butt.innerHTML='processing...';

var jlst=[];
var wlst=[];
for(i=0; i<gi.treatment.length; i++) {
	var fn=gi.treatment[i];
	jlst.push({type:'bedgraph',
		name:(gi.input==null?'track '+(i+1):'treatment '+(i+1)),
		url:url_genomebedgraph+fn+'.gz',
		qtc:qtc_treat_u,
		mode:'show'});
}
if(gi.input!=null) {
	for(i=0; i<gi.input.length; i++) {
		var fn=gi.input[i];
		jlst.push({type:'bedgraph',
			name:'input '+(i+1),
			url:url_genomebedgraph+fn+'.gz',
			qtc:qtc_input_u,
			mode:'show'});
	}
}
jlst.push({type:'bed',name:si.name,url:url_subfambed+subfamfile+'.gz',mode:'full'});
jlst.push({type:'native_track',list:[{name:'refGene',mode:'full'}]});

var lastTEid=Math.min(299,n-1);
//var flankbp=parseInt(v.rank.flankSelect.options[v.rank.flankSelect.selectedIndex].value);
var flankbp=5000;
var itemlst=[];
for(var i=0; i<=lastTEid; i++) {
	var t=v.rank.rarr[i];;
	var j=v.bev.data[t[0]][t[1]];
	itemlst.push({c:t[0],
		a:j[0],a1:j[0],
		b:j[1],b1:j[1],
		isgene:false,
		name:t[0]+':'+j[0]+'-'+j[1],
		strand:j[2],
		});
}
var gsobj={lst:itemlst,gss_down:flankbp,gss_up:flankbp,gss_opt:'custom',gss_origin:'genebody'};
browser.genome.gsm_setcoord_gss(gsobj);
var _t=itemlst[10];
jlst.push({ type:'run_genesetview', list:gsobj.lst,viewrange:[itemlst[0].name,itemlst[0].a,_t.name,_t.b]});
ajaxPost('json\n'+JSON.stringify(jlst),function(key){
	v.rank.beambutt.innerHTML='<a href='+url_base+'?genome='+browser.genome.name+
	'&datahub_jsonfile='+url_base+'t/'+key+' target=_blank>Click to view ranked list &#8599;</a>';
});
}

/* __rank__ ends **/


/* __consensus__ plot **/

function draw_consensusPlot(key)
{
/* called by initializing consensusPlot, and zooming
but not by panning, won't redraw graph
need to set width to all scrollables
*/
var vobj=apps.gg.view[key];
var cp=vobj.consensusplot;

var pxwidth=Math.ceil(cp.sf*id2subfam[vobj.subfamid].consensuslen);
for(var i=0; i<cp.scrollable.length; i++) {
	cp.scrollable[i].width=pxwidth;
	cp.scrollable[i].style.left=cp.preset_left;
}

var ctx=cp.rulercanvas.getContext('2d');
plot_ruler({horizontal:true,yoffset:0,ctx:ctx,color:'#858585',start:0,stop:cp.rulercanvas.width-1,
min:0,max:id2subfam[vobj.subfamid].consensuslen});

var canvaslst=[];
for(var i=0; i<cp.treatment_all.length; i++) {
	var dd=cp.treatment_all[i];
	var canvas=cp.tk2canvas[dd[0]];
	var ctx=canvas.getContext('2d');
	canvaslst.push([canvas,ctx]);
    browser.barplot_base(dd[1],
		0,dd[1].length,
		ctx,
		{p:'rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')',
		n:'rgb('+qtc_treat_a.pr+','+qtc_treat_a.pg+','+qtc_treat_a.pb+')'},
		cp.assayMax,cp.assayMin,
		0,densitydecorpaddingtop,
		cp.sf,wiggleheight,true,false);
}
/*    this is what the function is expecting : @8660-base.js
        var data=arg.data,
        ctx=arg.ctx,
        colors=arg.colors,
        tk=arg.tk,
        ridx=arg.rid, // for weaver
        initcoord=arg.initcoord, // for weaver, given for barplot
        x=arg.x, // will be incremented by weaver insert
        y=arg.y,
        pheight=arg.h,
        pointup=arg.pointup,
        w=arg.w,
        tosvg=arg.tosvg;*/

    /*
    * Example invocation :-
    *
    *var svd=this.barplot_base({
     data:data2[i],
     ctx:ctx,
     colors:{p:'rgb('+tkobj.qtc.pr+','+tkobj.qtc.pg+','+tkobj.qtc.pb+')',
     n:'rgb('+tkobj.qtc.nr+','+tkobj.qtc.ng+','+tkobj.qtc.nb+')',
     pth:tkobj.qtc.pth,
     nth:tkobj.qtc.nth,
     barbg:tkobj.qtc.barplotbg},
     tk:tkobj,
     rid:i,
     x:this.cumoffset(i,r[3]),
     y:tkobj.qtc.height>=20?densitydecorpaddingtop:0,
     h:tkobj.qtc.height,
     pointup:true,
     tosvg:tosvg});
     */

/* overlay treat-unique */
for(i=0; i<cp.treatment_unique.length; i++) {
	var dd=cp.treatment_unique[i];
	    barplot_base(dd[1],
		0, dd[1].length,
		canvaslst[i][1],
		{p:'rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')',
		n:'rgb('+qtc_treat_u.pr+','+qtc_treat_u.pg+','+qtc_treat_u.pb+')'},
		cp.assayMax,cp.assayMin,0,densitydecorpaddingtop,
		cp.sf,wiggleheight,true,false);
	plot_ruler({ctx:canvaslst[i][0].getContext('2d'),
		stop:densitydecorpaddingtop,
		start:canvaslst[i][0].height-1,
		xoffset:canvaslst[i][0].width-1,
		horizontal:false,
		color:colorCentral.foreground,
		min:cp.assayMin,
		max:cp.assayMax,
		extremeonly:true,
		max_offset:-4,
		});
}

if(id2geo[vobj.geoid].input!=null) {
	canvaslst=[];
	for(i=0; i<cp.input_all.length; i++) {
		var dd=cp.input_all[i];
		var canvas=cp.tk2canvas[dd[0]];
		var ctx=canvas.getContext('2d');
		canvaslst.push([canvas,ctx]);
		    browser.barplot_base(dd[1],
			0,dd[1].length,
			ctx,
			{p:'rgb('+qtc_input_a.pr+','+qtc_input_a.pg+','+qtc_input_a.pb+')',
			n:'rgb('+qtc_input_a.pr+','+qtc_input_a.pg+','+qtc_input_a.pb+')'},
			cp.assayMax,cp.assayMin,
			0,densitydecorpaddingtop,
			cp.sf,wiggleheight,true,false);
	}
	// overlay input-unique
	for(i=0; i<cp.input_unique.length; i++) {
		var dd=cp.input_unique[i];
		    barplot_base(dd[1],
			0,dd[1].length,
			canvaslst[i][1],
			{p:'rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')',
			n:'rgb('+qtc_input_u.pr+','+qtc_input_u.pg+','+qtc_input_u.pb+')'},
			cp.assayMax,cp.assayMin,0,densitydecorpaddingtop,
			cp.sf,wiggleheight,true,false);
		plot_ruler({ctx:canvaslst[i][0].getContext('2d'),
			stop:densitydecorpaddingtop,
			start:canvaslst[i][0].height-1,
			xoffset:canvaslst[i][0].width-1,
			horizontal:false,
			color:colorCentral.foreground,
			min:cp.assayMin,
			max:cp.assayMax,
			extremeonly:true,
			max_offset:-4,
			});
	}
}

/* density */
ctx=cp.densitycanvas.getContext('2d');
barplot_base(cp.densitydata,0,cp.densitydata.length,
	ctx,
	{p:'rgb('+qtc_density.pr+','+qtc_density.pg+','+qtc_density.pb+')', },
	cp.densityMax,0,0,densitydecorpaddingtop,
	cp.sf,wiggleheight,true,false);
plot_ruler({ctx:cp.densitycanvas.getContext('2d'),
	stop:densitydecorpaddingtop,
	start:cp.densitycanvas.height-1,
	xoffset:cp.densitycanvas.width-1,
	horizontal:false,
	color:colorCentral.foreground,
	min:0,
	max:cp.densityMax,
	extremeonly:true,
	max_offset:-4,
	});

/* sequence */
if(cp.seqcanvas) {
	ctx=cp.seqcanvas.getContext('2d');
	var x=0;
	for(var i=0; i<cp.sequence.length; i++) {
		var b=cp.sequence[i];
		ctx.fillStyle=ntbcolor[b.toLowerCase()];
		ctx.fillRect(x,0,cp.sf,ideoHeight);
		x+=cp.sf;
	}
}
/* over */
}

function consensusPlot_md(event)
{
// pan
if(event.button!=0) return;
event.preventDefault();
document.body.addEventListener('mousemove',consensusPlot_mm,false);
document.body.addEventListener('mouseup',consensusPlot_mu,false);
gflag.pan={cp:apps.gg.view[event.target.key].consensusplot,oldx:event.clientX};
}
function consensusPlot_mm(event)
{
var inc=event.clientX-gflag.pan.oldx;
var lst=gflag.pan.cp.scrollable;
var newl=parseInt(lst[0].style.left)+inc;
for(var i=0; i<lst.length; i++)
	lst[i].style.left=newl;
gflag.pan.oldx=event.clientX;
}
function consensusPlot_mu(event)
{
gflag.pan.cp.preset_left=parseInt(gflag.pan.cp.scrollable[0].style.left);
document.body.removeEventListener('mousemove',consensusPlot_mm,false);
document.body.removeEventListener('mouseup',consensusPlot_mu,false);
}

function consensusPlot_ruler_md(event)
{
if(event.button!=0) return;
event.preventDefault();
var pos=absolutePosition(event.target.parentNode);
var pos2=absolutePosition(event.target);
var z=gflag.zoomin;
z.x=event.clientX;
z.x0=event.clientX; // original x
z.borderleft=Math.max(pos[0],pos2[0]);
z.borderright=Math.min(pos[0]+event.target.parentNode.clientWidth,pos2[0]+event.target.width);
z.inuse=true;
z.viewkey=event.target.key;
indicator.style.display='block';
indicator.style.width=1;
indicator.style.height=event.target.parentNode.parentNode.parentNode.parentNode.clientHeight;
indicator.style.left=event.clientX;
indicator.style.top=pos[1]-1;
document.body.addEventListener('mousemove', consensusPlot_ruler_mm,false);
document.body.addEventListener('mouseup', consensusPlot_ruler_mu,false);
}
function consensusPlot_ruler_mm(event)
{
// duplicative
var z=gflag.zoomin;
if(event.clientX==z.x) return;
var w;
if(event.clientX>z.x0) {
	// on right of original point, only change width
	if(event.clientX>z.borderright)
		return;
	w=indicator.style.width=parseInt(indicator.style.width)+event.clientX-z.x;
} else {
	// on left of original point, change both width and left
	if(event.clientX<z.borderleft)
		return;
	var c=event.clientX-z.x;
	w=indicator.style.width=parseInt(indicator.style.width)-c;
	indicator.style.left=parseInt(indicator.style.left)+c;
}
z.x=event.clientX;
indicator.firstChild.style.backgroundColor=indicator.style.borderColor=
	(w/apps.gg.view[z.viewkey].consensusplot.sf>80) ? 'blue' : 'red';
}
function consensusPlot_ruler_mu(event)
{
if(indicator.style.borderColor=='blue') {
	var z=gflag.zoomin;
	z.inuse=false;
	var cp=apps.gg.view[z.viewkey].consensusplot;
	// set new values of .preset_left and .sf
	var start=parseInt(indicator.style.left)-z.borderleft-cp.preset_left;
	var width=parseInt(indicator.style.width);
	var outbp=start/cp.sf;
	cp.sf=800/(width/cp.sf);
	cp.preset_left=0-outbp*cp.sf;
	draw_consensusPlot(z.viewkey);
	cp.allbutt.style.display='inline';
}
indicator.style.display='none';
document.body.removeEventListener('mousemove', consensusPlot_ruler_mm,false);
document.body.removeEventListener('mouseup', consensusPlot_ruler_mu,false);
}

function consensusPlot_showall(event)
{
event.target.style.display='none';
var vobj=apps.gg.view[event.target.key];
var cp=vobj.consensusplot;
cp.preset_left=0;
cp.sf=800/id2subfam[vobj.subfamid].consensuslen;
draw_consensusPlot(event.target.key);
}

/* __consensus__ ends */




/* __view__ lst */


function click_gghandle(event)
{
var t=event.target;
while(t.className!='skewbox_butt') t=t.parentNode;
view_gg(t.viewkey);
indicator4fly(apps.gg.handleholder,apps.gg.holder,false);
}

function view_gg(key)
{
for(var k in apps.gg.view) {
	apps.gg.view[k].main.style.display='none';
	apps.gg.view[k].handle.style.display='inline-block';
}
apps.gg.view[key].main.style.display='block';
apps.gg.view[key].handle.style.display='none';
}

function show_viewlst(event)
{
pane.style.display='block';
pane.childNodes[2].style.display=
pane.childNodes[1].style.display=
pane.childNodes[4].style.display=
pane.childNodes[3].style.display='none';
pane.childNodes[5].style.display='block';
stripChild(pane.says,0);
placePanel(pane, event.clientX-pane.clientWidth/2,parseInt(pane.style.top));
}

function delete_view(event)
{
var tr=apps.gg.view[event.target.key].viewtr;
tr.parentNode.removeChild(tr);
var m= apps.gg.view[event.target.key].main;
if(m.parentNode)
	pane.childNodes[1].removeChild(m);
stripChild(pane.says,0);
delete apps.gg.view[event.target.key];
afteraddremoveview(false);
}

function afteraddremoveview(add)
{
// arg: boolean
var s=document.getElementById('viewcount');
var count= parseInt(s.innerHTML)+(add?1:-1);
s.innerHTML=count;
var holder=pane.childNodes[5];
if(count>15) {
	holder.style.height=400;
	holder.style.overflowY='scroll';
} else {
	holder.style.height='auto';
	holder.style.overflowY='auto';
}
}

/* __view__ lst ends */


/* __splinter__ 
but this is really different with sukn's splintering
*/
function genomebev_zoomin_md(event)
{
if(event.button!=0) return;
event.preventDefault();
var pos=absolutePosition(event.target);
var z=gflag.zoomin;
z.x=event.clientX;
z.x0=event.clientX; // original x
z.borderleft=pos[0];
z.borderright=pos[0]+event.target.clientWidth;
z.inuse=true;
z.chrom=event.target.chrom;
z.viewkey=event.target.key;
indicator.style.display='block';
indicator.style.width=1;
indicator.style.height=apps.gg.chrbarheight+2;
indicator.style.left=event.clientX;
indicator.style.top=pos[1]-1;
indicator.firstChild.style.backgroundColor=indicator.style.borderColor='blue';
document.body.addEventListener('mousemove', genomebev_splinter_mm,false);
document.body.addEventListener('mouseup', genomebev_splinter_mu,false);
}
function genomebev_splinter_mm(event)
{
if(event.clientX==gflag.zoomin.x) return;
if(event.clientX>gflag.zoomin.x0) {
	// on right of original point, only change width
	if(event.clientX>gflag.zoomin.borderright)
		return;
	indicator.style.width=parseInt(indicator.style.width)+event.clientX-gflag.zoomin.x;
} else {
	// on left of original point, change both width and left
	if(event.clientX<gflag.zoomin.borderleft)
		return;
	var c=event.clientX-gflag.zoomin.x;
	indicator.style.width=parseInt(indicator.style.width)-c;
	indicator.style.left=parseInt(indicator.style.left)+c;
}
gflag.zoomin.x=event.clientX;
}

function genomebev_splinter_mu()
{
var z=gflag.zoomin;
z.inuse=false;
var startcoord=Math.max(0, parseInt((parseInt(indicator.style.left)-z.borderleft)/apps.gg.sf));
var stopcoord=Math.min(browser.genome.scaffold.len[z.chrom], startcoord+parseInt(parseInt(indicator.style.width)/apps.gg.sf));
indicator.style.display='none';
document.body.removeEventListener('mousemove', genomebev_splinter_mm,false);
document.body.removeEventListener('mouseup', genomebev_splinter_mu,false);

var chr_holder=apps.gg.view[z.viewkey].bev.chr2canvas[z.chrom].parentNode;

/* FIXME duplicating code with sukn splintering, in .ajaxX()
but with custom settings, might stay duplicated
*/
var tag=Math.random().toString();
var sdiv=dom_create('div',chr_holder);
sdiv.style.display='table';
sdiv.id='splinter_'+tag;
var d=dom_create('div',sdiv);
d.style.border='solid 1px '+colorCentral.foreground_faint_3;
var chip=new Browser();
chip.hmSpan=800;
chip.leftColumnWidth=0;
chip.browser_makeDoms({
	header:{
		fontsize:'normal',
		fontcolor:colorCentral.foreground_faint_7,
		padding:'2px 0px 4px 0px',
		zoomout:[[2,2]],
		resolution:true,
		utils:{
			print:__splinter_svg,
			link:__splinter_fly,
			bbjconfig:true,
			'delete':__splinter_delete,
		},
	},
	centralholder:d,
	ghm_ruler:true,
	hmdivbg:'transparent'}
);
chip.genome=browser.genome;
chip.runmode_set2default();
chip.facet=
chip.cfacet=null;
chip.applyHmspan2holders();
//chip.ideogram.canvas.splinterTag= chip.rulercanvas.splinterTag=
chip.splinterTag=tag;
chip.splinterCoord=null;
//chip.trunk=browser;
chip.trunk=null;
browser.splinters[tag]=chip;

/* tracks */

// add basic decors
var _tklst=[];;
_tklst.push({name:defaultGeneTrack, ft:FT_anno_n, mode:M_full});
_tklst.push({name:defaultRepeatEnsembleTrack, ft:FT_cat_n, mode:M_show});
var vobj=apps.gg.view[gflag.zoomin.viewkey];

/* always add the subfam track
beware if subfam name contains slash, it must be replaced with _
e.g. ALR/Alpha, BSR/Beta
*/
var si=id2subfam[vobj.subfamid];
_tklst.push({name:si.cls+si.fam+si.name.replace('/','_'), ft:FT_bed_n, mode:M_full});

/* in case of type 2, need to show experimental tracks
*/
if(vobj.type==2) {
	var thisgeoid=vobj.geoid;
	var lku={}; // make a lookup table to tell input/treat of tracks
	chip.ajax_phrase='&rpbr_splinter=on'; // to indicate its special identity
	var gi=id2geo[thisgeoid];
	for(var i=0; i<gi.treatment.length; i++) {
		_tklst.push({name:gi.treatment[i],ft:FT_bedgraph_n, mode:M_show});
		lku[gi.treatment[i]]=true;
	}
	if(gi.input!=null) {
		for(i=0; i<gi.input.length; i++) {
			_tklst.push({name:gi.input[i],ft:FT_bedgraph_n, mode:M_show});
			lku[gi.input[i]]=false;
		}
	}
	for(i=0; i<vobj.tklst.length; i++) {
		gi=id2geo[vobj.tklst[i].geoid];
		for(var j=0; j<gi.treatment.length; j++) {
			_tklst.push({name:gi.treatment[j],ft:FT_bedgraph_n,mode:M_show});
			lku[gi.treatment[j]]=true;
		}
		if(gi.input!=null) {
			for(j=0; j<gi.input.length;j++) {
				_tklst.push({name:gi.input[j],ft:FT_bedgraph_n,mode:M_show});
				lku[gi.input[j]]=false;
			}
		}
	}
	vobj.__tkistreatment=lku;
}
chip.viewobj=vobj;

chip.ajax('addtracks=on&dbName='+basedb+'&runmode='+RM_genome+'&jump=on&jumppos='+z.chrom+':'+startcoord+'-'+stopcoord+trackParam(_tklst),function(data){chip.alethiometer_splinter_build(data);});
}

Browser.prototype.alethiometer_splinter_build=function(data)
{
this.jsonDsp(data);
this.jsonTrackdata(data);
/* now that track display objects are made, need to update its properties
- change label
- change default rendering style
*/
var gi=id2geo[this.viewobj.geoid];
for(var i=0; i<this.tklst.length; i++) {
	var tk=this.tklst[i];
	if(tk.ft==FT_bed_n || tk.ft==FT_anno_n) {
		// a bed track
		if(tk.name in browser.genome.decorInfo) {
			/* this is a native bed decor
			assume it is a gene, need to light up its bedcolor
			*/
			tk.qtc.bedcolor=geneTrackColor;
		} else {
			/* this is a subfam track!!
			which are not formally registered
			*/
			qtc_paramCopy(defaultQtcStyle.ft1, tk.qtc);
			tk.qtc.isrmsk=true;
			tk.label=id2subfam[this.viewobj.subfamid].name;
		}
		tk.qtc.textcolor=colorCentral.foreground;
		tk.qtc.fontsize='8pt';
	} else if(tk.ft==FT_bedgraph_n) {
		// experimental assay tracks
		tk.qtc.height=40;
		if(this.viewobj.__tkistreatment[tk.name]) {
			// a treatment track
			qtc_paramCopy(qtc_treat_u, tk.qtc);
			tk.label=(gi.input==null?'':'treatment: ')+tk.name;
		} else {
			// then it must be input
			qtc_paramCopy(qtc_input_u, tk.qtc);
			tk.label='input: '+tk.name;
		}
	}
	tk.canvas.splinterTag=this.splinterTag;
	tk.canvas.removeEventListener('mouseout',track_Mout,false);
	tk.canvas.addEventListener('mouseout',pica_hide,false);
}
this.drawRuler_browser(false);
this.drawTrack_browser_all();
this.drawIdeogram_browser(false);
};;

function __splinter_delete(event)
{
var tag=gflag.browser.splinterTag;
var d=document.getElementById('splinter_'+tag);
d.parentNode.removeChild(d);
delete browser.splinters[tag];
delete horcrux[tag];
}



function __splinter_svg(event)
{
/* called by pushing "generate graph" buttons
duplicative with sukn's makesvg_browserpanel_pushbutt
light foreground must be replaced with dark color to make svg, then turn back
*/
var pos=absolutePosition(event.target);
var bbj=gflag.browser;
var gwidth=bbj.hmSpan;
var gheight=bbj.main.clientHeight;
/* graph size is now determined */

// change foreground color
var oldforeground=colorCentral.foreground;
colorCentral.foreground='black';
for(var i=0; i<bbj.tklst.length; i++) {
	var t=bbj.tklst[i];
	if(t.ft==FT_bed_n || t.ft==FT_anno_n) {
		t.qtc.textcolor='black';
	}
}

var content=['<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+
	gwidth+'" height="'+gheight+'">'];
content=content.concat(bbj.makesvg_specific({gx:0,svgheight:gheight}));
content.push('</svg>');

// change it back
colorCentral.foreground=oldforeground;
for(var i=0; i<bbj.tklst.length; i++) {
	var t=bbj.tklst[i];
	if(t.ft==FT_bed_n || t.ft==FT_anno_n) {
		t.qtc.textcolor=oldforeground;
	}
}
bbj.render_browser();
ajaxPost('svg\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+gwidth+'" height="'+gheight+'">'+bbj.svg.content.join('')+'</svg>',function(key){__splinter_svg_cb(key,event.target);});
}

function __splinter_svg_cb(key,d)
{
menu_shutup();
menu.c32.style.display='block';
menu.c32.innerHTML='<div style="margin:10px;"><a href="/browser/t/'+key+'" target=_blank>Link to SVG file</a></div>';
menu_show_beneathdom(0,d);
}

function __splinter_fly(event)
{
/* show splinter tracks in sukn
*/
var bbj=gflag.browser;
var jlst=[];
var nativedecor=[];
var subfambed=null;
for(var i=0; i<bbj.tklst.length; i++) {
	var t=bbj.tklst[i];
	if(t.ft==FT_bedgraph_n) {
		jlst.push({type:'bedgraph',name:t.name,label:t.label,url:url_genomebedgraph+t.name+'.gz',qtc:t.qtc,mode:mode2str[t.mode]});
	} else if(t.name in browser.genome.decorInfo) {
		nativedecor.push({name:t.name,mode:mode2str[t.mode]});
	} else {
		// is infact subfam bed
		jlst.push({type:'bed',name:t.name,label:t.label,url:url_subfambed+t.name+'.gz',qtc:t.qtc,mode:mode2str[t.mode]});
	}
}
if(nativedecor.length>0) {
	jlst.push({type:'native_track',list:nativedecor});
}
var t=bbj.getDspStat();
jlst.push({type:'coordinate_override',coord:t[0]+':'+t[1]+'-'+(t[0]==t[2]?t[3]:bbj.genome.scaffold.len[t[0]])});
ajaxPost('json\n'+JSON.stringify(jlst),function(key){bbj.alethiometer_splinter_link(key,event.target);});
}
Browser.prototype.alethiometer_splinter_link=function(key,d)
{
menu_shutup();
menu.c32.style.display='block';
menu.c32.innerHTML='<div style="margin:10px;"><a href='+url_base+'?genome='+this.genome.name+'&datahub_jsonfile='+url_base+'t/'+key+' target=_blank>Click this link to view in WashU EpiGenome Browser</a></div>';
menu_show_beneathdom(0,d);
};;


/* __splinter__ ends */



Browser.prototype.__tkfind_applicationspecific=function(lst)
{
// arg is list of real tk name, to be converted to geoid
var lst2=[];
for(var i=0; i<lst.length; i++) {
	if(lst[i] in realtrack2geoid) {
		lst2.push(id2geo[realtrack2geoid[lst[i]]].acc);
	}
}
return lst2;
};;

/* __scatter__ */

function scatterplot_show_2()
{
/* for comparing two exp over all subfam
*/
toggle19();
apps.scp.bbj=browser;
apps.scp.callback_click=scatterplot_dotclick_2;
apps.scp.callback_mover=scatterplot_dot_mouseover;
apps.scp.callback_submit=scatterplot_submit2;
apps.scp.callback_menudotoption=scatterplot_clickmenu_2;
}

function scatterplot_dotclick_2(event)
{
// called by clicking menu option
var t=apps.scp.data[event.target.idx];
menu_shutup();
var m=menu.c32;
stripChild(m,0);
menu_addoption(null,'Highlight '+id2subfam[t.subfamid].name+' in main panel',scatterplot_clickmenu_2,menu.c32);
m.subfamid=t.subfamid;
m.style.display='block';
menu_show(0,event.clientX,event.clientY);
}
function scatterplot_clickmenu_2()
{
toggle19();
menu_hide();
highlight_subfamid=menu.c32.subfamid;
drawBigmap(false);
}

function scatterplot_submit3()
{
/* scatterplot
for comparing two experiments over all TEs in a subfam
from a genome graph with two experiments
*/
}


function scatterplot_submit2()
{
/* scatterplot
for comparing two experiments over all subfams
*/
var sp=apps.scp;
if(sp.tk1==null || sp.tk2==null || sp.tk1.name==sp.tk2.name) return;
var data1=browser.findTrack(sp.tk1.name).data;
var data2=browser.findTrack(sp.tk2.name).data;
var data=[];
for(var sid in data1) {
	data.push({name:htmltext_subfaminfo(sid,true),
		subfamid:sid,
		x:data1[sid][useRatioIdx],
		y:data2[sid][useRatioIdx]});
}
sp.data=data;
sp.main.__hbutt2.style.display='block';
flip_panel(sp.ui_submit,sp.ui_figure,true);
scatterplot_makeplot(sp);
}

/* __scatter__ ends */

function applyweight_tip()
{
picasays.innerHTML='Apply weight to experimental assay scores of all TE subfamilies<br>'+
'The weight is between 0 and 1, proportional to each TE subfamily total bp # in the genome<br>'+
'Such weight can be used to decrease random fluctuation of TE subfamilies with very low amount of total bp #';
pica_go(250,40);
}
function applyweight_do(event)
{
if(apply_weight) {
	apply_weight=false;
	event.target.innerHTML='Apply weight';
} else {
	apply_weight=true;
	event.target.innerHTML='Remove weight';
}
drawBigmap(true);
}



function add2gg_invoketkselect(event)
{
menu_shutup();
var pos=absolutePosition(event.target);
menu_show(0,pos[0]-document.body.scrollLeft-10,pos[1]-5-document.body.scrollTop+event.target.clientHeight);
browser.showcurrenttrack4select(tkentryclick_add2gg,ftfilter_numerical);
gflag.add2go_key=event.target.key;
}

function tkentryclick_add2gg(event)
{
/* clicking a tkentry, add an experiment to gg
*/
var vobj=apps.gg.view[gflag.add2go_key];
var b=vobj.add_experiment_butt;
b.disabled=true;
b.innerHTML='&nbsp;&nbsp;&nbsp;Running...&nbsp;&nbsp;&nbsp;';
var tk=browser.findTrack(event.target.tkname);
if(tk.geoid==vobj.geoid) {
	shake_dom(menu);
	return;
}
menu_hide();
var t=duplicateTkobj(tk);
t.geoid=tk.geoid;
vobj.tklst.push(t);
/* request data from this experiment over this subfam
a bit replicates menu_genomegraph_2
*/
browser.ajax('repeatbrowser=on&getsubfamcopieswithtk=on'+subfamtrackparam(vobj.subfamid)+'&geo='+id2geo[tk.geoid].acc+'&viewkey='+gflag.add2go_key,function(data){
	var vobj=apps.gg.view[data.key];
	var b=vobj.add_experiment_butt;
	b.disabled=false;
	b.innerHTML='Add another experiment';

	var tkobj=vobj.tklst[vobj.tklst.length-1]; // shaky
	tkobj.bev={ismain:false};

	parseData_exp_bev(data,vobj,tkobj.bev);

	make_bevcolorscale(vobj,tkobj.bev,data.key);
	tkobj.bev.csbj.header.appendChild(make_geohandle(tkobj.geoid,'experiment'));
	s=dom_addtext(tkobj.bev.csbj.header,'delete');
	s.addEventListener('click',delete_bev_experiment,false);
	s.geoid=tkobj.geoid;
	s.vobj=vobj;
	s.bev=tkobj.bev;

	tkobj.bev.chr2canvas={};
	for(var chr in tkobj.bev.data) {
		var c=dom_create('canvas',vobj.bev.chr2holder[chr]);
		c.style.display='block';
		c.chrom=chr;
		c.key=data.key;
		tkobj.bev.chr2canvas[chr]=c;
		c.width=apps.gg.sf*browser.genome.scaffold.len[chr];
		c.height=apps.gg.chrbarheight;
		c.className='clb5';
		var ctx=c.getContext('2d');
		ctx.fillStyle='black';
		ctx.fillRect(0,0,c.width,c.height);
		c.addEventListener('mousemove', genomebev_tooltip_mousemove, false);
		c.addEventListener('mouseout', pica_hide, false);
		c.addEventListener('mousedown', genomebev_zoomin_md, false);
	}
	draw_genomebev_experiment(vobj,tkobj.bev);
});
/*over*/
}


function delete_bev_experiment(event)
{
/* called by clicking on span
delete an experiment from vobj.tklst, and from bev panel
*/
var vobj=event.target.vobj;
var bev=event.target.bev;
var s=vobj.colorscale;
s.cell0.removeChild(bev.csbj.header);
s.cell1.removeChild(bev.csbj.sliderpad.parentNode);
s.cell2.removeChild(bev.csbj.distributionCanvas);
s.cell3.removeChild(bev.csbj.lowGradient);
s.cell3.removeChild(bev.csbj.highGradient);
s.cell4.removeChild(bev.csbj.ruler);
for(var chr in bev.data)
	vobj.bev.chr2holder[chr].removeChild(bev.chr2canvas[chr]);
for(var i=0; i<vobj.tklst.length; i++) {
	if(vobj.tklst[i].geoid==event.target.geoid) {
		vobj.tklst.splice(i,1);
		break;
	}
}
}


function repeatbrowser_load(data)
{
if(!data) {
	alert('Failed to init browser: server error!');
	return;
}
browser.genome=new Genome(browser.init_genome_param);
browser.genome.name=basedb;
browser.genome.jsonGenome(data);
var s=browser.genome.scaffold;
browser.genome.border={lname:s.current[0],
	lpos:0,
	rname:s.current[s.current.length-1],
	rpos:s.len[s.current[s.current.length-1]]};

// must manually init facet
browser.makeui_facet_panel();
browser.facetlst=[];

browser.migratedatafromgenome();

var lst=browser.genome.scaffold.current;
apps.gg.chrlst=[];
// exclude chrM??
for(var i=0; i<lst.length; i++) {
	if(lst[i]!='chrM') apps.gg.chrlst.push(lst[i]);
}
lst=apps.gg.chrlst;
var maxlen=0;
for(i=0; i<lst.length; i++) {
	maxlen=Math.max(browser.genome.scaffold.len[lst[i]],maxlen);
}
apps.gg.sf=apps.gg.width/maxlen;

/* all the TE subfam */
for(var i=0; i<data.subfam.length; i++) {
	var v=data.subfam[i];
	subfam2id[v[0]]=v[1];
	id2subfam[v[1]]={
		name:v[0],
		genomelen:v[2],
		fam:v[3],
		cls:v[4],
		consensuslen:v[5],
		copycount:v[6]
		};
	col_runtime.push(v[1]);
	col_runtime_all.push(v[1]);
}
// calculate weight
var maxbp=0;
for(i in id2subfam) {
	maxbp=Math.max(id2subfam[i].genomelen,maxbp);
}
for(i in id2subfam) {
	id2subfam[i].weight=id2subfam[i].genomelen/maxbp;
}

/* entire set of geo */
for(i=0; i<data.geo.length; i++) {
	var v=data.geo[i];
	// geo, id, label, treatFiles, inputFiles
	geo2id[v[0]]=v[1];
	id2geo[v[1]]={
		acc:v[0],
		label:v[2],
		treatment:v[3].split(','),
		input:(v[4].length==0?null:v[4].split(','))
	};
}
repeatbrowser_loadhub_recursive();
}

function repeatbrowser_loadhub_recursive()
{
while(datahuburllst.length>0) {
	browser.loadhub_urljson(datahuburllst[0],repeatbrowser_loadhub_recursive_cb);
	datahuburllst.splice(0,1);
	return;
}
/* replace .genome.hmtk with entire set of GSM
data.geo2track: GSM as key, hmtk track name as value
geo2id: contains entire set of GSM used in repeatbrowser
*/
var newhash={};
for(var n in browser.genome.hmtk) {
	var t=browser.genome.hmtk[n];
	if(!t.geolst) continue;
	for(var i=0; i<t.geolst.length; i++) {
		var gsm=t.geolst[i];
		if(!(gsm in geo2id)) continue;
		var gid=geo2id[gsm];
		t.label=id2geo[gid].label;
		newhash[gsm]=t;
		geoid2realtrack[gid]=n;
		realtrack2geoid[n]=gid;
	}
}
browser.genome.hmtk=newhash;
browser.move.styleLeft=0;
browser.hmdiv.style.left=0;
pagemask();
browser.ajax_addtracks_names(geopreload.split(','));
}

function repeatbrowser_loadhub_recursive_cb()
{
var lst=browser.init_bbj_param?browser.init_bbj_param.tklst:null;
if(lst) {
	for(var i=0; i<lst.length; i++) {
		browser.genome.registerCustomtrack(lst[i]);
	}
}
delete browser.init_bbj_param;
pagemask();
repeatbrowser_loadhub_recursive();
}


function alethiometer_addtk_cb(data,geoacclst)
{
/* the json 'data' use geo accession as key
so track name must be converted to geo to retrieve data
*/
for(var i=0; i<browser.tklst.length; i++) {
	var t=browser.tklst[i];
	if(t.geoid in data) {
		// this is a new track
		t.data=data[t.geoid];
		t.canvas.oncontextmenu=menu_bigmap;
		t.header.oncontextmenu=menu_track_bigmap;
	}
}
browser.initiateMdcOnshowCanvas();
drawBigmap(true);
/* this is because removing track is sukn-native
will shrink bigmap height
so when any tracks are added the bigmap height is restored
*/
browser.hmdiv.parentNode.style.height=
browser.mcm.tkholder.parentNode.style.height=document.body.clientHeight-200;
if(gflag.menu.context==undefined) {
	browser.generateTrackselectionLayout(0);
} else {
	browser.aftertkaddremove(geoacclst);
}
loading_done();
}



function readygo()
{
colorCentral.foreground='rgb(230,235,230)';
colorCentral.background='#000000';
colorCentral.fg_r=188;
colorCentral.fg_g=201;
colorCentral.fg_b=188;
colorCentral.hl='#1814FD';
colorCentral.pagebg='rgb(0,0,30)';
regionSpacing.color='black';

document.body.addEventListener('keyup',page_keyup,false);
document.getElementById('headerdiv').style.backgroundColor=colorCentral.pagebg;

colheader_holder=document.getElementById('mapcolheader_holder');

gflag.zoomin={x:null, atfinest:false};

var c='rgba('+colorCentral.fg_r+','+colorCentral.fg_g+','+colorCentral.fg_b+',0.7)';

page_makeDoms(
	{
	app_bbjconfig:true,
	cp_scatter:{
		htextcolor:c,
		htext:'Scatter plot',
		hbutt1:{text:'&#10005;',
			bg:c,
			fg:'black',
			call:toggle19},
		hbutt2:{text:'Go back',
			call:scatterplot_goback,
			fg:'white',
			bg:'#545454'},
		},
	cp_hmtk:{
		htextcolor:c,
		htext:'Experimental assay tracks',
		hbutt1:{text:'&#10005;',
			bg:c,
			fg:'black',
			call:toggle1_2},
		},
	}
);

apps.hmtk.holder.nextSibling.innerHTML='';

// hide region input from scatterplot
var s=apps.scp;
s.input_tr.style.display='none';
s.dotcolor_r=s.dotcolor_g=s.dotcolor_b=255;
s.dotcolor_span.style.backgroundColor='#ffffff';
s.dotcolor_span.style.color='black';
s.dot_opacity=0.2;

// make app for genome graph
var d=make_controlpanel({htextcolor:c,
	htext:'Detailed view',
	hbutt1:{text:'&#10005;',
		bg:c,
		fg:'black',
		call:pane_hide},
	hbutt2:{}
	});
apps.gg={main:d};
var d2=d.__hbutt2.parentNode;
apps.gg.handleholder=d2;
stripChild(d2,0);
d2.style.padding='';
apps.gg.holder=dom_create('div',d.__contentdiv);
apps.gg.view={};
apps.gg.chrbarheight=14;
apps.gg.chrwidth={};
apps.gg.decortklst=[];
/* viewobj.type:
1. only shows position of genome copies of a subfam
2. a subfam and a geo data set
*/

pagecloak.style.backgroundColor='rgb(0,30,0)';
pagecloak.style.opacity=0.85;

menu.style.backgroundColor='black';
menu.style.webkitBoxShadow=menu.style.boxShadow='';
menu.style.borderLeftColor=menu.style.borderRightColor='rgba(133,133,133,0.6)';

menu.removeChild(menu.c23);
delete menu.c23;
menu.c200=menu_addoption('&#9733;','View details',menu_genomegraph_2,menu);

menu.removeChild(menu.c16);
menu.c16=menu_addoption('&#9432;','Information',menu_getExperimentInfo_2,menu);

menu.removeChild(menu.c25);
menu.c25=menu_addoption('&#10010','Add metadata terms',menu_mcm_invokemds,menu);

menu.c203=menu_addoption(null,'View genome copies for <span id=cmo3_says></span>',menu_genomegraph_1,menu);
menu.infowrapper=dom_create('div',menu);
menu.tksort=menu_addoption(null,'Sort',sortcolumn_bytrack,menu);
menu.linkholder=dom_create('div',menu);
var d=dom_create('div',menu.linkholder);
d.style.padding=8;
d.style.lineHeight=1.5;
d.innerHTML='Human reference genome version is hg19/GRCh37<br>'+
'<a href=http://hgdownload.soe.ucsc.edu/goldenPath/hg19/bigZips/ target=_blank>UCSC Genome Browser</a> provides RepeatMasker annotation data<br>'+
'<a href=http://genome.ucsc.edu/ENCODE/ target=_blank>ENCODE Project</a> provides transcription factor ChIP-Seq results<br>'+
'<a href=http://www.roadmapepigenomics.org/ target=_blank>Roadmap Epigenomics Project</a> provides epigenomics assay results<br>'+
'<a href=http://epigenomegateway.wustl.edu target=_blank style="text-decoration:none;background-color:#333;border-radius:4px;-moz-border-radius:4px;padding:2px 5px;"><br>'+
washUtag+'</a> powers this service';

menu.c201=menu_addoption(null,'Find a transposon subfamily',menu_showsearchui,menu);
menu.c202=dom_create('div',menu);
menu.c202.style.padding=8;
menu.c202.innerHTML='<input type=text id=find_te_input value="enter transposon name" \
onkeyup="find_te_ku(event)" \
onfocus="if(this.value==\'enter transposon name\') this.value=\'\'" \
onblur="if(this.value.length==0) this.value=\'enter transposon name\';"> \
<button type=button onclick="find_te()">Find</button><br>\
<div id=find_te_msg style="display:none;margin:10px;padding:5px;background-color:#333;"></div>';

pica.style.borderColor='#858585';
pica.x=0; // .x is array index of col_runtime
picasays.style.color='';

//daofeng added
Browser.prototype.makeui_facet_panel = function(){};
//daofeng added end

browser=new Browser();
var d=document.getElementById('alethiometer');
d.ismaintable=true;
d.onmouseover=browser_table_mover;
d.bbj=browser;

/*** not calling browser_makeDoms
**/
for(var i=0; i<mdlst_row.length; i++) {
	browser.mcm.lst.push([mdlst_row[i],0]);
}
browser.mcm.holder=document.getElementById('tkmcm_headerholder');
browser.mcm.tkholder=document.getElementById('mcm_tkholder');
browser.hmheaderdiv=document.getElementById('hmheaderdiv');
browser.hmdiv=document.getElementById('hmdiv');
browser.makeui_facet_panel();

apps.gg.width=
browser.hmSpan=
browser.hmdiv.parentNode.style.width=
colheader_holder.parentNode.style.width= document.body.clientWidth-browser.mcm.lst.length*tkAttrColumnwidth-rowlabelwidth-30;

//browser.hmdiv.parentNode.style.height=
browser.mcm.tkholder.parentNode.style.height=
browser.hmheaderdiv.parentNode.style.height= document.body.clientHeight-200;

// things to turn off
browser.genesetview=null;

/*** subfam attribute header
***/
var holder=document.getElementById('temcm_headerholder');
for(var i=0; i<temcm_attrlst.length; i++) {
	var c=document.createElement('canvas');
	c.width=rowlabelwidth;
	c.height=temcm_cellheight-2;
	c.className='tkattrnamevcanvas';
	c.style.display='block';
	c.addEventListener('click', temcm_click, false);
	c.idx=i;
	holder.appendChild(c);
	var ctx=c.getContext('2d');
	ctx.font='10px Sans-serif';
	ctx.fillStyle='white';
	ctx.fillText(temcm_attrlst[i], rowlabelwidth-ctx.measureText(temcm_attrlst[i]).width, 8);
}


gflag.browser=browser;
browser.init_genome_param={custom_track:true};

pagemask();

browser.ajax('loadgenome=on&dbName='+basedb+'&rpbrDbname='+infodb+'&rpbr_init=on',function(data){repeatbrowser_load(data);});
}
