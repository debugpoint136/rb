/**
 * ===BASE===// decor // decorJson_parse.js
 * @param 
 */

function decorJson_parse(val, hash) {
    if (Array.isArray(val)) {
        for (var i = 0; i < val.length; i++) {
            hash[val[i].name] = val[i];
        }
    } else {
        for (var k in val) {
            decorJson_parse(val[k], hash);
        }
    }
}

