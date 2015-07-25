function panelFadein_end(event) {
    var d = event.target;
    d.removeEventListener('animationend', panelFadein_end, false);
    d.removeEventListener('webkitAnimationEnd', panelFadein_end, false);
    var lst = d.className.split(' ');
    if (lst.length == 1) {
        d.className = '';
    } else {
        lst.pop();
        d.className = lst.join(' ');
    }
}