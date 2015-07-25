function toggle_prevnode(event) {
    var d = event.target.previousSibling;
    d.style.display = d.style.display == 'block' ? 'none' : 'block';
}