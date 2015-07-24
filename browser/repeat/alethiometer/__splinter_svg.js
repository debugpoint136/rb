/**
 * __splinter__ called by pushing "generate graph" buttons
 * @param event
 */

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
    ajaxPost('svg\n<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="'+gwidth+'" height="'+gheight+'">'
            +bbj.svg.content.join('')+'</svg>',
            function(key){
                __splinter_svg_cb(key,event.target);
            });
}