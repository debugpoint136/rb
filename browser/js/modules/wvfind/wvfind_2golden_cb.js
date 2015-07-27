/**
 * ===BASE===// wvfind // wvfind_2golden_cb.js
 * @param 
 */

function wvfind_2golden_cb(key) {
    apps.wvfind.goldenbutt.disabled = false;
    if (!key) {
        print2console('Server error, please try again.', 2);
        return;
    }
    window.open(window.location.origin + window.location.pathname + 'roadmap/?pin=' + window.location.origin + window.location.pathname + 't/' + key, '_blank');
}

