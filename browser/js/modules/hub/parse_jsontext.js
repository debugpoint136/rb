/**
 * @param text
 * @return j <br><br>
 */

function parse_jsontext(text) {
    if (!text) return null;
    //var startTime = new Date().getTime();
    //var parsedJSON = undefined; //will save asynschronously parsed JSON in this variable
    try {
        var j = JSON.parse(text);
        /*        var currentTime = new Date().getTime();
         var time = currentTime - startTime;
         console.log( "Parsing this json took: " + time + "ms" );*/

        //kick off async JSON parsing
        /*        JSON.parseAsync( text, function( json )
         {
         var currentTime = new Date().getTime();
         var time = currentTime - startTime;
         console.log( "Parsing this json took: " + time + "ms" );
         parsedJSON = json;
         });*/
    } catch (e) {
        try {
            var t2 = jsontext_removecomment(text);
            if (!t2) return null;
            try {
                var j = eval('(' + t2 + ')');
            } catch (err) {
                return null;
            }
            return j;
        } catch (e) {
            return null;
        }
    }
    return j;
}