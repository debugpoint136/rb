/**
 * ===BASE===// baseFunc // loadgenome_gotdata .js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.loadgenome_gotdata = function (data) {
    if (!data) {
        fatalError('Crashed when loading genome info!');
        return;
    }
    if (data.unknowngenomedb) {
        if (this.onunknowngenome) {
            this.onunknowngenome(data.unknowngenomedb);
        } else {
            alert('Unknown genome name: ' + data.unknowngenomedb);
        }
        return;
    }
    var genomeobj = new Genome(this.init_genome_param);
    genomeobj.jsonGenome(data);
    genome[genomeobj.name] = genomeobj;
    this.genome = genomeobj;
    if (apps.session) {
        this.show_sessionid();
    }
    this.runmode_set2default();
    this.migratedatafromgenome();
    if (data.trashDir) {
        gflag.trashDir = data.trashDir;
    }
    this.__jsonPageinit(data);
    print2console(this.genome.name + ' genome loaded', 1);
    this.ajax_loadbbjdata(this.init_bbj_param);
};

