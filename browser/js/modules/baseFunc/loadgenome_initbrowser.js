/**
 * Created by dpuru on 2/27/15.
 */

/*** __base__ ***/

Browser.prototype.loadgenome_initbrowser = function (param) {
    /* to fill up a freshly-made browser scaffold with genome data
     if the genome is missing, load it first
     browser data content (tracks, mcm) can be customized by param
     args:
     - browserparam: arg of ajax_loadbbjdata()
     - genomeparam: arg for initiating genome obj
     the rest are ajax arg for loading genome
     */

    if (param.dbname in genome) {
        this.genome = genome[param.dbname];
        this.runmode_set2default();
        this.migratedatafromgenome();
        this.init_bbj_param = param.browserparam;
        this.ajax_loadbbjdata(param.browserparam);
        return;
    }

// genome is not there, load it first
    this.init_bbj_param = param.browserparam;
    var p = param.genomeparam;
    this.init_genome_param = p;
    this.onunknowngenome = param.onunknowngenome;
    /*** load genome info ***/
    var bbj = this;
    this.ajax('loadgenome=on&dbName=' + param.dbname + (param.serverload ? '&serverload=on' : ''), function (data) {
        bbj.loadgenome_gotdata(data);
    });
};

