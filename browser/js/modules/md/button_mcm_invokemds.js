/**
 *
 */

function button_mcm_invokemds() {
    if (gflag.mdlst.length == 0) {
        print2console('No metadata available.', 2);
        return;
    }
    gflag.browser.mcm_invokemds();
}
