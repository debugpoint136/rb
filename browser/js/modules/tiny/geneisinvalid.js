function geneisinvalid(gene) {
    if (!gene.c || !gene.a || !gene.b) {
        gflag.badgene = gene;
        return true;
    }
    return false
}