/**
 * ===BASE===// render // alertbox_addmsg.js
 * @param 
 */

function alertbox_addmsg(stuff) {
    /* stuff.bgcolor, bg
     stuff.color, text
     stuff.text
     */
    if (!stuff.bgcolor) {
        stuff.bgcolor = '#900';
        stuff.color = 'white';
    }
    alertbox.style.backgroundColor = stuff.bgcolor;
    alertbox.style.color = stuff.color;
    var i = parseInt(alertbox.innerHTML);
    alertbox.innerHTML = i + 1;
    alertbox.messages.push(stuff);
    alertbox.style.display = 'block';
    if (typeof(floatingtoolbox) == 'undefined') {
        alertbox.style.left = '';
        alertbox.style.right = 0;
    } else {
        alertbox.style.left = parseInt(floatingtoolbox.style.left) - 40;
        alertbox.style.right = '';
    }
}

