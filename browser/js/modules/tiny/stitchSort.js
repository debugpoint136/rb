function stitchSort(a, b) {
    if (Math.max(a.t1, b.t1) < Math.min(a.t2, b.t2)) {
        return a.sort_midx - (a.t2 - a.t1) / 5 - a.sort_sumw / 2 -
            (b.sort_midx - (b.t2 - b.t1) / 5 - b.sort_sumw / 2);
    } else {
        return a.t1 - b.t1;
    }
}