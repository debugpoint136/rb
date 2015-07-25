function print2console(what, msgtype) {
    if (!msgconsole) {
        if (msgtype == 3) alert(what);
        return;
    }
    switch (msgtype) {
        case 0:
            // normal
            dom_addtext(msgconsole, what);
            dom_create('br', msgconsole);
            break;
        case 1:
            // done
            dom_addtext(msgconsole, what, '#2A9242');
            dom_create('br', msgconsole);
            break;
        case 2:
            // reminder or warning
            dom_create('div', msgconsole, 'color:#E4273A;').innerHTML = what;
            shake_dom(floatingtoolbox);
            break;
        case 3:
            // fatal error
            dom_create('div', msgconsole, 'color:white;background-color:#E3394A;').innerHTML = what;
            shake_dom(floatingtoolbox);
            break;
        default:
            return;
    }
    msgconsole.scrollTop = 9999;
}