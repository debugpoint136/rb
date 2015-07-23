/**
 * Created by dpuru on 2/27/15.
 */
/*** __spread__ spreading info from genome to all browser objects  ***/

Genome.prototype.spread_custmdterm = function (termname) {
    /* skip splinters */
    for (var n in horcrux) {
        var bbj = horcrux[n];
        if (bbj.splinterTag != null) continue;
        if (bbj.genome.name != this.name) continue;
        var opt = document.createElement('option');
        opt.value = termname;
        opt.innerHTML = termname;
        bbj.cfacet.md1.add(opt);
        opt = document.createElement('option');
        opt.value = termname;
        opt.innerHTML = termname;
        bbj.cfacet.md2.add(opt);
        apps.custtk.bbj = bbj;
        simulateEvent(bbj.cfacet.md1, 'change');
    }
};

/*** __spread__ ends ***/