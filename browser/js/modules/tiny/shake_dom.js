function shake_dom(dom) {
    gflag.shakedom = dom;
    var l = parseInt(dom.style.left);
    var s = 50;
    setTimeout('gflag.shakedom.style.left="' + (l - 5) + '"', s);
    setTimeout('gflag.shakedom.style.left="' + (l + 5) + '"', s * 2);
    setTimeout('gflag.shakedom.style.left="' + (l - 5) + '"', s * 3);
    setTimeout('gflag.shakedom.style.left="' + (l + 5) + '"', s * 4);
    setTimeout('gflag.shakedom.style.left="' + l + '"', s * 5);
}