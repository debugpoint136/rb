/**
 * called by clicking on <span> inside <li>, which is non-leaf metadata term
 <li>'s next sibling must be <ul>, and will show/hide it
 * @param event
 */

function mdshowhide(event) {

    var li = event.target.parentNode;
    if (li.tagName != 'LI') {
        li = li.parentNode;
    }
    var x = li.firstChild;
    if (x.tagName == 'INPUT') x = x.nextSibling;
    var icon = x.firstChild;
    var ul = li.nextSibling;
    if (ul.style.display == 'none') {
        ul.style.display = "block";
        icon.innerHTML = '&#8863;';
    } else {
        ul.style.display = 'none';
        icon.innerHTML = '&#8862;';
    }
}