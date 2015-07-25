function getSelectValueById(what) {
    var tag = document.getElementById(what);
    if (tag == null) fatalError(what + ' not found as select');
    if (tag.type != 'select-one')
        fatalError(what + ' not found for a select tag');
    return tag.options[tag.selectedIndex].value;
}