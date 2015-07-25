/**
 * args:
 * str
 * color:
 * bg:
 * bottom: boolean if string start from bottom
 * horizontal: boolean
 * @param param
 * @return c
 */

function makecanvaslabel(param) {
    /* make canvas with string plotted vertically
     args:
     - str
     - color:
     - bg:
     - bottom: boolean if string start from bottom
     - horizontal: boolean
     */
    var c = document.createElement("canvas");
    var ctx = c.getContext('2d');
    if (param.horizontal) {
        c.height = tkAttrColumnWidth - 2;
    } else {
        c.width = tkAttrColumnWidth - 2; // FIXME
    }
    if (param.bg) {
        c.style.backgroundColor = colorCentral.pagebg;
    }
    ctx.font = "10pt Sans-serif";
    var w = ctx.measureText(param.str).width;
    var truncate = false;
    if (w + 10 > 200) {
        if (param.horizontal) {
            c.width = 200;
        } else {
            c.height = 200;
        }
        truncate = true;
    } else {
        if (param.horizontal) {
            c.width = w + 10;
        } else {
            c.height = w + 10;
        }
    }
    ctx.font = "10pt Sans-serif";
    ctx.fillStyle = param.color ? param.color : colorCentral.foreground;
    if (param.horizontal) {
        ctx.fillText(param.str, 0, 12);
        if (truncate) {
            var x = c.width - 14;
            ctx.clearRect(x, 0, 14, 12);
            ctx.font = "bold 11pt Georgia";
            ctx.fillText('...', x, 12);
        }
    } else {
        if (param.bottom) {
            ctx.rotate(Math.PI * 1.5);
            ctx.fillText(param.str, -c.height + 2, 12);
        } else {
            ctx.rotate(Math.PI * 0.5);
            ctx.fillText(param.str, 0, 0);
        }
        if (truncate) {
            ctx.clearRect(-14, 0, 14, 12);
            ctx.font = "bold 11pt Georgia";
            ctx.fillText('...', -14, 12);
        }
    }
    return c;
}