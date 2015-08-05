/**
 * @param vobj
 */

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

    /*dpuru : editing UI features : 4Aug2015*/
    d.style.backgroundColor='rgb(255,255,255)';
    d.style.borderRadius='10px 10px 10px 10px';
    d.style.boxShadow='10px 10px 19px -5px rgba(168,159,168,1)';
    /*end edit*/

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
