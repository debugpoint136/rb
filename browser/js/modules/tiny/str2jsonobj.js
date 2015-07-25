function str2jsonobj(str) {
    var j = null;
    try {
        var j = JSON.parse(str);
    } catch (e) {
        try {
            if (str[0] == '{') {
                if (str[str.length - 1] == '}') {
                    try {
                        j = eval('(' + str + ')');
                    } catch (err) {
                    }
                }
            } else {
                try {
                    j = eval('({' + str + '})');
                } catch (err) {
                }
            }
        } catch (e) {
            return null;
        }
    }
    return j;
}