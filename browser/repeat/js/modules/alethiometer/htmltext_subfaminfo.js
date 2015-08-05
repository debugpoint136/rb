/**
 * htmltext_subfaminfo - light foreground?
 * @param sfid
 * @param lightfg
 */

function htmltext_subfaminfo(sfid, lightfg) {
// light foreground?
    var ii=id2subfam[sfid];
    return '<table>'+
        '<tr><td class=tph>subfamily</td><td><span style="font-weight:bold;'+(lightfg?'color:#27292b;':'')+'">'+ // dpuru : changed color from white
        ii.name+'</span></td></tr>'+
        '<tr><td class=tph>family</td><td>'+ii.fam+'</td></tr>'+
        '<tr><td class=tph>class</td><td>'+ii.cls+'</td></tr>'+
        '<tr><td class=tph>total bp #</td><td>'+ii.genomelen+'</td></tr>'+
        '<tr><td class=tph>genome copy #</td><td>'+ii.copycount+'</td></tr>'+
        (ii.consensuslen>0 ?
            '<tr><td class=tph>consensus length</td><td>'+ii.consensuslen+'</td></tr>':
                '<tr><td class=tph colspan=2 style="text-align:left">does not have consensus</td></tr>'
        )+
        '</table>';
}