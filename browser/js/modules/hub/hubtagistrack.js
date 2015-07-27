/**
 * @param tag
 */

function hubtagistrack(tag) {
// this supports longrange to be backward compatible
    if (tag == 'bedgraph' || tag == 'bigwig' || tag == 'bed' ||
        tag == 'longrange' || tag == 'interaction' ||
        tag == 'bam' || tag == 'categorical' ||
        tag == 'methylc' || tag == 'ld' ||
        tag == 'annotation' || tag == 'hammock' ||
        tag == 'categorymatrix' ||
        tag == 'quantitativecategoryseries' ||
        tag == 'genomealign' ||
        tag == 'matplot'
    ) return true;
    return false;
}