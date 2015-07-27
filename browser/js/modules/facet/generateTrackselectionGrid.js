/**
 * ===BASE===// facet // generateTrackselectionGrid.js
 * @param __Browser.prototype__
 * @param 
 */

Browser.prototype.generateTrackselectionGrid = function () {
    /* for two criteria case
     make grid for track selection, each cell corresponds to metadata categories
     rerun when criteria changed
     */
    this.flatHmtk = this.flattenhmtk();
    var attr2tkset = {};
// key: attr, val: set of track
    for (var i = 0, numFacetRows = this.facet.rowlst.length; i < numFacetRows; i++) {
        // skip expanded parent term
        var t = this.facet.rowlst[i];
        if (t[2] == '&#8863;') continue;
        var s = {};
        this.mdgettrack(t[0], this.facet.dim1.mdidx, s );
        attr2tkset[t[0]] = s;
    }
    for (var i = 0, numFacetCols = this.facet.collst.length; i < numFacetCols; i++) {
        var t = this.facet.collst[i];
        if (t[2] == '&#8863;') continue;
        var s = {};
        this.mdgettrack(t[0], this.facet.dim2.mdidx, s );
        attr2tkset[t[0]] = s;
    }
    var table = this.facet.div2;
    if (table.firstChild) {
        stripChild(table.firstChild, 0);
    }

    var rowvoc = gflag.mdlst[this.facet.dim1.mdidx],
        colvoc = gflag.mdlst[this.facet.dim2.mdidx];
    this.facet.rowlst_td = [];
    this.facet.collst_td = [];

    /** first row **/
    var tr = table.insertRow(0);
// one cell for each attribute in facet.collst, vertical canvas
    for (var i = 0; i < this.facet.collst.length; i++) {
        var colt = this.facet.collst[i];
        /* column header */
        var td = tr.insertCell(-1);
        td.className = 'facet_colh';
        td.align = 'center';
        td.vAlign = 'bottom';
        td.style.paddingBottom = colt[1];
        td.idx = i;
        var color;
        if (!(colt[0] in colvoc.p2c)) {
            // is leaf
            td.style.paddingTop = colt[1] + 17;
            color = colorCentral.foreground;
        } else {
            // not leaf
            td.style.cursor = 'pointer';
            td.iscolumn = true;
            td.onclick = facettermclick_grid;
            td.onmousedown = facet_header_press;
            if (colt[2] == '&#8862;') {
                // collapsed
                color = colorCentral.foreground;
            } else {
                color = '#858585';
                td.style.borderColor = 'transparent';
            }
        }
        td.onmouseover = facet_colh_mover;
        td.onmouseout = facet_colh_mout;

        var c = makecanvaslabel({
            str: mdterm2str(this.facet.dim2.mdidx, colt[0]),
            color: color, bottom: true
        });
        td.appendChild(c);

        var d = dom_create('div', td);
        if (colt[0] in colvoc.p2c) {
            d.innerHTML = colt[2];
            d.style.color = color;
        } else {
            d.style.width = d.style.height = 15;
        }
        this.facet.collst_td.push(td); // for highlight
    }
    var td = tr.insertCell(-1);
    td.align = 'left';
    td.vAlign = 'bottom';
    td.className = 'facet_cell';
    td.style.padding = '10px';
    td.addEventListener('mouseover', menu_hide, false);

// remaining rows, one for each attribute in facet.rowlst
    for (i = 0; i < this.facet.rowlst.length; i++) {
        // make first cell, the row header
        var rowt = this.facet.rowlst[i];
        tr = table.insertRow(-1);
        // facet cells
        for (var j = 0; j < this.facet.collst.length; j++) {
            td = tr.insertCell(-1);
            var what2 = this.facet.collst[j][0];
            if (!(rowt[0] in attr2tkset) || !(what2 in attr2tkset)) {
                // to skip expanded row and column
                continue;
            }
            var intersection = {};
            for (var tk in attr2tkset[rowt[0]]) {
                if (tk in attr2tkset[what2])
                    intersection[tk] = 1;
            }
            td.className = 'facet_cell';
            td.ridx = i;
            td.cidx = j;
            var num = this.tracksetTwonumbers(intersection);
            if (num[0] == 0) {
                td.innerHTML = '<span style="color:#ccc;">n/a</span>';
            } else {
                var d = dom_create('div', td, 'display:inline-block;');
                d.className = 'tscell';
                d.i = i;
                d.j = j;
                d.term1 = rowt[0];
                d.term2 = what2;
                d.title = 'click to show tracks';
                d.onmouseover = facet_cellmover;
                d.onmouseout = facet_cellmout;
                d.onclick = facet_clickcell;
                d.innerHTML =
                    ((num[1] == 0) ? '<span>0</span>' : '<span class=r>' + num[1] + '</span>') +
                    '<span>/</span>' +
                    '<span class=g>' + num[0] + '</span>';
            }
        }
        /* row header */
        td = tr.insertCell(-1);
        td.style.paddingLeft = rowt[1];
        td.className = 'facet_rowh';
        td.idx = i;
        var tns = mdterm2str(this.facet.dim1.mdidx, rowt[0]);
        if (!(rowt[0] in rowvoc.p2c)) {
            // is leaf
            td.innerHTML = tns;
            td.style.paddingLeft = rowt[1] + 17;
        } else {
            // not leaf
            td.innerHTML = rowt[2] + ' ' + tns;
            td.iscolumn = false;
            td.onclick = facettermclick_grid;
            td.onmousedown = facet_header_press;
            td.style.cursor = 'pointer';
            if (rowt[2] != '&#8862;') {
                // expanded
                td.style.borderColor = 'transparent';
                td.style.color = '#858585';
            }
        }
        td.onmouseover = facet_rowh_mover;
        td.onmouseout = facet_rowh_mout;
        this.facet.rowlst_td.push(td);
    }
};

