/**
 * ===BASE===// scaffold // toggle6.js
 * @param 
 */

function toggle6() {
// inside menu, show/hide scaffold display panel
    var bait1 = menu.relocate.div1;
    var bait2 = menu.relocate.div2;
    menu.relocate.jumplstholder.style.display = 'none'; // always hide it
    if (bait1.style.display == 'block') {
        bait1.style.display = 'none';
        bait2.style.display = 'block';
        menu.c18.style.display = 'none';
        stripChild(menu.scfd_holder, 0);
        menu.scfd_holder.appendChild(gflag.menu.bbj.genome.scaffold.overview.holder);
        scfd_cancelconfigure();
        placePanel(menu);
    } else {
        bait1.style.display = 'block';
        bait2.style.display = 'none';
    }
}

