/**
 * Created by dpuru on 2/27/15.
 */
/*** __palette__ ***
 a pair of two functions,
 - xx_initiator()
 toggles on palette, register xx() for click event
 - xx()
 capture color and do stuff, hide palette, remove event registry
 */
function paletteMover() {
    document.body.removeEventListener('mousedown', palettehide, false);
    document.body.removeEventListener('mousedown', menu_hide, false);
}
function paletteMout() {
    document.body.addEventListener('mousedown', palettehide, false);
    document.body.addEventListener('mousedown', menu_hide, false);
}
function palette_context_update() {
    switch (palette.which) {
        case 1:
            stc_textcolor();
            return;
        case 2:
            stc_bedcolor();
            return;
        case 3:
            stc_forwardcolor();
            return;
        case 4:
            stc_reversecolor();
            return;
        case 5:
            stc_mismatchcolor();
            return;
        case 6:
            stc_longrange_pcolor();
            return;
        case 8:
            stc_longrange_ncolor();
            return;
        case 10:
            hengeview_arcpcolor();
            return;
        case 11:
            hengeview_arcncolor();
            return;
        case 12:
            mcm_configcolor();
            return;
        case 13:
            scatterplot_dotcolor();
            return;
        case 14:
            matplot_linecolor();
            return;
        case 15:
            tk_bgcolor();
            return;
        case 16:
            cmtk_color_set();
            return;
        case 17:
            ldtk_color_set();
            return;
        case 20:
            document.getElementById('geneplot_s4_pc').style.backgroundColor = palette.output;
            return;
        case 21:
            document.getElementById('geneplot_s4_nc').style.backgroundColor = palette.output;
            return;
        case 22:
            document.getElementById('geneplot_s1_lc').style.backgroundColor = palette.output;
            return;
        case 23:
            document.getElementById('geneplot_s2_lc').style.backgroundColor = palette.output;
            return;
        case 24:
            document.getElementById('geneplot_s3_promoterc').style.backgroundColor = palette.output;
            return;
        case 25:
            document.getElementById('geneplot_s3_utr5c').style.backgroundColor = palette.output;
            return;
        case 26:
            document.getElementById('geneplot_s3_utr3c').style.backgroundColor = palette.output;
            return;
        case 27:
            document.getElementById('geneplot_s3_exonsc').style.backgroundColor = palette.output;
            return;
        case 28:
            document.getElementById('geneplot_s3_intronsc').style.backgroundColor = palette.output;
            return;
        case 30:
            menu.c50.color1.style.backgroundColor = palette.output;
            menu_update_track(1);
            return;
        case 31:
            menu.c50.color2.style.backgroundColor = palette.output;
            menu_update_track(2);
            return;
        case 32:
            menu.c50.color1_1.style.backgroundColor = palette.output;
            menu_update_track(3);
            return;
        case 33:
            menu.c50.color2_1.style.backgroundColor = palette.output;
            menu_update_track(4);
            return;
        case 39:
            custcate_submitui_setcolor();
            return;
        case 40:
            hengeview_wreathpcolor();
            return;
        case 41:
            hengeview_wreathncolor();
            return;
        case 42:
            cateTkitemcolor();
            return;
        case 43:
            tk_barplotbg();
            return;
        default:
            fatalError("palette_context_update: unknown palette.which");
    }
}
function palettehide() {
    palette.style.display = "none";
    document.body.removeEventListener("mousedown", palettehide, false);
}
function paletteshow(x, y, which) {
// x and y should be event.clientX/Y
// TODO automatic beak placement, ...
    palette.style.display = "block";
    var w = 200;
    if (x + w > document.body.clientWidth) {
        x = document.body.clientWidth - w;
    } else {
        x -= 80;
    }
    var h = 250;
    if (y + h > document.body.clientHeight) {
        y = document.body.clientHeight - h - 40;
    } else {
        y += 5;
    }
    palette.style.left = x;
    palette.style.top = y;
    palette.which = which;
    document.body.addEventListener('mousedown', palettehide, false);
}
function palettedyeclick(event) {
    // clicking palette dye
    palettegrove_paint(event.target.style.backgroundColor);
    palette.output = event.target.style.backgroundColor;
    palette_context_update();
}
function palettegrove_paint(color) {
    palette.grove.color = color;
    var ctx = palette.grove.getContext('2d');
    var lingrad = ctx.createLinearGradient(0, 0, 100, 0);
    lingrad.addColorStop(0, 'black');
    lingrad.addColorStop(0.5, color);
    lingrad.addColorStop(1, 'white');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, 100, 20);
}
function palettesliderMD(event) {
    // palette slider md
    event.preventDefault();
    palette.slider.x = event.clientX;
    document.body.addEventListener("mousemove", palettesliderM, false);
    document.body.addEventListener("mouseup", palettesliderMU, false);
}
function palettesliderM(event) {
    var x = event.clientX;
    var oldx = palette.slider.x;
    var l = parseInt(palette.slider.style.left);
    if ((x > oldx && l >= 100) || (x < oldx && l <= 0))
        return;
    palette.slider.style.left = l + x - oldx;
    l = parseInt(palette.slider.style.left);
    if (l > 100)
        palette.slider.style.left = 100;
    else if (l < 0)
        palette.slider.style.left = 0;
    palette.slider.x = event.clientX;
}
function palettesliderMU() {
    document.body.removeEventListener("mousemove", palettesliderM, false);
    document.body.removeEventListener("mouseup", palettesliderMU, false);
    var x = parseInt(palette.slider.style.left);
    if (x == 50)
        palette.output = palette.grove.color;
    else if (x < 50)
        palette.output = darkencolor(colorstr2int(palette.grove.color), (100 - x * 2) / 100);
    else
        palette.output = lightencolor(colorstr2int(palette.grove.color), (x - 50) / 50);
    palette_context_update();
}
function palettegrove_click(event) {
    // clicking on palette grove to pick up a color from the gradient
    var pos = absolutePosition(palette.grove);
    palette.slider.style.left = event.clientX - pos[0];
    var x = parseInt(palette.slider.style.left);
    if (x == 50)
        palette.output = palette.grove.color;
    else if (x < 50)
        palette.output = darkencolor(colorstr2int(palette.grove.color), (100 - x * 2) / 100);
    else
        palette.output = lightencolor(colorstr2int(palette.grove.color), (x - 50) / 50);
    palette_context_update();
}


