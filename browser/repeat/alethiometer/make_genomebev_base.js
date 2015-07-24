/**
 * draw barebone genomegraph , argument is view object that hasn't been initialized
 * @param vobj
 * @param key
 */

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
