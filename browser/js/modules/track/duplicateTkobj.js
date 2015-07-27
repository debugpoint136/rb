/**
 * ===BASE===// track // duplicateTkobj.js
 * @param 
 */

function duplicateTkobj(o) {
    var o2 = {
        name: o.name,
        label: o.label,
        ft: o.ft,
        url: o.url,
        qtc: {},
        mode: isHmtk(o.ft) ? M_show : M_den,
    };
    if (o.ft == FT_weaver_c) {
        o2.cotton = o.cotton;
    }
    qtc_paramCopy(o.qtc, o2.qtc);
    if (o.cateInfo) {
        o2.cateInfo = {};
        cateInfo_copy(o.cateInfo, o2.cateInfo);
    }
    return o2;
}

