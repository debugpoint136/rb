/**
 * works for both radio and checkbox
 * @param radioName
 * @param value
 */

function checkInputByvalue(radioName, value) {
// works for both radio and checkbox
    var lst = document.getElementsByName(radioName);
    if (lst.length == 0)
        fatalError("checkInputByvalue: unknown <input> name");
    for (var i = 0; i < lst.length; i++) {
        if (lst[i].value == value) {
            lst[i].checked = true;
            return;
        }
    }
    fatalError("checkInputByvalue: unknown value '" + value + "' for " + radioName);
}