/* override methods from base.js*/

/**
 * @param geoacc
 */

Browser.prototype.getTrackdetail=function(geoacc)
{
    /* override existing method from base.js
     safe?
     */
    menu_getExperimentInfo(geo2id[geoacc]);
};