Browser.prototype.defaultposition = function () {
    var c = this.genome.defaultStuff.coord.split(/[^\w\.]/);
    if (c.length == 3) return [c[0], c[1], c[0], c[2]];
    if (c.length == 4) return c;
    print2console('Irregular default coord: ' + this.genome.defaultStuff.coord, 3);
    return null;
};