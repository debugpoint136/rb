/**
 * ===BASE===// facet // facet_choosedim_closure.js
 * @param 
 */

function facet_choosedim_closure(bbj, i, t, isrow) {
    return function () {
        bbj.facet_choosedim(i, t, isrow);
    };
}

