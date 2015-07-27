/**
 * ===BASE===// app // invokeapp_closure.js
 * @param 
 */

function invokeapp_closure(call) {
    return function () {
        menu2_hide();
        call();
    }
}

