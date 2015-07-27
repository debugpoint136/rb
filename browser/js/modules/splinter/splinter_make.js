/**
 * ===BASE===// splinter // splinter_make.js
 * @param __Browser.prototype__
 * @param 
 */

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

