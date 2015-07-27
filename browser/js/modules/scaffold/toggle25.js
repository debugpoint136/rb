/**
 * ===BASE===// scaffold // toggle25.js
 * @param 
 */

function toggle25() {
    var bait1 = menu.relocate.div1;
    var bait3 = menu.relocate.div3;
    menu.relocate.jumplstholder.style.display = 'none'; // always hide it
    if (bait1.style.display == 'block') {
        menu.style.left = 50;
        bait1.style.display = 'none';
        bait3.style.display = 'block';
        stripChild(bait3, 0);
        var bbj = gflag.menu.bbj;
        bait3.appendChild(bbj.genome.linkagegroup.holder);
        placePanel(menu);
    } else {
        bait1.style.display = 'block';
        bait3.style.display = 'none';
    }
}


