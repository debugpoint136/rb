/**
 * a set of radio button sharing same name
 * @param what
 */

function getValue_by_radioName(what) {
// a set of radio button sharing same name
    var tag_lst = document.getElementsByName(what);
    if (tag_lst.length == 0) fatalError("radio button with name " + what + " not found.");
    for (var i = 0; i < tag_lst.length; i++) {
        if (tag_lst[i].checked) return tag_lst[i].value;
    }
    return null;
}