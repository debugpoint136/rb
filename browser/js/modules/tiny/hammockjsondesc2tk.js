function hammockjsondesc2tk(a, b) {
    for (var k in a) {
        if (k == 'categories') {
            b.cateInfo = a[k];
        } else {
            b[k] = a[k];
        }
    }
}