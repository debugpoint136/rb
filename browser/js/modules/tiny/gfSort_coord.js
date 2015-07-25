/**
 * using actual genomic coord
 * @param a
 * @param b
 * @return  <br><br><br>
 */

function gfSort_coord(a, b) {
// using actual genomic coord
    if (a.start == b.start) return a.stop - b.stop;
    return a.start - b.start;
}