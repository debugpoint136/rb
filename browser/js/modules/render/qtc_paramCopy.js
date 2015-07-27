/**
 * ===BASE===// render // qtc_paramCopy.js
 * @param 
 */

function qtc_paramCopy(from, to) {
    /* 'from' 'to' are qtc objects (or equipped with same attributes)
     copy values from one to the other */
    for (var p in from) to[p] = from[p];
}


