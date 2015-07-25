function gfSort_coord_rev(a, b) {
// using actual genomic coord
    if (a.start == b.start) return b.stop - a.stop;
    return b.start - a.start;
}