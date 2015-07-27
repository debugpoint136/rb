/**
 * Created by dpuru on 2/27/15.
 */
function tkentry_click(event) {
    /* clicking on a track entry in menu list, accumulates selected ones
     the item (list) should always be hosted in one of the panels in menu:
     - facet tklst table
     - general purpose track selection panel, for all types of tracks that are currently on show
     including hmtk and decor
     */
    var bbj = gflag.menu.bbj;
    var add = false;
    if (event.target.className == 'tkentry') {
        event.target.className = 'tkentry_onfocus';
        add = true;
    } else if (event.target.className == 'tkentry_onfocus') {
        event.target.className = 'tkentry';
    }
    var tkname = event.target.tkname;
    var tkobj = bbj.findTrack(tkname);
    var ft = null, tknameurl = null;
    /* notice: display object can be missing
     in case of facet track selection
     */
    if (tkobj != null) {
        ft = tkobj.ft;
        tknameurl = isCustom(ft) ? tkobj.url : tkname;
    }
    var butt = menu.facettklstdiv.submit;
    var s = butt.count;
    butt.count += add ? 1 : -1;
    if (butt.count == 0) {
        butt.style.display = 'none';
    } else {
        butt.innerHTML = 'Add ' + butt.count + ' track' + (butt.count > 1 ? 's' : '');
        butt.style.display = 'inline';
    }
}


/* __decor__ good old decor tk */

