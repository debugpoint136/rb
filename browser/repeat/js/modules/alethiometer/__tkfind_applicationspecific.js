/**
 * __splinter__
 * @param lst
 */

Browser.prototype.__tkfind_applicationspecific=function(lst)
{
// arg is list of real tk name, to be converted to geoid
    var lst2=[];
    for(var i=0; i<lst.length; i++) {
        if(lst[i] in realtrack2geoid) {
            lst2.push(id2geo[realtrack2geoid[lst[i]]].acc);
        }
    }
    return lst2;
};