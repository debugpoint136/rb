function getAlt_by_radioName(what) {
    var tag_lst = document.getElementsByName(what);
    if (tag_lst.length == 0) fatalError("radio button with name " + what + " not found.");
    for (var i = 0; i < tag_lst.length; i++) {
        if (tag_lst[i].checked) return tag_lst[i].alt;
    }
    fatalError("None of the options were checked for radio button " + what);
}