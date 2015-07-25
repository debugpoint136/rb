function toggle14(event) {
    var cc = event.target;
    gflag.allow_packhide_tkdata = cc.checked;
    cc.nextSibling.nextSibling.style.display = cc.checked ? 'block' : 'none';
}
