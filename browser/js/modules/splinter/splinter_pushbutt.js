/**
 * ===BASE===// splinter // splinter_pushbutt.js
 * @param 
 */

function splinter_pushbutt(event) {
    var bbj = event.target.bbj;
    var c = bbj.genome.parseCoordinate(event.target.coord, 2);
    if (!c) {
        print2console('Invalid coordinate for adding secondary panel', 2);
        return;
    }
    bbj.splinter_pending = [{coord: [c[0], c[1], c[3]], width: 400}];
    bbj.splinter();
}


