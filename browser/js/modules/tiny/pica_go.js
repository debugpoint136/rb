function pica_go(x, y) {
// x/y does not contain scroll offset
// if is null, won't change x/y
    pica.style.display = 'block';
    if (x != null) {
        var xx = document.body.clientWidth;
        if (x > xx - pica.clientWidth) {
            pica.style.left = '';
            pica.style.right = xx - x + 10;
        } else {
            pica.style.right = '';
            pica.style.left = x + 10;
        }
    }
    if (y != null) {
        var yy = document.body.clientHeight;
        if (y > yy - pica.clientHeight) {
            pica.style.top = '';
            pica.style.bottom = document.body.clientHeight - y;
        } else {
            pica.style.bottom = '';
            pica.style.top = y + 10;
        }
    }
}