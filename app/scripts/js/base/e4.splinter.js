/**
 * Created by dpuru on 2/27/15.
 */
/*** __splinter__  ***/

Browser.prototype.splinter_issuetrigger = function (coord) {
// triggered by app, show empty splinter holder with prompt of choosing view range
    var bbj = this.splinterTag ? this.trunk : this;
    if (bbj.weaver) {
        print2console('This function is not available for the moment!', 2);
        return;
    }
    var pa = {splinters: [coord]};
    bbj.init_bbj_param = pa;
    bbj.ajax_loadbbjdata(pa);
};

Browser.prototype.splinter_recursive = function (callback) {
    if (!this.splinter_pending) return;
    if (this.splinter_pending.length == 0) {
        delete this.splinter_pending;
        return;
    }
    this.splinter_make(this.splinter_pending.splice(0, 1)[0], callback);
};

Browser.prototype.splinter_make = function (arg, callback) {
    /* called from a trunk
     */
    if (this.splinterTag) {
        print2console('splinter: not called from a trunk', 2);
        return;
    }
    var holder = this.splinterHolder.firstChild.firstChild.insertCell(-1);
    holder.style.width = holder.__splinter_width = arg.width;
    holder.vAlign = 'top';
    var chip = new Browser();
    chip.trunk = this;
// TODO
    if (this.weaver) {
        chip.weaver = {q: {}, insert: []};
    }
    chip.hmSpan = arg.width;
    var tag = Math.random().toString();
    chip.splinterTag = tag;
    chip.leftColumnWidth = 0;
    chip.browser_makeDoms({
            mainstyle: 'border:1px solid ' + colorCentral.magenta7 + ';background-color:' + colorCentral.background_faint_7 + ';margin:0px 2px;',
            centralholder: holder,
            header: {
                height: browser_scalebar_height - 1,
                padding: '0px',
                fontsize: '12px',
                zoomout: [[2, 2]],
                dspstat: {allowupdate: true, tinyfont: '80%'},
                utils: {
                    bbjconfig: true,
                    'delete': function () {
                        chip.splinter_delete();
                    }
                },
            },
            ghm_ruler: true,
            hmdivbg: 'white'
        }
    );
    chip.ideogram.canvas.oncontextmenu = menu_coordnote;
    chip.genome = this.genome;
    chip.runmode_set2default();
    /* set following to null to disable corresponding actions */
    chip.facet =
        chip.cfacet = null;
    chip.applyHmspan2holders();
    chip.notes = this.notes;
    if (callback) {
        chip.onloadend_once = callback;
    }
    if (arg.coord) {
        this.splinters[tag] = chip;
        var pa = {mustaddcusttk: true, coord_rawstring: arg.coord};
        this.bbjparamfillto_tk(pa);
        chip.init_bbj_param = pa;
        chip.ajax_loadbbjdata(pa);
        return;
    }
// no coord, ask
    loading_done();
    chip.__pending_splinter = true;
    chip.main.style.display = 'none';
    var d0 = dom_create('div', holder, 'border:10px solid transparent;');
    var d = make_headertable(d0);
    d.style.display = 'none';
    d.style.backgroundColor = colorCentral.magenta1;
    d._h.innerHTML = 'New panel will appear here';
    var h = this.tkpanelheight();
    if (h > 160) {
        d.style.height = h;
    }
    d._c.style.textAlign = 'center';
    dom_addbutt(d._c, 'SELECT VIEW RANGE', function (e) {
        chip.showjumpui({d: e.target});
    });
    dom_create('br', d._c);
    dom_create('br', d._c);
    dom_addbutt(d._c, 'Cancel', function (e) {
        chip.splinter_abort()
    });
    panelFadein(d);
};

Browser.prototype.may_init_pending_splinter = function (coord) {
// only for app-created splinters
    if (!this.__pending_splinter) return false;
    delete this.__pending_splinter;
    if (!this.splinterTag) fatalError('may_init_pending_splinter: splinterTag missing');
    this.main.style.display = 'block';
    this.main.parentNode.removeChild(this.main.nextSibling.nextSibling);
    var pa = {mustaddcusttk: true, coord_rawstring: coord};
    this.trunk.bbjparamfillto_tk(pa);
    this.init_bbj_param = pa;
    this.trunk.splinters[this.splinterTag] = this;
    this.ajax_loadbbjdata(pa);
    return true;
};

Browser.prototype.splinter_abort = function () {
    this.trunk.sethmspan_refresh(this.trunk.hmSpan + this.hmSpan);
    delete horcrux[this.horcrux];
    var h = this.main.parentNode;
    h.parentNode.removeChild(h);
};


function splinter_pushbutt(event) {
    var bbj = event.target.bbj;
    var c = bbj.genome.parseCoordinate(event.target.coord, 2);
    if (!c) {
        print2console('Invalid coordinate for adding secondary panel', 2);
        return;
    }
    bbj.splinter_pending = [{coord: [c[0], c[1], c[3]], width: 400}];
    bbj.splinter();
}


function splinter_zoomout(tag) {
// arg is splinter tag
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.cgiZoomout(1, false);
}
function splinter_zoomin(tag) {
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.cgiZoomin(2);
}
function splinter_pan(tag, direction) {
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.arrowPan(direction, 1);
}
Browser.prototype.splinter_delete = function () {
    delete this.trunk.splinters[this.splinterTag];
    this.splinter_abort();
};


/*** __splinter__ ends ***/