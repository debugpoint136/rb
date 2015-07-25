function hspSort(a, b) {
    if (a.querychr == b.querychr) return a.querystart - b.querystart;
//if(a.targetrid==b.targetrid) return a.targetstart-b.targetstart;
    return 1;
}