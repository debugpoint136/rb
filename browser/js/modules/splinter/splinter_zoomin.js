/**
 * ===BASE===// splinter // splinter_zoomin.js
 * @param 
 */

function splinter_zoomin(tag) {
    var b = gflag.browser.splinterTag == tag ? gflag.browser : gflag.browser.splinters[tag];
    b.cgiZoomin(2);
}
