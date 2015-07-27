/**
 * on changing a checkbox in metadata selector panel
 * need to tell which genome this checkbox belongs to
 * and which browser to place the effect
 *
 * beware: adding new term during editing annotation of a track
 * new custom term's checkbox will be simulated with click
 * new term shall be displayed in mcm, but it will not be used to annotate tk
 * as only tk attr can be used for annotation
 *
 * @param event
 */

function mdCheckboxchange(event) {
    /* on changing a checkbox in metadata selector panel
     need to tell which genome this checkbox belongs to
     and which browser to place the effect

     beware: adding new term during editing annotation of a track
     new custom term's checkbox will be simulated with click
     new term shall be displayed in mcm, but it will not be used to annotate tk
     as only tk attr can be used for annotation
     TODO
     */
    var term = event.target.term;
    var bbj = gflag.menu.bbj;
    var mdidx = event.target.mdidx;
    switch (bbj.genome.mdselect.which) {
        case 1:
            // add to mcm in bbj panel
            bbj.showhide_term_in_mcm([term, mdidx], event.target.checked);
            return;
        case 3:
            // editing custom track anno after submission
            // not in use
            if (event.target.checked) {
                /* adding annotation
                 to both registry/display objects
                 to insert <tr> in table to be used in annotation
                 term must be leaf, and could be native or custom
                 need to imprint both term and parent info on the <tr>
                 */
                document.getElementById('custtkmdanno_editsaysno').style.display = 'none';
                var showtable = document.getElementById('custtkmdanno_showholder');
                showtable.style.display = 'table';
                // TODO
                bbj.genome.custmd_tableinsert(showtable, term, iscustom, custtkmdannoedit_removeTerm);
                var ft = gflag.ctmae.ft;
                var tkname = gflag.ctmae.tkname;
                // 1: registry object
                var obj = gflag.ctmae.bbj.genome.hmtk[tkname];
                if (!obj.md[mdidx]) {
                    obj.md[mdidx] = {};
                }
                obj.md[mdidx][term] = 1;
                // 2: display object
                obj = gflag.ctmae.bbj.findTrack(tkname);
                if (obj != null) {
                    if (!obj.md[mdidx]) {
                        obj.md[mdidx] = {};
                    }
                    obj.md[mdidx][term] = 1;
                    gflag.ctmae.bbj.prepareMcm();
                    gflag.ctmae.bbj.drawMcm();
                }
            } else {
                custtkmdannoedit_removeTerm(term);
            }
            return;
        case 4:
            compass_customhub_assignterm(term);
            return;
        default:
            fatalError('mdCheckboxchange: unknown bbj.genome.mdselect.which');
    }
}
