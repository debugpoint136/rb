/**
 * Created by dpuru on 2/27/15.
 */
/*** __lr__ longrange specific ***/

function longrange_showplotcolor(pcolor, ncolor) {
// plot the two color stripe in the menu config panel
    if (pcolor) {
        var c = menu.lr.pcolor;
        c.style.backgroundColor = pcolor;
        var ctx = c.getContext('2d');
        var lingrad = ctx.createLinearGradient(0, 0, c.width, 0);
        lingrad.addColorStop(0, 'white');
        lingrad.addColorStop(1, pcolor);
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, c.width, c.height);
    }
    if (ncolor) {
        var c = menu.lr.ncolor;
        c.style.backgroundColor = ncolor;
        var ctx = c.getContext('2d');
        var lingrad = ctx.createLinearGradient(0, 0, c.width, 0);
        lingrad.addColorStop(0, 'white');
        lingrad.addColorStop(1, ncolor);
        ctx.fillStyle = lingrad;
        ctx.fillRect(0, 0, c.width, c.height);
    }
}

