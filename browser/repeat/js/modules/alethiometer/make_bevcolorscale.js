/**
 * @param vobj
 * @param bev
 * @param key
 */

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