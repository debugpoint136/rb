/**
 * ===BASE===// track // aftertkaddremove.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.aftertkaddremove = function (namelst) {
    switch (gflag.menu.context) {
        case 10:
            // clicked a grid cell, or a list cell
            this.facetclickedcell_remake();
            return;
        case 9:
            facet_term_selectall();
            break;
        case 23:
            tkkwsearch();
            break;
        case 22:
            menu_custtk_showall();
            break;
        case 1:
        case 2:
            break;
    }
    if (namelst.length > 0 && (!this.trunk)) {
        this.generateTrackselectionLayout();
    }
};


