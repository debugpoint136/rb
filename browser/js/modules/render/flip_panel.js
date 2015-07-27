/**
 * ===BASE===// render // flip_panel.js
 * @param 
 */

function flip_panel(dom1, dom2, forward) {
    /* args:
     dom1: the panel on far side,
     dom2: the panel on near side
     forward: boolean, if true will fade fardom and show neardom (hide 1, show 2)
     */
    if (forward) {
        panelFadeout(dom1);
        panelFadein(dom2);
    } else {
        panelFadeout(dom2);
        panelFadein(dom1);
    }
}