function tk_bgcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 15);
    palettegrove_paint(menu.c44.color.style.backgroundColor);
}
function tk_bgcolor() {
    menu.c44.color.style.backgroundColor = palette.output;
    menu_update_track(33);
}

function tk_barplotbg_initiator(event) {
    paletteshow(event.clientX, event.clientY, 43);
    palettegrove_paint(menu.c44.color.style.backgroundColor);
}
function tk_barplotbg() {
    menu.c29.color.style.backgroundColor = palette.output;
    menu_update_track(36);
}

function cmtk_color_initiate(event) {
    paletteshow(event.clientX, event.clientY, 16);
    palettegrove_paint(event.target.style.backgroundColor);
    gflag.menu.cmtk_colorcell = event.target;
}
function cmtk_color_set() {
    gflag.menu.cmtk_colorcell.style.backgroundColor = palette.output;
    menu_update_track(27);
}


function stc_textcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 1);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_textcolor() {
    menu.font.color.style.backgroundColor = palette.output;
    menu_update_track(11);
}
function stc_bedcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 2);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_bedcolor(event) {
    menu.bed.color.style.backgroundColor = palette.output;
    menu_update_track(10);
}
function stc_forwardcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 3);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_forwardcolor() {
    menu.bam.f.style.backgroundColor = palette.output;
    menu_update_track(15);
}
function stc_reversecolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 4);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_reversecolor() {
    menu.bam.r.style.backgroundColor = palette.output;
    menu_update_track(16);
}
function stc_mismatchcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 5);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_mismatchcolor() {
    menu.bam.m.style.backgroundColor = palette.output;
    menu_update_track(17);
}
function stc_longrange_pcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 6);
//gflag.menu.context==1?6:10);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_longrange_pcolor(event) {
    longrange_showplotcolor(palette.output);
    menu_update_track(19);
}
function stc_longrange_ncolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 8);
//gflag.menu.context==1?8:11);
    palettegrove_paint(event.target.style.backgroundColor);
}
function stc_longrange_ncolor(event) {
    longrange_showplotcolor(null, palette.output);
    menu_update_track(20);
}

