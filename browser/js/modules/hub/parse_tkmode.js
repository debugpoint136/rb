/**
 * @param mode
 * */

function parse_tkmode(mode) {
    if (mode == undefined) return [M_hide];
    if (typeof(mode) == 'string') {
        var m = decormodestr2num(mode);
        if (m == undefined) return [M_hide, 'Weird string value for track mode'];
        return [m];
    }
    if (typeof(mode) == 'number') {
        if (mode2str[mode]) return [mode];
        return [M_hide, 'Weird numerical value for track mode'];
    }
    return [M_hide, 'Value of track mode neither string nor digit'];
}