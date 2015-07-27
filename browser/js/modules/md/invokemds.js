/**
 * --Genome.prototype--
 * @param which
 * @param x
 * @param y
 */

Genome.prototype.invokemds = function (which, x, y) {
    this.mdselect.which = which;
    menu_shutup();
    menu.c55.style.display = 'block';
    menu.c55.says.innerHTML = 'Metadata';
    menu.c31.style.display = 'block';
    menu.c57.style.display = 'block';
    menu.c61.style.display = 'block';
    menu.c61.firstChild.innerHTML = 'about metadata';
    menu.c61.firstChild.onclick = function () {
        window.open(FT2noteurl.md)
    };
    stripChild(menu.c31, 0);
    for (var i = 0; i < gflag.mdlst.length; i++) {
        menu.c31.appendChild(gflag.mdlst[i].main);
    }
    if (menu.style.display != 'block') {
        menu_show(0, x, y);
    }
};