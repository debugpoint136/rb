/**
 * find_te - called by pushing butt
 */

function find_te()
{
// called by pushing butt
    highlight_subfamid=null;
    var _s=document.getElementById('find_te_input').value;
    var msg=document.getElementById('find_te_msg');
    msg.style.display='block';
    if(_s=='enter transposon name') {
        msg.innerHTML='Please enter transposon name';
        return;
    }
    var s=_s.toUpperCase();
    for(var id in id2subfam) {
        var s2=id2subfam[id].name.toUpperCase();
        if(s==s2) {
            highlight_subfamid=id;
            msg.innerHTML='Found!<br>This transposon is now highlighted with red background.';
            setTimeout(menu_hide,500);
            setTimeout('drawBigmap(false)',500);
            return;
        }
    }
    msg.innerHTML='No match found.';
}