function hengeview_arcpcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 10);
    palettegrove_paint(event.target.style.backgroundColor);
}
function hengeview_arcpcolor() {
    var c = colorstr2int(palette.output);
    apps.circlet.hash[gflag.menu.viewkey].callingtk.pcolor = c.join(',');
    hengeview_draw(gflag.menu.viewkey);
    longrange_showplotcolor(palette.output, null);
}
function hengeview_arcncolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 11);
    palettegrove_paint(event.target.style.backgroundColor);
}
function hengeview_arcncolor() {
    var c = colorstr2int(palette.output);
    apps.circlet.hash[gflag.menu.viewkey].callingtk.ncolor = c.join(',');
    hengeview_draw(gflag.menu.viewkey);
    longrange_showplotcolor(null, palette.output);
}
function hengeview_wreathpcolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 40);
    palettegrove_paint(event.target.style.backgroundColor);
    palette.hook = event.target; // contains track name
}
function hengeview_wreathpcolor() {
    palette.hook.style.backgroundColor = palette.output;
    var c = colorstr2int(palette.output);
    var tkn = palette.hook.parentNode.parentNode.tkname;
    var lst = apps.circlet.hash[gflag.menu.viewkey].wreath;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].name == tkn) {
            lst[i].qtc.pr = c[0];
            lst[i].qtc.pg = c[1];
            lst[i].qtc.pb = c[2];
            break;
        }
    }
    hengeview_draw(gflag.menu.viewkey);
}
function hengeview_wreathncolor_initiator(event) {
    paletteshow(event.clientX, event.clientY, 41);
    palettegrove_paint(event.target.style.backgroundColor);
    palette.hook = event.target; // contains track name
}
function hengeview_wreathncolor() {
    palette.hook.style.backgroundColor = palette.output;
    var c = colorstr2int(palette.output);
    var tkn = palette.hook.parentNode.parentNode.tkname;
    var lst = apps.circlet.hash[gflag.menu.viewkey].wreath;
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].name == tkn) {
            lst[i].qtc.nr = c[0];
            lst[i].qtc.ng = c[1];
            lst[i].qtc.nb = c[2];
            break;
        }
    }
    hengeview_draw(gflag.menu.viewkey);
}

function stc_longrange_autoscale(event) {
// toggling checkbox
    menu.lr.pcscore.parentNode.style.display = menu.lr.ncscore.parentNode.style.display = event.target.checked ? 'none' : 'inline';
    menu.lr.pcscoresays.style.display = menu.lr.ncscoresays.style.display = event.target.checked ? 'inline' : 'none';
    menu_update_track(18);
}

function stc_longrange_pcolorscore() {
    /* apply positive score cutoff for coloring
     TODO hammock generic
     */
    var score = parseFloat(menu.lr.pcscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for positive score cutoff', 2);
        return;
    }
    if (score < 0) {
        print2console('score cutoff must be positive', 2);
        return;
    }
    menu_update_track(21);
}
function stc_longrange_ncolorscore() {
    /* apply negative score cutoff for coloring
     TODO hammock
     */
    var score = parseFloat(menu.lr.ncscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for negative score cutoff', 2);
        return;
    }
    if (score > 0) {
        print2console('score cutoff must be negative', 2);
        return;
    }
    menu_update_track(22);
}

function stc_longrange_pfilterscore() {
    /* apply positive score cutoff for filtering
     TODO hammock
     */
    var score = parseFloat(menu.lr.pfscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for positive score cutoff', 2);
        return;
    }
    if (score < 0) {
        print2console('score cutoff must be positive', 2);
        return;
    }
    menu_update_track(23);
}
function stc_longrange_nfilterscore() {
    /* apply negative score cutoff for filtering
     TODO hammock
     */
    var score = parseFloat(menu.lr.nfscore.value);
    if (isNaN(score)) {
        print2console('Invalid input for negative score cutoff', 2);
        return;
    }
    if (score > 0) {
        print2console('score cutoff must be negative', 2);
        return;
    }
    menu_update_track(24);
}

/*** __palette__ ends ***/