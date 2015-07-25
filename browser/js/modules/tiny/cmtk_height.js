function cmtk_height(tk) {
    if (tk.cm.combine || !tk.cm.set.rd_r) return tk.qtc.height + densitydecorpaddingtop;
    return 1 + 2 * (tk.qtc.height + densitydecorpaddingtop);
}