/**
 * __splinter__
 * @param event
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