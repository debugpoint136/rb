Genome.prototype.parseCoordinate = function (input, type) {
    /* type:
     1 - array [chr, start, stop]
     2 - str chr start stop
     3 - str chrA start chrB stop
     */
    var c = [];
    switch (type) {
        case 1:
            if (input.length != 3) return null;
            c[0] = c[2] = input[0];
            c[1] = input[1];
            c[3] = input[2];
            break;
        case 2:
            var t = input.split(/[^\w\.]/);
            if (t.length == 3) {
                c[0] = c[2] = t[0];
                c[1] = parseInt(t[1]);
                c[3] = parseInt(t[2]);
            } else {
                // remove all comma and try again
                t = input.replace(/,/g, '').split(/[^\w\.]/);
                if (t.length == 3) {
                    c[0] = c[2] = t[0];
                    c[1] = parseInt(t[1]);
                    c[3] = parseInt(t[2]);
                } else {
                    return null;
                }
            }
            break;
        case 3:
            var t = input.split(/[^\w\.]/);
            if (t.length != 4) return null;
            c[0] = t[0];
            c[2] = t[2];
            c[1] = parseInt(t[1]);
            c[3] = parseInt(t[3]);
            break;
        default:
            fatalError('parseCoordinate: unknown type');
    }
    if (isNaN(c[1])) return null;
    if (isNaN(c[3])) return null;
    if (c[1] < 0 || c[3] <= 0) return null;
    if (type == 1 || type == 2) {
        if (c[1] >= c[3]) return null;
        var len = this.scaffold.len[c[0]];
        if (!len) return null;
        if (c[1] > len) return null;
        if (c[3] > len) return null;
        return c;
    }
    var len = this.scaffold.len[c[0]];
    if (!len) return null;
    if (c[1] > len) return null;
    len = this.scaffold.len[c[2]];
    if (!len) return null;
    if (c[3] > len) return null;
    return c;
};