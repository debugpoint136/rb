/**
 * ===BASE===// custtk // newCustomTrack_isInvalid.js
 * @param 
 */

function newCustomTrack_isInvalid(hash) {
    /* first fetch url and name of custom track into global variables,
     then call the validation routine
     */
    var url = hash.url;
    if (url.length <= 0) {
        print2console("no URL given for custom track", 3);
        return true;
    }
    if (url.length <= 8) {
        print2console("URL looks invalid", 3);
        return true;
    }
    if (url.substr(0, 4).toLowerCase() != 'http' && url.substr(0, 3).toLowerCase() != 'ftp') {
        print2console("unrecognizable URL", 3);
        return true;
    }
    var label = hash.label;
    if (label.length == 0) {
        print2console("no track name entered", 3);
        return true;
    }
    if (label.indexOf(',') != -1) {
        print2console("no comma allowed for track name", 2);
        return true;
    }
    if (label.indexOf('|') != -1) {
        print2console("no vertical line allowed for track name", 2);
        return true;
    }
    return false;
}


