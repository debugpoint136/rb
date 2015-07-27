/**
 * @param event
 */

function jsonhub_choosefile(event) {
    var reader = new FileReader();
    reader.onerror = function () {
        print2console('Error reading file', 2);
    };
    reader.onabort = function () {
        print2console('Error reading file', 2);
    };
    reader.onload = function (e) {
        var j = parse_jsontext(e.target.result);
        if (!j) {
            return;
        }
        if (apps.custtk.main.style.display == 'block') {
            toggle7_2();
        }
        var b = gflag.fileupload_bbj;
        b.loaddatahub_json(j);
    };
    reader.readAsText(event.target.files[0]);
}