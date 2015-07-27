/**
 * @param hubid
 * */

function publichub_load_closure(hubid) {
    return function () {
        publichub_load_page(hubid);
    };
}