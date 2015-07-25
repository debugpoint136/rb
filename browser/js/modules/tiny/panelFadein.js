function panelFadein(d, x1, y1) {
    d.style.display = 'block';
    if (x1 != null) {
        d.style.left = x1;
        d.style.top = y1;
    }
    d.addEventListener('animationend', panelFadein_end, false);
    d.addEventListener('webkitAnimationEnd', panelFadein_end, false);
    if (d.className) {
        d.className += ' fadein';
    } else {
        d.className = 'fadein';
    }
}