/**
 * Make a track
 * @param  {string} geoAcc - make a track for showing in bigmap
 */


function make_a_track(geoAcc)
{
    /* make a track for showing in bigmap
     *** not splinters!! ***
     behaves differently compared with sukn tklst
     args: GSM geo accession
     .genome.hmtk must already been replaced
     with GSM as keys, not hmtk name
     */
    var tk=browser.makeTrackDisplayobj(geoAcc, browser.genome.hmtk[geoAcc].ft);
// the treatment of *polymorphism*
    tk.canvas.removeEventListener('mouseout', track_Mout, false);
    tk.canvas.removeEventListener('mousemove', track_Mmove, false);
    tk.canvas.addEventListener('mouseout', __track_Mout, false);
    tk.canvas.addEventListener('mousemove', __track_Mmove, false);

// redefine right click behavior
    var geoid=geo2id[geoAcc];
    tk.label=id2geo[geoid].label;
    tk.canvas.oncontextmenu=menu_bigmap;
    tk.geoid=geoid;
    browser.tklst.push(tk);
}