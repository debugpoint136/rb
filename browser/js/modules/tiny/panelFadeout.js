function panelFadeout(d) {
    d.addEventListener('animationend', panelFadeout_end, false);
    d.addEventListener('webkitAnimationEnd', panelFadeout_end, false);
    if (d.className) {
        d.className += ' fadeout';
    } else {
        d.className = 'fadeout';
    }
}