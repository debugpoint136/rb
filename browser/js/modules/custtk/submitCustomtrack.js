/**
 * ===BASE===// custtk // submitCustomtrack.js
 * @param 
 */

function submitCustomtrack(event) {
    /* called only by pushing button, works for all types
     real tracks, not datahub
     20130326 big old bug of not adding track for splinters
     */
    var ft = event.target.ft;
    var bbj = apps.custtk.bbj;
    if (ft == FT_huburl) {
        bbj.loaddatahub_pushbutt();
        return;
    }
    if (!isCustom(ft)) fatalError('wrong ft');
    var c;
    var _tmp = {
        ft: ft,
        name: bbj.genome.newcustomtrackname(),
        mode: M_show,
    };

    switch (ft) {
        case FT_bedgraph_c:
            c = bbj.genome.custtk.ui_bedgraph;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.qtc = {height: 40};
            break;
        case FT_bigwighmtk_c:
            c = bbj.genome.custtk.ui_bigwig;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.qtc = {height: 40};
            break;
        case FT_cat_c:
            c = bbj.genome.custtk.ui_cat;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            if (c.lst.length <= 1) {
                print2console('Wrong cateinfo', 2);
                return;
            }
            _tmp.cateInfo = {};
            for (var i = 0; i < c.lst.length; i++) {
                var textinput = c.lst[i][0].value;
                if (textinput.length > 0) {
                    _tmp.cateInfo[i + 1] = [textinput, c.lst[i][1].style.backgroundColor];
                } else {
                    print2console('No name provided for category ' + (i + 1), 2);
                    return;
                }
            }
            break;
        case FT_bed_c:
            c = bbj.genome.custtk.ui_bed;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            break;
        case FT_lr_c:
            c = bbj.genome.custtk.ui_lr;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            var score1 = parseFloat(c.input_pscore.value);
            if (isNaN(score1)) {
                print2console('Invalid positive threshold value', 2);
                return;
            }
            if (score1 < 0) {
                print2console('Positive threshold value must be >=0', 2);
                return;
            }
            var score2 = parseFloat(c.input_nscore.value);
            if (isNaN(score2)) {
                print2console('Invalid negative threshold value', 2);
                return;
            }
            if (score2 > 0) {
                print2console('Negative threshold value must be <=0', 2);
                return;
            }
            _tmp.qtc = {pfilterscore: score1, nfilterscore: score2};
            break;
        case FT_bam_c:
            c = bbj.genome.custtk.ui_bam;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            break;
        case FT_anno_c:
            c = bbj.genome.custtk.ui_hammock;
            _tmp.url = c.input_url.value.trim();
            _tmp.label = c.input_name.value;
            _tmp.mode = parseInt(c.mode.options[c.mode.selectedIndex].value);
            var s = c.input_json.value;
            if (s.length > 0) {
                var j = str2jsonobj(s);
                if (!j) {
                    print2console('Syntax error with JSON description', 2);
                    return;
                }
                hammockjsondesc2tk(j, _tmp);
            }
            break;
        case FT_weaver_c:
            c = bbj.genome.custtk.ui_weaver;
            _tmp.url = c.input_url.value.trim();
            _tmp.cotton = c.input_name.value;
            _tmp.label = c.cotton + ' to ' + bbj.genome.name;
            break;
        default:
            fatalError('ft exception: ' + ft);
    }
    //dpuru - commenting this for performance testing
    /*if (bbj.genome.tkurlInUse(_tmp.url)) {
        print2console('This track has already been submitted', 2);
        return;
    }*/
    if (newCustomTrack_isInvalid(_tmp)) {
        return;
    }

    if (ft == FT_weaver_c) {
        if (bbj.weaver && bbj.weaver.mode == W_fine) {
            /* already weaving in fine mode
             must refresh all other tracks especially the existing weavertk
             or else eerie things happen
             */
            bbj.onloadend_once = function () {
                bbj.ajaxX(bbj.displayedRegionParam() + '&changeGF=on');
            };
        }
        bbj.init_bbj_param = {tklst: [_tmp]};
        bbj.ajax_loadbbjdata(bbj.init_bbj_param);
        return;
    }
    c.submit_butt.disabled = true;
    bbj.cloak();
    bbj.genome.pending_custtkhash[_tmp.name] = _tmp;
    print2console("Adding custom track...", 0);
    bbj.ajax('addtracks=on&dbName=' + bbj.genome.name + '&' + bbj.displayedRegionParamPrecise() + trackParam([_tmp]), function (data) {
        bbj.submitCustomtrack_cb(data, _tmp, c);
    });
}


