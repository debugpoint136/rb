function panelFadeout_end(event) {
    var d = event.target;
    d.removeEventListener('animationend', panelFadeout_end, false);
    d.removeEventListener('webkitAnimationEnd', panelFadeout_end, false);
    var lst = d.className.split(' ');
    if (lst.length == 1) {
        d.className = '';
    } else {
        lst.pop();
        d.className = lst.join(' ');
    }
    d.style.display = 'none';
}